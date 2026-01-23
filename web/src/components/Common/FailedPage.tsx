import { Button, Typography } from '@material-ui/core';
import React from 'react';
import failedGif from '../../assets/robot_fail.jpg';

const FailedPage = () => {
  return (
    <div>
      <div>
        <img src={failedGif} alt="failed robot" />
      </div>
      <Typography variant="h4">Sorry, page failed to load</Typography>
      <Button
        style={{ marginTop: '20px' }}
        variant="outlined"
        color="primary"
        onClick={() => {
          window.location.reload();
        }}
      >
        RELOAD PAGE
      </Button>
    </div>
  );
};

export default FailedPage;
