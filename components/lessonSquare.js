import HandTracker from "../components/handtracker";
// import styles from "./handtest.module.scss";
import { useState, useEffect } from "react";
import LessonDemo from "../components/lessonDemo";
import HandCheck from "../components/handcheck";
// import LeftRightModal from "../components/leftright";
import { Switch, FormControlLabel } from "@mui/material";




export default function LessonSquare({ lessonId, onClick }) {
    return (
        <div onClick={onClick} className="lessonSquare">
          <h3>{lessonId}</h3>
          <img src={`/images/icons/${lessonId}.png`} alt={`${lessonId}`} className="lessonimg"/>
        </div> 
    );
  };