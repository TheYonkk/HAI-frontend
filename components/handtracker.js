import { useEffect, useRef, useState } from "react";
import { Results, Hands, HAND_CONNECTIONS, VERSION } from "@mediapipe/hands";
import {
  drawConnectors,
  drawLandmarks,
  Data,
  lerp,
} from "@mediapipe/drawing_utils";
import styles from "./handtracker.module.scss";

/**
 * A React component that uses MediaPipe to track the user's hands and draw the hand landmarks and connections on a canvas element.
 * The component also sends the hand data to an API endpoint.
 * @param {integer} canvasWidth The width of the canvas elementin pixels (video + overlay)
 * @param {integer} canvasHeight The height of the canvas element in pixels (video + overlay)
 * @param {string} apiEndpoint The endpoint of the API that will be used to send the hand data to
 * @returns 
 */
export default function HandTracker({canvasWidth, canvasHeight, apiEndpoint}) {
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
        hands.onResults(() => {});
        hands.close();
      };
    }
  }, [inputVideoReady, apiEndpoint]); // needs apiEndpoint to be in dependency array so that useEffect is called when apiEndpoint changes and the onResults is updated

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

      // send hand data to API endpoint
      fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resultsNoImage),

      }).then((response) => {
        // successfully communicated with API endpoint
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          
          // read async JSON response by creating async function and calling it
          (async () => {
            const json = await response.json();
            console.log(json);
          })();

        } else {
          console.log("API endpoint did not return JSON");
        }

      }).catch((error) => {
        // error communicating with API endpoint
        console.log(error);
      });

    }



    // wait until canvas is loaded (context is 2d canvas)
    if (canvasRef.current && contextRef.current) {
      setLoaded(true);

      // clear canvas
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

      // draw hands
      if (results.multiHandLandmarks && results.multiHandedness) {
        // iterate through each hand
        for (
          let index = 0;
          index < results.multiHandLandmarks.length;
          index++
        ) {
          // draw the hand landmarks and connections
          const classification = results.multiHandedness[index];
          const isRightHand = classification.label === "Right";
          const landmarks = results.multiHandLandmarks[index];
          drawConnectors(contextRef.current, landmarks, HAND_CONNECTIONS, {
            color: isRightHand ? "#00FF00" : "#FF0000",
          });
          drawLandmarks(contextRef.current, landmarks, {
            color: isRightHand ? "#00FF00" : "#FF0000",
            fillColor: isRightHand ? "#FF0000" : "#00FF00",
            radius: (data) => {
              return lerp(data.from.z, -0.15, 0.1, 10, 1);
            },
          });
        }
      }

      // restore canvas
      contextRef.current.restore();
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
