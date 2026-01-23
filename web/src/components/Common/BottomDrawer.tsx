import React from 'react';
import {
  createStyles,
  Drawer,
  IconButton,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bottomDrawer: {
      borderTop: `3px solid ${theme.palette.info.main}`,
    },
    drawerContainer: {
      borderTop: `4px solid ${theme.palette.info.main}`,
    },
    drawerContents: {
      maxWidth: '800px',
      width: '100vw',
      margin: 'auto',
      padding: '0px 20px',
    },
    drawerTitle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  })
);

interface Props {
  drawerOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const BottomDrawer: React.FC<Props> = ({
  drawerOpen,
  onClose,
  children,
  title,
}) => {
  const classes = useStyles();

  return (
    <Drawer
      anchor="bottom"
      open={drawerOpen}
      onClose={onClose}
      className={classes.bottomDrawer}
    >
      <div className={classes.drawerContainer}>
        <div className={classes.drawerContents}>
          <div className={classes.drawerTitle}>
            <Typography variant="h5" gutterBottom>
              {title}
            </Typography>
            <IconButton aria-label="close drawer" onClick={onClose}>
              <CancelIcon fontSize="large" />
            </IconButton>
          </div>
          {children}
        </div>
      </div>
    </Drawer>
  );
};

export default BottomDrawer;
