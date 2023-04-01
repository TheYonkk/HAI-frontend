// import Head from "next/head";
// import Layout, { siteTitle } from "../components/layout";
// import utilStyles from "../styles/utils.module.css";
import HandTracker from "../components/handtracker";
// import styles from "./handtest.module.scss";
import { useState } from "react";
import LessonDemo from "../components/lessonDemo";
import HandCheck from "../components/handcheck";
// import LeftRightModal from "../components/leftright";
import { Switch, FormControlLabel } from "@mui/material";
import Button from "@mui/material/Button";


export default function LessonPage({handDominant, onSuccess, lessonList, apiEndpoint, showHandMarkers, setShowHandMarkers, gestureAccepted, setGestureAccepted}) {
  const [lesson, setLesson] = useState(0);
  
  const nextLesson = () => {
    setGestureAccepted(false);
    // console.log(lesson);
    if (lesson === 2) {
      setLesson(0);
    } else {
      setLesson(lesson + 1);
    }
  };
    return (<>
    <h1>Lesson {lesson + 1}: Alphabets</h1>
      <section className="lesson">
        <section className="halfbox">
          {handDominant !== null && (
            <LessonDemo
              videoLink={`/images/lesson${lesson + 1}.mov`}
              lessonTitle={lessonList[lesson]}
              handDominant={handDominant}
            />
          )}
        </section>
        <section className="halfbox">
          <HandTracker
            canvasWidth={1280}
            canvasHeight={720}
            apiEndpoint={apiEndpoint}
            gestureName={lessonList[lesson]}
            onSuccess={onSuccess}
            showHandMarkers={showHandMarkers}
          />
          <HandCheck
            message={
              gestureAccepted
                ? `Congratulations! You signed “${lessonList[lesson]}”!`
                : "Try to minimize the error bar on the bottom."
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={showHandMarkers}
                onChange={() => setShowHandMarkers(!showHandMarkers)}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label="Show Hand Markers"
            sx={{position: "absolute", top: "20px", color: "white"}}
          />

          {gestureAccepted && (
            <Button
              variant="contained"
              className="nextButton"
              onClick={() => {
                nextLesson();
              }}
              sx={{ position: "absolute", padding: "20px" }}
            >
              Next Lesson
            </Button>
          )}
        </section>
      </section>
      </>
    )
}
