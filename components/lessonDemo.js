import { useEffect, useRef, useState } from "react";
import styles from "./lessonDemo.module.css";

export default function LessonDemo({videoLink, lessonTitle}) {
    return (<>
            <h2 className={styles.title}>{lessonTitle}</h2>
            {/* <iframe 
                width="560" 
                height="315" 
                src={videoLink} 
                frameborder="0"
                className={styles.lessonVideo}
            >
             </iframe> */}
            <video width="100%" autoPlay muted loop>
                <source src={videoLink} type="video/mp4"/>
            </video>
        </>
    )
}