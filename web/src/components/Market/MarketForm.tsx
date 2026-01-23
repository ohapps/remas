import {
  makeStyles,
  Theme,
  createStyles,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import RemasClient from '../../clients/RemasClient';
import { appRoutes } from '../../config/app-config';
import useAlerts from '../../hooks/useAlerts';
import { AppAlertType } from '../../types/appTypes';
import { Query } from '../../types/queryTypes';
import { Market } from '../../types/userTypes';
import ConfirmButton from '../Common/ConfirmButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: 'flex',
      flexDirection: 'column',
      '& div': {
        marginBottom: '10px',
      },
    },
    formButtons: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    formSelect: {
      textAlign: 'left',
    },
  })
);

interface Props {
  market: Market;
  parentId?: string;
}

const MarketForm: React.FC<Props> = ({ market, parentId }) => {
  const classes = useStyles();
  const history = useHistory();
  const { setAlert } = useAlerts();
  const [editableMarket, setEditableMarket] = useState(market);
  const isFormInvalid =
    !editableMarket.description ||
    !editableMarket.locationType ||
    !editableMarket.location;
  const queryClient = useQueryClient();
  const onMutateSuccess = () => {
    queryClient.invalidateQueries(Query.GET_MARKETS);
    queryClient.invalidateQueries(Query.GET_RECENT_MARKETS);
  };
  const createMutation = useMutation(
    (data: Market) => RemasClient.createMarket(data, parentId ?? ''),
    { onSuccess: onMutateSuccess }
  );
  const updateMutation = useMutation(
    (data: Market) => RemasClient.updateMarket(data),
    { onSuccess: onMutateSuccess }
  );
  const deleteMutation = useMutation(
    (data: Market) => RemasClient.deleteMarket(data),
    { onSuccess: onMutateSuccess }
  );

  useEffect(() => {
    setEditableMarket(market);
  }, [market]);

  const saveMarket = () => {
    if (!market.id) {
      createMutation.mutate(editableMarket, {
        onSuccess: (newMarket) => {
          newMarket && marketCreated(newMarket);
          setAlert({
            type: AppAlertType.SUCCESS,
            message: 'Market successfully created',
          });
        },
        onError: () => {
          setAlert({
            type: AppAlertType.ERROR,
            message: 'Market could not be created',
          });
        },
      });
    } else {
      updateMutation.mutate(editableMarket, {
        onSuccess: () => {
          setAlert({
            type: AppAlertType.SUCCESS,
            message: 'Market successfully updated',
          });
        },
        onError: () => {
          setAlert({
            type: AppAlertType.ERROR,
            message: 'Market could not be updated',
          });
        },
      });
    }
  };

  const marketCreated = (market: Market) => {
    history.push(`${appRoutes.MARKET_DETAIL}${market.id}`);
    setEditableMarket(market);
  };

  const deleteMarket = () => {
    deleteMutation.mutate(editableMarket, {
      onSuccess: () => {
        history.push(appRoutes.MARKETS);
      },
    });
  };

  return (
    <Paper style={{ padding: '20px' }}>
      <form className={classes.form} noValidate autoComplete="off">
        <TextField
          label="Description"
          value={editableMarket.description}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setEditableMarket({
              ...editableMarket,
              description: event.target.value,
            });
          }}
        />
        <FormControl>
          <InputLabel id="location-type-label">Location Type</InputLabel>
          <Select
            labelId="location-type-label"
            value={editableMarket.locationType}
            className={classes.formSelect}
            onChange={(
              event: React.ChangeEvent<{ name?: string; value: unknown }>
            ) => {
              setEditableMarket({
                ...editableMarket,
                locationType: event.target.value as string,
              });
            }}
          >
            <MenuItem value="CITY_STATE">City / State</MenuItem>
            <MenuItem value="ZIP">Zip Code</MenuItem>
            <MenuItem value="NEIGHBORHOOD">Neighborhood</MenuItem>
            <MenuItem value="INTERSECTION">Intersection</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Location"
          value={editableMarket.location}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setEditableMarket({
              ...editableMarket,
              location: event.target.value,
            });
          }}
        />
      </form>
      <div className={classes.formButtons}>
        <Button
          variant="outlined"
          color="primary"
          onClick={saveMarket}
          disabled={isFormInvalid}
        >
          SAVE
        </Button>
        {market.id && (
          <ConfirmButton
            buttonText="DELETE"
            confirmText="Are you sure you want to delete this market?"
            confirmAction={deleteMarket}
          />
        )}
      </div>
    </Paper>
  );
};

export default MarketForm;
