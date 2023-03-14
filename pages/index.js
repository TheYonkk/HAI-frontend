import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import HandTracker from "../components/handtracker";
import styles from "./handtest.module.scss";
import { useState } from "react";
import LessonDemo from '../components/lessonDemo';
import HandCheck from '../components/handcheck';
import LeftRightModal from '../components/leftright';


export default function Home() {
  // just using this so every keystroke doesn't send a request to the MediaPipe module
  const [apiEndpointToSend, setApiEndpointToSend] = useState(
    "http://localhost:5000"
  );
  return (<>
    {/* <Layout pageName='Lesson One: Alphabets'> */}
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <LeftRightModal/>
      <h1>Lesson One: Alphabets</h1>
      <section className='lesson'>
        <section className='halfbox'>
          <LessonDemo 
            videoLink='/images/lesson1.mov'
            lessonTitle='A'
          />
        </section>
        <section className='halfbox'>
            <HandTracker
              canvasWidth={540}
              canvasHeight={360}
              apiEndpoint={apiEndpointToSend}
            />
            <HandCheck
              message={'Almost there! Move your thumb towards your fist to sign “A”!'}
            />
        </section>
      </section>
      
    {/* </Layout> */}
    </>
  )
}
