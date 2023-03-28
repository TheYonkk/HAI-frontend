import { FormControlLabel, Switch } from "@mui/material";
import Button from "@mui/material/Button";
import Head from "next/head";
import { useState } from "react";
import HandCheck from "../../components/handcheck";
import HandTracker from "../../components/handtracker";
import { siteTitle } from "../../components/layout";
import LeftRightModal from "../../components/leftright";
import LessonDemo from "../../components/lessonDemo";
import { lessonList } from "../index";
import { useRouter } from "next/router";

// required function from Next.js
export async function getStaticPaths() {
  // Returns an array that looks like this, which tells Next.js each sign id
  // [
  //   {
  //     params: {
  //       id: 'A'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'B'
  //     }
  //   }
  // ]
  // and also some other rendering params
  const paths = lessonList.map((lesson) => {
    return {
      params: {
        id: lesson,
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}

// required function from Next.js
export async function getStaticProps({ params }) {
  return {
    props: {
      params,
    },
  };
}

export default function Home({ params }) {
  // just using this so every keystroke doesn't send a request to the MediaPipe module
  const [apiEndpoint, setApiEndpoint] = useState("http://localhost:5000");
  const [gestureAccepted, setGestureAccepted] = useState(false);
  const [showHandMarkers, setShowHandMarkers] = useState(false);
  const [handDominant, setHandDominant] = useState(null);

  const lessonIdx = lessonList.indexOf(params.id);
  const lesson = params.id;

  const router = useRouter();

  const onSuccess = () => {
    setGestureAccepted(true);
  };

  const chooseHand = (handDominant) => {
    setHandDominant(handDominant);
  };

  const nextLesson = () => {
    setGestureAccepted(false);

    // navigate to the next lesson after determining what the next lesson is. wrap around if we're at the end
    const nextLessonIndex =
      (lessonList.indexOf(lesson) + 1) % lessonList.length;
    const nextLesson = lessonList[nextLessonIndex];

    // navigate to the next lesson
    router.push(`/lessons/${nextLesson}`).then(() => setGestureAccepted(false));
  };

  return (
    <>
      {/* <Layout pageName='Lesson One: Alphabets'> */}
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <LeftRightModal chooseHand={chooseHand} />
      <h1>Lesson {lessonIdx + 1}: Alphabets</h1>
      <section className="lesson">
        <section className="halfbox">
          {handDominant !== null && (
            <LessonDemo
              videoLink={`/images/lesson${lessonIdx + 1}.mov`}
              lessonTitle={lesson}
              handDominant={handDominant}
            />
          )}
        </section>
        <section className="halfbox">
          <HandTracker
            canvasWidth={1280 / 2}
            canvasHeight={720 / 2}
            apiEndpoint={apiEndpoint}
            gestureName={lesson}
            onSuccess={onSuccess}
            showHandMarkers={showHandMarkers}
          />
          <HandCheck
            message={
              gestureAccepted
                ? `Congratulations! You signed “${lesson}”!`
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
            sx={{ position: "absolute", top: "20px", color: "white" }}
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
