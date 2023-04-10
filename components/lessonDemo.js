import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./lessonDemo.module.css";

export default function LessonDemo({lessonTitle, handDominant}) {

    // const imageSrc = `/images/hands_annotated/${lessonTitle.toLowerCase()}.jpg`;
    const imageSrc = `/images/hands/${lessonTitle.toLowerCase()}.jpg`;

    return (<>
            <h2 className={styles.title}>{lessonTitle}</h2>
            {/* <iframe 
                width="560" 
                height="315" 
                src={videoLink} 
                frameborder="0"
                className={styles.lessonVideo}
            >
             </iframe> 
             <React.Fragment key={this.props.src}>
                <video src={this.props.src} />
                </React.Fragment>*/
             }
             <img src={imageSrc} width='100%' className={handDominant ? '' : styles.flipImage} alt={`A hand showing the ASL sign of ${lessonTitle}`}/>
            {/* <video width='100%' autoPlay muted loop className={handDominant ? styles.flipVid : ''} src={videoLink} /> */}
        </>
    )
}