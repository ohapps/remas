import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Paper, Theme } from '@material-ui/core';
import { Loader } from '@googlemaps/js-api-loader';
import { Market } from '../../types/userTypes';
import { logError } from '../../utils/generalUtils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    map: {
      height: '290px',
      backgroundColor: `${theme.palette.grey[100]}`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: `${theme.palette.grey[700]}`,
    },
  })
);

interface Props {
  market: Market;
}

const MarketMap: React.FC<Props> = ({ market }) => {
  const classes = useStyles();
  const [fallbackText, setFallbackText] = useState('');

  const loader = new Loader({
    apiKey: 'AIzaSyD5OaUJ5-KBl-iIS0PIjNFusnt-rJm8imw',
    version: 'weekly',
  });

  useEffect(() => {
    if (market) {
      const getZoom = () => {
        if (market) {
          switch (market.locationType) {
            case 'CITY_STATE':
              return 10;
            case 'ZIP':
              return 12;
            case 'NEIGHBORHOOD':
              return 14;
            case 'INTERSECTION':
              return 15;
          }
        }
        return 10;
      };

      loader.load().then(() => {
        const geocoder = new google.maps.Geocoder();
        geocoder
          .geocode({ address: market.location })
          .then(({ results }) => {
            if (results && results.length > 0) {
              new google.maps.Map(
                document.getElementById('map') as HTMLElement,
                {
                  center: results[0].geometry.location,
                  zoom: getZoom(),
                }
              );
            } else {
              setFallbackText('no results found for location');
            }
          })
          .catch((e) => {
            logError(e);
            setFallbackText('error fetching map results');
          });
      });
    }
  }, [market, loader]);

  return (
    <Paper className={classes.map} id="map">
      {fallbackText}
    </Paper>
  );
};

export default MarketMap;
