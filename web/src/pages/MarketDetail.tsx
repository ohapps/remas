import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router-dom';
import MarketForm from '../components/Market/MarketForm';
import MarketMetrics from '../components/Market/MarketMetrics';
import SubMarkets from '../components/Market/SubMarkets';
import Page from '../components/Common/Page';
import { appRoutes } from '../config/app-config';
import { Market } from '../types/userTypes';
import MarketRents from '../components/Market/MarketRents';
import MarketMap from '../components/Market/MarketMap';
import { useQuery } from 'react-query';
import RemasClient from '../clients/RemasClient';
import MarketProperties from '../components/Market/MarketProperties';

interface UrlParams {
  id: string;
  parent: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column-reverse',
      },
    },
  })
);

const defaultMarket: Market = {
  id: '',
  description: '',
  locationType: 'CITY_STATE',
  location: '',
  metrics: [],
  rents: [],
};

const MarketDetail: React.FC = () => {
  const classes = useStyles();
  const { id, parent } = useParams<UrlParams>();
  const {
    isLoading,
    isError,
    data: markets,
  } = useQuery('getMarkets', RemasClient.getMarkets);
  const {
    isLoading: isPropertiesLoading,
    isError: isPropertiesError,
    data: properties,
  } = useQuery('getProperties', RemasClient.getProperties);
  let pageCloseText = 'RETURN TO LIST';
  let pageCloseUrl = appRoutes.MARKETS.toString();

  const cloneMarket = (id: string): Market | undefined => {
    const market = markets && markets.filter((m) => m.id === id).shift();
    return market ? { ...market } : undefined;
  };

  const market = id === 'new' ? defaultMarket : cloneMarket(id);

  if (market && market.parentMarket) {
    pageCloseText = 'RETURN TO PARENT';
    pageCloseUrl = `${appRoutes.MARKET_DETAIL}${market.parentMarket.id}`;
  }

  const marketProperties =
    properties?.filter((p) => p.marketId === market?.id) ?? [];

  return (
    <Page
      title="Market Detail"
      closeText={pageCloseText}
      closeUrl={pageCloseUrl}
      isLoading={isLoading || isPropertiesLoading}
      isError={isError || isPropertiesError || (!isLoading && !market)}
    >
      {market && (
        <>
          <Grid container spacing={6} className={classes.grid}>
            <Grid item xs={12} sm={6}>
              <MarketForm market={market} parentId={parent} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MarketMap market={market} />
            </Grid>
          </Grid>
          {id !== 'new' && (
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <SubMarkets market={market} />
              </Grid>
              <Grid item xs={12}>
                <MarketMetrics market={market} />
              </Grid>
              <Grid item xs={12}>
                <MarketRents market={market} />
              </Grid>
              <Grid item xs={12}>
                <MarketProperties properties={marketProperties} />
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Page>
  );
};

export default MarketDetail;
