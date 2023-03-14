import { useEffect, useRef, useState } from "react";
import styles from "./lessonDemo.module.css";

export default function HandCheck({message}) {
    return (<div className={styles.textbox}>
        <p>{message}</p>
    </div>)
}