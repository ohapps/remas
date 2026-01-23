import {
  Avatar,
  Card,
  createStyles,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
} from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import Page from '../components/Common/Page';
import AssessmentIcon from '@material-ui/icons/Assessment';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import { appRoutes } from '../config/app-config';

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
  })
);

const Settings: React.FC = () => {
  const classes = useStyles();
  return (
    <Page title="Settings">
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6}>
          <Card>
            <Link className={classes.link} to={appRoutes.SETTINGS_METRICS}>
              <ListItem button>
                <ListItemIcon>
                  <Avatar>
                    <AssessmentIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary="Edit Market Metric Questions"
                  secondary="add, edit or remove market metric questions that apply to all markets"
                />
              </ListItem>
            </Link>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <Link className={classes.link} to={appRoutes.SETTINGS_EXPENSES}>
              <ListItem button>
                <ListItemIcon>
                  <Avatar>
                    <MoneyOffIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary="Edit Default Expenses"
                  secondary="add, edit or remove default expenses that apply to each new property"
                />
              </ListItem>
            </Link>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Settings;
