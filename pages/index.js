import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import HandTracker from "../components/handtracker";
import styles from "./handtest.module.scss";
import { useState } from "react";
import LessonDemo from "../components/lessonDemo";
import HandCheck from "../components/handcheck";
import LeftRightModal from "../components/leftright";
import Button from "@mui/material/Button";
import { Switch, FormControlLabel } from "@mui/material";

export default function Home() {
  // just using this so every keystroke doesn't send a request to the MediaPipe module
  const [apiEndpoint, setApiEndpoint] = useState("http://localhost:5000");
  const [gestureAccepted, setGestureAccepted] = useState(false);
  const [showHandMarkers, setShowHandMarkers] = useState(false);
  const [handDominant, setHandDominant] = useState(null);
  const [lesson, setLesson] = useState(0);

  const onSuccess = () => {
    setGestureAccepted(true);
  };

  const chooseHand = (handDominant) => {
    setHandDominant(handDominant);
  };

  const nextLesson = () => {
    setGestureAccepted(false);
    console.log(lesson);
    if (lesson === 2) {
      setLesson(0);
    } else {
      setLesson(lesson + 1);
    }
  };

  const lessonList = ["A", "B", "F"];

  return (
    <>
      {/* <Layout pageName='Lesson One: Alphabets'> */}
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <LeftRightModal chooseHand={chooseHand} />
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
            canvasWidth={1280 / 2}
            canvasHeight={720 / 2}
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

      {/* </Layout> */}
    </>
  );
}
