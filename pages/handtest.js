/**
 * @fileoverview
 * This file contains the code for the handtest page. It is a test page for the mediapipe hand tracking model.
 */

import HandTracker from "../components/handtracker";
import styles from "./handtest.module.scss";
import { useState } from "react";

const handtest = () => {
  const [apiEndpoint, setApiEndpoint] = useState("http://localhost:5000");

  // just using this so every keystroke doesn't send a request to the MediaPipe module
  const [apiEndpointToSend, setApiEndpointToSend] = useState(
    "http://localhost:5000"
  );

  return (
    <div className={styles.mainContainer}>
      <div className={styles.endpointContainer}>
        <label htmlFor="apiEndpoint" >Backend API Endpoint: </label>
        <input
          type="text"
          id="apiEndpoint"
          value={apiEndpoint}
          onChange={(e) => {
            setApiEndpoint(e.target.value);
          }}
          width="100%"
        />
        <button
          onClick={() => {
            setApiEndpointToSend(apiEndpoint);
          }}
        >
          Set API Endpoint
        </button>

      </div>
      <div className={styles.handTrackerContainer}>
        <HandTracker
          canvasWidth={1280 / 2}
          canvasHeight={720 / 2}
          apiEndpoint={apiEndpointToSend}
          gestureName="A"
        />
      </div>
    </div>
  );
};

export default handtest;
