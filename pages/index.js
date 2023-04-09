import Head from "next/head";
// import Layout, { siteTitle } from "../components/layout";
// import utilStyles from "../styles/utils.module.css";
// import HandTracker from "../components/handtracker";
// import styles from "./handtest.module.scss";
import { useState, useEffect } from "react";
// import LessonDemo from "../components/lessonDemo";
// import HandCheck from "../components/handcheck";
// import LeftRightModal from "../components/leftright";
// import Button from "@mui/material/Button";
// import { Switch, FormControlLabel } from "@mui/material";
import LessonPage from "../components/lessonPage";
import LessonSquare from "../components/lessonSquare";

// backend urls ranked by priority. (we should always prefer local server, as it's faster)
export const SERVER_ADDRESSES = [ "http://127.0.0.1:8080", "http://127.0.0.1:5000", "https://api.daveyonkers.com" ]

export default function Home() {
  // just using this so every keystroke doesn't send a request to the MediaPipe module
  const [serverAddressIndex, setServerAddressIndex] = useState(0);
  const [gestureAccepted, setGestureAccepted] = useState(false);
  const [showHandMarkers, setShowHandMarkers] = useState(false);
  const [handDominant, setHandDominant] = useState(null);
  // const [lesson, setLesson] = useState(0);
  const [startLesson, setStartLesson] = useState(false);
  const [lessonId, setLessonId] = useState(null);

  // useEffect(() => {
  //   const item = localStorage.getItem('handDominant');
  //   item ? setHandDominant(item) : setHandDominant(null);
  // }, [])
 
  const onSuccess = () => {
    setGestureAccepted(true);
  };

  // upon first load, try to connect to the local servers. if it fails, keep trying to connect to the servers in the list until
  // the last server is reached. The last server if the remote server, which is the slowest, but it should be up.
  useEffect(() => {
    const tryConnect = async () => {
      try {
        const response = await fetch(SERVER_ADDRESSES[serverAddressIndex]);
        if (response.ok) {
          console.log("connected to backend server: ", SERVER_ADDRESSES[serverAddressIndex]);
        } else {
          console.warn("failed to connect to backend server", SERVER_ADDRESSES[serverAddressIndex]);
          if (serverAddressIndex < SERVER_ADDRESSES.length - 1){
            setServerAddressIndex(serverAddressIndex + 1);
          }
        }
      } catch (error) {
        console.warn("failed to connect to backend server", SERVER_ADDRESSES[serverAddressIndex]);
        if (serverAddressIndex < SERVER_ADDRESSES.length - 1){
          setServerAddressIndex(serverAddressIndex + 1);
        }
      }
    }
    tryConnect();
  }, [serverAddressIndex]);


  // const chooseHand = (handDominant) => {
  //   setHandDominant(handDominant);
  // };

  // const nextLesson = () => {
  //   setGestureAccepted(false);
  //   // console.log(lesson);
  //   if (lesson === 2) {
  //     setLesson(0);
  //   } else {
  //     setLesson(lesson + 1);
  //   }
  // };

  // R, S ommitted for bad image
  const lessonList = "ABCDEFGHIKLMNOPQTUVWXY".split('');

  const handleLessonClick = (index) => {
    // Handle the click event for LessonSquare here
    // You can customize this part to directly render the content of the lesson on the home page
    // console.log(`LessonSquare clicked: ${lessonId}`);
    setStartLesson(true);
    setLessonId(index);
  };

  return (
    <>
      {/* <Layout pageName='Lesson One: Alphabets'> */}
      <Head>
        <title>Talk to the Hand</title>
      </Head>
      {!handDominant && <section className="landing">
        <div className="landTitle">
          <h1 className="title">Talk to the Hand</h1>
          <p className="tagline">An ASL Learning Tool</p>
        </div>
        
        {/* <div className="landWelcome">
          <img src="/images/learn.png" alt="Learn" />
          <img src="/images/to.png" alt="to" />
          <img src="/images/sign.png" alt="Sign" />
        </div> */}

        <div className="landWelcome">
          {/* <div className="word">
          <div className="hover">
            <div></div><div></div><img src="/images/landing/l.png" alt="l" /></div> */}
          <img src="/images/landing/l.png" alt="l" />
          <img src="/images/landing/e.png" alt="e" />
          <img src="/images/landing/a.png" alt="a" />
          <img src="/images/landing/r.png" alt="r" />
          <img src="/images/landing/n.png" alt="n" />
          <img src="/images/landing/t.png" alt="t" />
          <img src="/images/landing/o.png" alt="o" />
          <img src="/images/landing/s.png" alt="s" />
          <img src="/images/landing/i.png" alt="i" />
          <img src="/images/landing/g.png" alt="g" />
          <img src="/images/landing/n.png" alt="n" />
          </div>

        <div className="landButtons">
          <div className="landWrapper">
            <p>Welcome to <i>Talk to the Hand</i>- your go-to resource for learning ASL. Let's get started by identifying your dominant hand!</p>
            {/* <button>Left</button>
            <button>Right</button> */}
            <div 
            id="left"
            onClick={() => {
              localStorage.setItem('handDominant', JSON.stringify(true));
              setHandDominant(true);
              //setStartLesson(true);
            }}></div>
            <div id="right"
            onClick={() => {
              localStorage.setItem('handDominant', JSON.stringify(false));
              setHandDominant(false);
              //setStartLesson(true);
            }}></div>
          </div>
        </div>
        {/* </div> */}
      </section>}

      {(!startLesson && handDominant != null) && <section className="lessonList">
        <h1>Lessons List</h1>
        <div className="lessonGrid">
          {lessonList.map((lesson, index) => (
            <LessonSquare key={index} lessonId={lesson} onClick={() => handleLessonClick(index)} />
          ))}
        </div>
      </section>}


      {/* <LeftRightModal chooseHand={chooseHand} /> */}
      {startLesson && <LessonPage 
        handDominant={handDominant} 
        lessonList={lessonList} 
        onSuccess={onSuccess} 
        apiEndpoint={SERVER_ADDRESSES[serverAddressIndex]} 
        showHandMarkers={showHandMarkers} 
        setShowHandMarkers={setShowHandMarkers} 
        gestureAccepted={gestureAccepted}
        setGestureAccepted={setGestureAccepted}
        index={lessonId}
        setStartLesson={setStartLesson}/>}
      
      {/* <h1>Lesson {lesson + 1}: Alphabets</h1>
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
      </section> */}

      {/* </Layout> */}
    </>
  );
}
