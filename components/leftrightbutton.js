import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import styles from "./lessonDemo.module.css";
import { useEffect, useRef, useState } from "react";

export default function LeftRightButton(item, handleOpen, setHand) {
    const [open, setOpen] = React.useState(true);
    handleOpen = (event) => {
        setHand(event.target.innerText);
        setOpen(false);
    }
    return(<>
    <Button
                onClick={handleOpen}
                variant="contained"
                sx={{
                    margin: '5% 7%',
                    padding: '5% 7%',
                    borderRadius: '10px',
            }}>
                {item}
            </Button>
    </>)
}