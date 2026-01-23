import {
  AppBar,
  Button,
  createStyles,
  Hidden,
  IconButton,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { appConfig } from '../../config/app-config';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      [theme.breakpoints.up('sm')]: {
        marginLeft: appConfig.drawerWidth,
        width: `calc(100% - ${appConfig.drawerWidth}px)`,
      },
      backgroundColor: theme.palette.info.main,
    },
    title: {
      textAlign: 'left',
      flexGrow: 1,
    },
  })
);

interface Props {
  title: string;
  closeText?: string;
  closeUrl?: string;
  closeAction?: () => void;
  toggleMobileMenu: () => void;
}

const TitleBar: React.FC<Props> = ({
  title,
  closeText,
  closeUrl,
  closeAction,
  toggleMobileMenu,
}) => {
  const classes = useStyles();
  const history = useHistory();

  const onCloseClick = () => {
    if (closeUrl) {
      history.push(closeUrl);
    }
    closeAction && closeAction();
  };

  return (
    <AppBar className={classes.appBar}>
      <Toolbar>
        <Hidden smUp>
          <IconButton
            color="inherit"
            aria-label="open menu"
            edge="start"
            onClick={toggleMobileMenu}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <Typography variant="h6" className={classes.title}>
          {title}
        </Typography>
        {closeText && (closeUrl || closeAction) && (
          <Button variant="outlined" color="inherit" onClick={onCloseClick}>
            {closeText}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TitleBar;
