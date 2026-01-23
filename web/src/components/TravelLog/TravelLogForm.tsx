import {
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import React, { ReactNode, useState } from 'react';
import { TravelLog } from '../../types/travelLogTypes';
import CancelIcon from '@material-ui/icons/Cancel';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { isNumeric } from '../../utils/generalUtils';
import LargeButton from '../Common/LargeButton';
import { format } from 'date-fns';
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
      [theme.breakpoints.down('sm')]: {
        width: '90vw',
      },
    },
    drawerTitle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '40px',
    },
    formInput: {
      marginBottom: '10px',
      width: '100%',
      [theme.breakpoints.down('sm')]: {
        width: '95%',
      },
    },
  })
);

interface Props {
  travelLog: TravelLog | null;
  close: () => void;
}

const TravelLogForm: React.FC<Props> = ({ travelLog, close }) => {
  const classes = useStyles();
  const { setAlert } = useAlerts();
  const [travelDate, setTravelDate] = useState(
    travelLog?.travelDate ?? format(new Date(), 'MM/dd/yyyy')
  );
  const [description, setDescription] = useState(travelLog?.description);
  const [miles, setMiles] = useState(travelLog?.miles?.toString());
  const [travelDateHasError, setTravelDateHasError] = useState(false);
  const queryClient = useQueryClient();
  const onMutationSuccess = () => {
    queryClient.invalidateQueries(Query.GET_TRAVEL_LOGS);
    close();
  };
  const createMutation = useMutation(
    (data: TravelLog) => RemasClient.createTravelLog(data),
    { onSuccess: onMutationSuccess }
  );
  const updateMutation = useMutation(
    (data: TravelLog) => RemasClient.updateTravelLog(data),
    { onSuccess: onMutationSuccess }
  );
  const formValid = travelDate && !travelDateHasError && description && miles;

  const saveChanges = () => {
    if (travelDate && description && miles) {
      const updatedTravelLog: TravelLog = {
        id: travelLog?.id,
        travelDate,
        description,
        miles: parseFloat(miles),
      };

      if (travelLog && travelLog.id) {
        updateMutation.mutate(updatedTravelLog, {
          onSuccess: () => {
            setAlert({
              type: AppAlertType.SUCCESS,
              message: 'Travel log successfully updated',
            });
          },
          onError: () => {
            setAlert({
              type: AppAlertType.ERROR,
              message: 'Failed to update travel log',
            });
          },
        });
      } else {
        createMutation.mutate(updatedTravelLog, {
          onSuccess: () => {
            setAlert({
              type: AppAlertType.SUCCESS,
              message: 'Travel log successfully created',
            });
          },
          onError: () => {
            setAlert({
              type: AppAlertType.ERROR,
              message: 'Failed to create travel log',
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
            {`${travelLog ? 'Edit' : 'New'} Travel Log`}
          </Typography>
          <IconButton aria-label="close drawer" onClick={close}>
            <CancelIcon fontSize="large" />
          </IconButton>
        </div>
        <form className={classes.form} noValidate autoComplete="off">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <KeyboardDatePicker
                required
                autoFocus
                autoOk
                format="MM/dd/yyyy"
                label="Date"
                value={travelDate}
                className={classes.formInput}
                onChange={(date, value) => {
                  setTravelDate(value ?? '');
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                onError={(error: ReactNode) => {
                  setTravelDateHasError(!!error);
                }}
              />
              <TextField
                label="Description"
                value={description}
                required
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setDescription(event.target.value);
                }}
              />
              <TextField
                label="miles"
                value={miles}
                required
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (isNumeric(event.target.value)) {
                    setMiles(event.target.value);
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

export default TravelLogForm;
