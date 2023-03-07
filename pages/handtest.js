/**
 * @fileoverview
 * This file contains the code for the handtest page. It is a test page for the mediapipe hand tracking model.
 */

import HandTracker from "../components/handtracker";

const handtest = () => {
    return (
        <div>
            <HandTracker />
        </div>
    )
}

export default handtest;