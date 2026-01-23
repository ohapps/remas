import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  createStyles,
  makeStyles,
  Theme,
  Paper,
} from '@material-ui/core';
import React from 'react';
import { Market } from '../../types/userTypes';
import { Link, useHistory } from 'react-router-dom';
import { appRoutes } from '../../config/app-config';
import LargeButton from '../Common/LargeButton';
import { useQuery } from 'react-query';
import RemasClient from '../../clients/RemasClient';
import { Query } from '../../types/queryTypes';

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

interface Props {
  market: Market;
}

const SubMarkets: React.FC<Props> = ({ market }) => {
  const classes = useStyles();
  const history = useHistory();
  const { isLoading, data: markets } = useQuery(
    Query.GET_MARKETS,
    RemasClient.getMarkets
  );

  if (!!market.parentMarket || isLoading) {
    return null;
  }

  const subMarkets =
    markets && markets.filter((m) => m.parentMarket?.id === market.id);

  return (
    <Paper>
      <TableContainer>
        <Table aria-label="markets table">
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell className={classes.tableHeaderCell} colSpan={2}>
                Submarkets
              </TableCell>
            </TableRow>
          </TableHead>
          {subMarkets && (
            <TableBody>
              {subMarkets.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <Link to={`${appRoutes.MARKET_DETAIL}${m.id}`}>
                      {m.description}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <LargeButton
        click={() => {
          history.push(`${appRoutes.MARKET_DETAIL}new/parent/${market.id}`);
        }}
      >
        NEW SUBMARKET
      </LargeButton>
    </Paper>
  );
};

export default SubMarkets;
