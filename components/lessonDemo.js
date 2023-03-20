import { useEffect, useRef, useState } from "react";
import styles from "./lessonDemo.module.css";

export default function LessonDemo({videoLink, lessonTitle, handDominant}) {
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
            <video width='100%' autoPlay muted loop className={handDominant ? styles.flipVid : ''} src={videoLink} />
        </>
    )
}