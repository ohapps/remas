import {
  CircularProgress,
  createStyles,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React from 'react';
import loadingGif from '../../assets/loading.gif';

const useStyles = makeStyles(() =>
  createStyles({
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '98vh',
    },
  })
);

interface Props {
  useAnimatedGif?: boolean;
}

const Loading: React.FC<Props> = ({ useAnimatedGif = false }) => {
  const classes = useStyles();
  return (
    <div className={classes.loading}>
      {useAnimatedGif ? (
        <div style={{ textAlign: 'center' }}>
          <Typography variant="h4">Application Loading</Typography>
          <img src={loadingGif} alt="loading..." />
        </div>
      ) : (
        <CircularProgress size="100px" />
      )}
    </div>
  );
};

export default Loading;
