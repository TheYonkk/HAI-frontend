// import Head from "next/head";
// import Layout, { siteTitle } from "../components/layout";
// import utilStyles from "../styles/utils.module.css";
import HandTracker from "../components/handtracker";
// import styles from "./handtest.module.scss";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LessonDemo from "../components/lessonDemo";
import HandCheck from "../components/handcheck";
// import LeftRightModal from "../components/leftright";
import { Switch, FormControlLabel } from "@mui/material";
import Button from "@mui/material/Button";

export default function LessonPage({
  handDominant,
  onSuccess,
  lessonList,
  apiEndpoint,
  showHandMarkers,
  setShowHandMarkers,
  gestureAccepted,
  setGestureAccepted,
  index,
  setStartLesson,
}) {
  const [lesson, setLesson] = useState(index);
  const [timeUp, setTimeUp] = useState(false);

  const router = useRouter();

  const nextLesson = () => {
    setGestureAccepted(false);
    // console.log(lesson);
    let nextLesson = lesson + 1;
    if (lesson === lessonList.length - 1) {
      nextLesson = 0;
    }
    setLesson(nextLesson);

    // save progress in the URL bar in case the user needs to reload
    router.push({
      query: { lessonId: nextLesson, handDominant: handDominant },
    });
  };

  useEffect(() => {
    let time = null;
    if (!timeUp) {
      time = setTimeout(() => setTimeUp(true), 30000);
    }
    return () => clearTimeout(time);
  }, [timeUp]);

  useEffect(() => {
    let timer = null;
    if (gestureAccepted) {
      timer = setTimeout(() => {
        console.log("next lesson");
        nextLesson();
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [gestureAccepted, nextLesson]);

  return (
    <>
      <h1>Lesson {lesson + 1}: Alphabets</h1>
      {/* <img src="/images/icons/arrow.png" alt="back arrow" className="backArrow"/> */}
      <svg width="30" height="30" viewBox="0 0 41 38" xmlns="http://www.w3.org/2000/svg" className="backArrow" onClick={() => setStartLesson(false)}>
      <path d="M38.0015 21.7302C39.3822 21.7302 40.5015 20.6109 40.5015 19.2302C40.5015 17.8495 39.3822 16.7302 38.0015 16.7302V21.7302ZM1.2337 17.4625C0.257387 18.4388 0.257387 20.0217 1.2337 20.998L17.1436 36.9079C18.1199 37.8842 19.7028 37.8842 20.6791 36.9079C21.6554 35.9316 21.6554 34.3487 20.6791 33.3724L6.537 19.2302L20.6791 5.08809C21.6554 4.11178 21.6554 2.52887 20.6791 1.55256C19.7028 0.576244 18.1199 0.576244 17.1436 1.55256L1.2337 17.4625ZM38.0015 16.7302L3.00146 16.7302V21.7302L38.0015 21.7302V16.7302Z"/>
      </svg>
      <section className="lesson">
        <section className="halfbox">
          {handDominant !== null && (
            <LessonDemo
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
            sx={{ position: "absolute", top: "20px", color: "white", textShadow: "2px 2px 10px rgba(0,0,0,0.7)" }}
          />
          {timeUp && !gestureAccepted && (
            <button
              className="nextButton"
              onClick={() => {
                nextLesson();
                setTimeUp(false);
                //timer();
              }}
            >
              Skip
            </button>
          )}
          {gestureAccepted && (
            // <Button
            //   variant="contained"
            //   className="nextButton"
            //   onClick={() => {
            //     nextLesson();
            //   }}
            //   sx={{ position: "absolute", padding: "20px" }}
            // >
            //   Next Lesson
            // </Button>
            // when timer is up, show next lesson button
            <button
              className="playflix-button"
              data-label="Next Lesson"
              onClick={() => {
                nextLesson();
                setTimeUp(false);
              }}
            ></button>
          )}
        </section>
      </section>
    </>
  );
}
