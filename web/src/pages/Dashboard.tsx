import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
} from '@material-ui/core';
import React from 'react';
import Page from '../components/Common/Page';
import { Link } from 'react-router-dom';
import { appRoutes } from '../config/app-config';
import RemasClient from '../clients/RemasClient';
import { useQuery } from 'react-query';
import { Query } from '../types/queryTypes';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    welcome: {
      paddingTop: 20,
      paddingBottom: 20,
      textAlign: 'left',
    },
    tableHeader: {
      backgroundColor: theme.palette.grey[100],
    },
    tableHeaderCell: {
      fontWeight: theme.typography.fontWeightBold,
    },
  })
);

const Dashboard: React.FC = () => {
  const classes = useStyles();
  const {
    isLoading: recentMarketsLoading,
    isError: recentMarketsError,
    data: recentMarkets,
  } = useQuery(Query.GET_RECENT_MARKETS, RemasClient.getRecentMarkets);
  const {
    isLoading: recentPropertiesLoading,
    isError: recentPropertiesError,
    data: recentProperties,
  } = useQuery(Query.GET_RECENT_PROPERTIES, RemasClient.getRecentProperties);

  return (
    <Page
      title="Dashboard"
      isLoading={recentMarketsLoading || recentPropertiesLoading}
      isError={recentMarketsError || recentPropertiesError}
    >
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Paper>
            <TableContainer>
              <Table aria-label="recent markets">
                <TableHead className={classes.tableHeader}>
                  <TableRow>
                    <TableCell className={classes.tableHeaderCell}>
                      Recently Updated Markets
                    </TableCell>
                  </TableRow>
                </TableHead>
                {recentMarkets && (
                  <TableBody>
                    {recentMarkets.map((market) => (
                      <TableRow key={market.id}>
                        <TableCell>
                          <Link to={`${appRoutes.MARKET_DETAIL}${market.id}`}>
                            {market.description}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
            <TableContainer>
              <Table aria-label="recent properties">
                <TableHead className={classes.tableHeader}>
                  <TableRow>
                    <TableCell className={classes.tableHeaderCell}>
                      Recently Updated Properties
                    </TableCell>
                  </TableRow>
                </TableHead>
                {recentProperties && (
                  <TableBody>
                    {recentProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell>
                          <Link
                            to={`${appRoutes.PROPERTY_DETAIL}${property.id}`}
                          >
                            {property.address}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Dashboard;
