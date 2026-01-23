import {
  createStyles,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React, { useEffect, useState } from 'react';
import { formatEnum, isNumeric } from '../../utils/generalUtils';
import { Market, MarketRent, UnitType } from '../../types/userTypes';
import CancelIcon from '@material-ui/icons/Cancel';
import LargeButton from '../Common/LargeButton';
import { useMutation, useQueryClient } from 'react-query';
import { Query } from '../../types/queryTypes';
import RemasClient from '../../clients/RemasClient';
import useAlerts from '../../hooks/useAlerts';
import { AppAlertType } from '../../types/appTypes';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    form: {
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 20px 40px 20px',
    },
    formInput: {
      marginBottom: '10px',
    },
  })
);

interface Props {
  market: Market;
  rent?: MarketRent;
  close: () => void;
}

const MarketRentForm: React.FC<Props> = ({ market, rent, close }) => {
  const classes = useStyles();
  const { setAlert } = useAlerts();
  const [unitType, setUnitType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [squareFeet, setSquareFeet] = useState('');
  const [rentLow, setRentLow] = useState('');
  const [rentHigh, setRentHigh] = useState('');
  const queryClient = useQueryClient();
  const onMutationSuccess = () => {
    queryClient.invalidateQueries(Query.GET_MARKETS);
    close();
  };
  const createMutation = useMutation(
    (data: MarketRent) => RemasClient.createMarketRent(market.id, data),
    { onSuccess: onMutationSuccess }
  );
  const updateMutation = useMutation(
    (data: { rentId: string; marketRent: MarketRent }) =>
      RemasClient.updateMarketRent(market.id, data.rentId, data.marketRent),
    { onSuccess: onMutationSuccess }
  );
  const formValid =
    !!unitType &&
    !!bedrooms &&
    !!bathrooms &&
    !!squareFeet &&
    !!rentLow &&
    !!rentHigh;

  useEffect(() => {
    if (rent) {
      setUnitType(rent.unitType);
      setBedrooms(rent.bedrooms.toString());
      setBathrooms(rent.bathrooms.toString());
      setSquareFeet(rent.squareFeet.toString());
      setRentLow(rent.rentLow.toString());
      setRentHigh(rent.rentHigh.toString());
    }
  }, [rent]);

  const saveChanges = () => {
    if (bedrooms && bathrooms && squareFeet && rentLow && rentHigh) {
      const updatedRent: MarketRent = {
        unitType: unitType as UnitType,
        bedrooms: parseFloat(bedrooms),
        bathrooms: parseFloat(bathrooms),
        squareFeet: parseFloat(squareFeet),
        rentLow: parseFloat(rentLow),
        rentHigh: parseFloat(rentHigh),
      };

      if (rent && rent.id) {
        updateMutation.mutate(
          { rentId: rent.id, marketRent: updatedRent },
          {
            onSuccess: () => {
              setAlert({
                type: AppAlertType.SUCCESS,
                message: 'Market rent successfully updated',
              });
            },
            onError: () => {
              setAlert({
                type: AppAlertType.ERROR,
                message: 'Market rent could not be updated',
              });
            },
          }
        );
      } else {
        createMutation.mutate(updatedRent, {
          onSuccess: () => {
            setAlert({
              type: AppAlertType.SUCCESS,
              message: 'Market rent successfully created',
            });
          },
          onError: () => {
            setAlert({
              type: AppAlertType.ERROR,
              message: 'Market rent could not be created',
            });
          },
        });
      }
    }
  };

  return (
    <div className={classes.drawerContainer}>
      <div className={classes.drawerContents}>
        <div className={classes.drawerTitle}>
          <Typography variant="h5" gutterBottom>
            Edit Market Rent
          </Typography>
          <IconButton aria-label="close drawer" onClick={close}>
            <CancelIcon fontSize="large" />
          </IconButton>
        </div>
        <form className={classes.form} noValidate autoComplete="off">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth className={classes.formInput}>
                <InputLabel id="market-rent-unit-type">Unit Type</InputLabel>
                <Select
                  label="market-rent-unit-type"
                  autoFocus
                  fullWidth
                  value={unitType}
                  onChange={(
                    event: React.ChangeEvent<{ name?: string; value: unknown }>
                  ) => {
                    setUnitType(event.target.value as string);
                  }}
                >
                  {Object.values(UnitType).map((value) => (
                    <MenuItem value={value.toString()} key={value}>
                      {formatEnum(value)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Bedrooms"
                value={bedrooms}
                fullWidth
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (isNumeric(event.target.value)) {
                    setBedrooms(event.target.value);
                  }
                }}
              />
              <TextField
                label="Bathrooms"
                value={bathrooms}
                fullWidth
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (isNumeric(event.target.value)) {
                    setBathrooms(event.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Square Feet"
                value={squareFeet}
                fullWidth
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (isNumeric(event.target.value)) {
                    setSquareFeet(event.target.value);
                  }
                }}
              />
              <TextField
                label="Market Rent Low"
                value={rentLow}
                fullWidth
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (isNumeric(event.target.value)) {
                    setRentLow(event.target.value);
                  }
                }}
              />
              <TextField
                label="Market Rent High"
                value={rentHigh}
                fullWidth
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (isNumeric(event.target.value)) {
                    setRentHigh(event.target.value);
                  }
                }}
              />
            </Grid>
          </Grid>
          <LargeButton click={saveChanges} disabled={!formValid}>
            SAVE
          </LargeButton>
        </form>
      </div>
    </div>
  );
};

export default MarketRentForm;
