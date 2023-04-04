import { useEffect, useRef, useState } from "react";
import { Results, Hands, HAND_CONNECTIONS, VERSION } from "@mediapipe/hands";
import {
  drawConnectors,
  drawLandmarks,
  Data,
  lerp,
} from "@mediapipe/drawing_utils";
import styles from "./handtracker.module.scss";

const MAX_HAND_ERROR = 3.5; // max error for the error bar

/**
 * A React component that uses MediaPipe to track the user's hands and draw the hand landmarks and connections on a canvas element.
 * The component also sends the hand data to an API endpoint.
 * @param {integer} canvasWidth The width of the canvas elementin pixels (video + overlay)
 * @param {integer} canvasHeight The height of the canvas element in pixels (video + overlay)
 * @param {string} apiEndpoint The endpoint of the API that will be used to send the hand data to
 * @param {function} onSuccess A callback function that will be called when the backend API returns
 * @param {string} gestureName The name of the gesture to be tracked
 * @param {boolean} showHandMarkers Whether or not to show the hand markers
 * @returns
 */
export default function HandTracker({
  canvasWidth,
  canvasHeight,
  apiEndpoint,
  gestureName,
  onSuccess,
  showHandMarkers = true,
}) {
  const [inputVideoReady, setInputVideoReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const inputVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    // wait until video is loaded
    if (!inputVideoReady) {
      return;
    }

    // both video element and canvas elements are loaded (note that webcam is not loaded yet)
    if (inputVideoRef.current && canvasRef.current) {
      // set up canvas
      contextRef.current = canvasRef.current.getContext("2d");

      // get the user's video/webcam stream then 1) set the video source to the stream and 2) send the stream to MediaPipe
      const constraints = {
        video: { width: { min: 1280 }, height: { min: 720 } },
      };
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        if (inputVideoRef.current) {
          inputVideoRef.current.srcObject = stream;
        }
        sendToMediaPipe();
      });

      // set up MediaPipe hands
      const hands = new Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${VERSION}/${file}`,
      });

      // set up MediaPipe hands options. See https://google.github.io/mediapipe/solutions/hands.html#configuration-options
      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      // set up MediaPipe hands callbacks. When media pipe finishes processing the video, it will call the onResults function
      // that is where we will draw the hand landmarks and connections
      hands.onResults(onResults);

      // function that continuously sends the video stream to MediaPipe
      const sendToMediaPipe = async () => {
        if (inputVideoRef.current) {
          if (!inputVideoRef.current.videoWidth) {
            requestAnimationFrame(sendToMediaPipe);
          } else {
            await hands.send({ image: inputVideoRef.current });
            requestAnimationFrame(sendToMediaPipe);
          }
        }
      };

      // remove the event listener when the component is unmounted
      return () => {
        // hands.onResults(() => {});
        hands.close();
      };
    }
  }, [inputVideoReady, apiEndpoint, gestureName, showHandMarkers]); // needs apiEndpoint to be in dependency array so that useEffect is called when apiEndpoint changes and the onResults is updated

  /**
   * Callback for when MediaPipe finishes processing the video stream and has some results for us.
   * @param {results} results
   */
  const onResults = (results) => {
    // send hand data to API endpoint if at least one hand is detected
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      // remove image data from results
      const resultsNoImage = { ...results };
      delete resultsNoImage.image;
      // re-add image width and height only (we really, really do not need this. please do not rely on this)
      resultsNoImage.image = {};
      resultsNoImage.image.width = results.image.width;
      resultsNoImage.image.height = results.image.height;
      // add guesture name
      resultsNoImage.gesture = gestureName ? gestureName : ""; // ensures that gestureName is a string sent to the API

      // send hand data to API endpoint
      fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resultsNoImage),
      })
        .then((response) => {
          // successfully communicated with API endpoint
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            // read async JSON response by creating async function and calling it
            (async () => {
              const json = await response.json();

              // if the API returns true, then the gesture was accepted
              if (json && json.accepted === "True") {
                onSuccess?.(); // call if onSuccess is defined
              }
              // console.log(json);

              // the webcam image with a progress bar
              if (canvasRef.current && contextRef.current) {
                contextRef.current.save();
                contextRef.current.clearRect(
                  0,
                  0,
                  canvasRef.current.width,
                  canvasRef.current.height
                );
                contextRef.current.drawImage(
                  results.image,
                  0,
                  0,
                  canvasRef.current.width,
                  canvasRef.current.height
                );

                // if showHandMarkers is true, then draw the hand markers
                if (showHandMarkers) {
                  for (
                    let index = 0;
                    index < results.multiHandLandmarks.length;
                    index++
                  ) {
                    const landmarks = results.multiHandLandmarks[index];
                    const classification = results.multiHandedness[index];
                    const isRightHand = classification.label === "Right";
                    drawConnectors(
                      contextRef.current,
                      landmarks,
                      HAND_CONNECTIONS,
                      { 
                        color: "rgba(102, 163, 196, 0.75)", 
                        lineWidth: 2,
                      }
                    );
                    drawLandmarks(contextRef.current, landmarks, {
                      fillColor: "rgba(26, 107, 150, 0.75)",
                      color: "rgba(102, 163, 196, 0.5)",
                      radius: (data) => {
                        return lerp(data.from.z, -0.15, 0.1, 6, 1);
                      },
                    });
                  }
                }

                // draw progress bar
                const barWidth = canvasRef.current.width / 2;
                const barHeight = 20;
                const error = json.error;
                const tolerance = json.tolerance;

                // figure out how much of the progress bar to fill in
                let barFill = 0;
                if (error < tolerance) {
                  barFill = 0;
                } else if (error > MAX_HAND_ERROR) {
                  barFill = 1.0;
                } else {
                  barFill = (error - tolerance) / (MAX_HAND_ERROR - tolerance);
                }

                // draw a centered progress bar on the bottom of the screen that closes in towrads the center of the screen as the error decreases
                contextRef.current.save();

                // draw the background bar
                contextRef.current.fillStyle = "rgba(0, 0, 0, 0.5)";
                contextRef.current.fillRect(
                  canvasRef.current.width / 2 - barWidth / 2,
                  canvasRef.current.height - barHeight * 2,
                  barWidth,
                  barHeight
                );

                // draw the progress bar, centered in the background bar
                contextRef.current.fillStyle = "rgba(35, 143, 201, 0.7)";
                contextRef.current.fillRect(
                  canvasRef.current.width / 2 - (barWidth * barFill) / 2,
                  canvasRef.current.height - barHeight * 2,
                  (barWidth * barFill) / 1,
                  barHeight
                );

                contextRef.current.restore();
              }
            })();
          } else {
            console.log("API endpoint did not return JSON");
          }
        })
        .catch((error) => {
          // error communicating with API endpoint
          console.log(error);

          // just draw the webcam image
          if (canvasRef.current && contextRef.current) {
            contextRef.current.save();
            contextRef.current.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
            contextRef.current.drawImage(
              results.image,
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
          }

          // let the user know that the backend is not working/available. Remember to write the text backwards
          // because the image is flipped into selfie-mode in CSS
          if (canvasRef.current && contextRef.current) {
            contextRef.current.save();

            contextRef.current.fillStyle = "rgba(0, 0, 0, 0.5)";
            contextRef.current.fillRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
            contextRef.current.fillStyle = "rgba(255, 255, 255, 0.75)";

            // center the context and flip it horizontally
            contextRef.current.translate(
              canvasRef.current.width / 2,
              canvasRef.current.height / 2
            );
            contextRef.current.scale(-1, 1);

            // write the text
            contextRef.current.font = "24px Arial";
            contextRef.current.textAlign = "center";
            contextRef.current.fillText(
              "Error communicating with API endpoint",
              0,
              0
            );
            contextRef.current.restore();
          }
          
        });
    } else {
      // no hand data, so just draw the webcam image
      if (canvasRef.current && contextRef.current) {
        contextRef.current.save();
        contextRef.current.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        contextRef.current.drawImage(
          results.image,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
    }
  };

  return (
    <div className={styles.handsContainer}>
      <video
        autoPlay
        ref={(el) => {
          inputVideoRef.current = el;
          setInputVideoReady(!!el);
        }}
        className={styles.inputVideo}
      />
      <div className={styles.canvasContainer}>
        <canvas
          className={styles.outputCanvas}
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
        />
      </div>
    </div>
  );
}
