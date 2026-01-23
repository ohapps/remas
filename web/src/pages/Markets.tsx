import {
  createStyles,
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
import { useQuery } from 'react-query';
import RemasClient from '../clients/RemasClient';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableHeader: {
      backgroundColor: theme.palette.grey[100],
    },
    tableHeaderCell: {
      fontWeight: theme.typography.fontWeightBold,
    },
  })
);

const Markets: React.FC = () => {
  const classes = useStyles();
  const {
    isLoading,
    isError,
    data: markets,
  } = useQuery('getMarkets', RemasClient.getMarkets);

  return (
    <Page
      title="Markets"
      closeText="NEW MARKET"
      closeUrl={`${appRoutes.MARKET_DETAIL}new`}
      isLoading={isLoading}
      isError={isError}
    >
      <Paper>
        <TableContainer>
          <Table aria-label="markets table">
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>
                  Description
                </TableCell>
                <TableCell className={classes.tableHeaderCell}>
                  Location Type
                </TableCell>
                <TableCell className={classes.tableHeaderCell}>
                  Location
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {markets &&
                markets
                  .filter((m) => !m.parentMarket)
                  .map((market) => (
                    <TableRow key={market.id}>
                      <TableCell>
                        <Link to={`${appRoutes.MARKET_DETAIL}${market.id}`}>
                          {market.description}
                        </Link>
                      </TableCell>
                      <TableCell>{market.locationType}</TableCell>
                      <TableCell>{market.location}</TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Page>
  );
};

export default Markets;
