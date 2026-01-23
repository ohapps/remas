import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { ReactNode } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      justifyContent: 'center',
      padding: '10px',
    },
    button: {
      width: '90%',
      maxWidth: '400px',
    },
  })
);

interface Props {
  children: ReactNode;
  click: () => void;
  disabled?: boolean;
}

const LargeButton: React.FC<Props> = ({
  children,
  click,
  disabled = false,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Button
        variant="outlined"
        color="primary"
        disabled={disabled}
        onClick={click}
        className={classes.button}
      >
        {children}
      </Button>
    </div>
  );
};

export default LargeButton;
