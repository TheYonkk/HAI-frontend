import { useEffect, useRef, useState } from "react";
import styles from "./lessonDemo.module.css";

export default function HandCheck({message, gestureAccepted}) {
    // const successClass = gestureAccepted ? styles.success : '';

    return (
    //<div className={`${styles.textbox} ${gestureAccepted ? styles.success : ''}`}>
    <div className={`textbox ${gestureAccepted ? 'success' : ''}`}>
        <p>{message}</p>
    </div>)
}