import {
  createStyles,
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import React from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PublicIcon from '@material-ui/icons/Public';
import HomeIcon from '@material-ui/icons/Home';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { appConfig, appRoutes } from '../../config/app-config';
import { useAuth0 } from '@auth0/auth0-react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    link: {
      textDecoration: 'none',
      color: 'black',
      fontWeight: 'bold',
    },
    drawer: {
      display: 'flex',
      justifyContent: 'space-between',
      backgroundColor: theme.palette.grey[100],
      width: appConfig.drawerWidth,
      flexShrink: 0,
    },
    title: {
      height: appConfig.titleBarHeight - 8,
    },
  })
);

const SidebarContent: React.FC = () => {
  const classes = useStyles();
  const { logout } = useAuth0();
  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <List>
        <ListItem className={classes.title}>
          <Typography>REMAS</Typography>
        </ListItem>
        <Divider />
        <Link className={classes.link} to={appRoutes.DASHBOARD}>
          <ListItem button>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText>Dashboard</ListItemText>
          </ListItem>
        </Link>
        <Link className={classes.link} to={appRoutes.MARKETS}>
          <ListItem button>
            <ListItemIcon>
              <PublicIcon />
            </ListItemIcon>
            <ListItemText>Markets</ListItemText>
          </ListItem>
        </Link>
        <Link className={classes.link} to={appRoutes.PROPERTIES}>
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText>Properties</ListItemText>
          </ListItem>
        </Link>
        <Link className={classes.link} to={appRoutes.LEDGER}>
          <ListItem button>
            <ListItemIcon>
              <MonetizationOnIcon />
            </ListItemIcon>
            <ListItemText>Ledger</ListItemText>
          </ListItem>
        </Link>
        <Link className={classes.link} to={appRoutes.TRAVEL}>
          <ListItem button>
            <ListItemIcon>
              <DriveEtaIcon />
            </ListItemIcon>
            <ListItemText>Travel</ListItemText>
          </ListItem>
        </Link>
        <Link className={classes.link} to={appRoutes.SETTINGS}>
          <ListItem button>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </ListItem>
        </Link>
      </List>
      <List>
        <Divider />
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </ListItem>
      </List>
    </>
  );
};

interface Props {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const Sidebar: React.FC<Props> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Hidden smUp>
        <Drawer
          variant="temporary"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          classes={{
            paper: classes.drawer,
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <SidebarContent />
        </Drawer>
      </Hidden>
      <Hidden xsDown>
        <Drawer
          anchor="left"
          variant="permanent"
          className={classes.drawer}
          classes={{
            paper: classes.drawer,
          }}
        >
          <SidebarContent />
        </Drawer>
      </Hidden>
    </div>
  );
};

export default Sidebar;
