import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import styles from "./lessonDemo.module.css";

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: '50%',
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
//   textAlign: 'center',
// };

export default function LeftRightModal() {
  const [open, setOpen] = React.useState(true);
//   const handleOpen = () => setOpen(false);
  const [hand, setHand] = React.useState('');
//   const handleClose = () => setOpen(false);

    const handleOpen = (event) => {
        setHand(event.target.innerText);
        setOpen(false);
    }
    // also return hand to parent component
  return (
    <div>
      <Modal
        open={open}
        // onClose={handleClose}
      >
        <Box className={styles.leftright}>
          <h2>What hand is your dominant hand?</h2>
          <div>
            <Button
                onClick={handleOpen}
                variant="contained"
                sx={{
                    margin: '5% 7%',
                    padding: '5% 7%',
                    borderRadius: '10px',
            }}>
                Left
            </Button>
            <Button 
                onClick={handleOpen}
                variant="contained" 
                sx={{
                    margin: '5% 7%',
                    padding: '5% 7%',
                    borderRadius: '10px',
            }}>
                Right
            </Button>
            </div>
        </Box>
      </Modal>
    </div>
  );
}