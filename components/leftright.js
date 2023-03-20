import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import styles from "./lessonDemo.module.css";


const LeftRightModal = ({chooseHand}) => {
  const [open, setOpen] = React.useState(true);

    const handleOpen = () => {
        setOpen(false);
    }
  return (
    <div>
      <Modal
        open={open}
        // onClose={handleClose}
      >
        <Box className={styles.leftright}>
          <h2>Which is your dominant hand?</h2>
          <div>
            <Button
              onClick={() => {
                handleOpen();
                chooseHand(true);
              }}
              variant="contained"
              sx={{
                margin: '5% 7%',
                padding: '5% 7%',
                borderRadius: '10px',
            }}>
                Left
            </Button>
            <Button 
              onClick={() => {
                handleOpen();
                chooseHand(false);
              }}
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
export default LeftRightModal;