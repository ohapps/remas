import {
  makeStyles,
  Theme,
  createStyles,
  Typography,
  IconButton,
  Grid,
  TextField,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Property, RehabEstimate } from '../../types/propertyTypes';
import CancelIcon from '@material-ui/icons/Cancel';
import { isNumeric } from '../../utils/generalUtils';
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
  property: Property;
  rehabCategory: RehabEstimate | null;
  close: () => void;
}

const RehabEstimateForm: React.FC<Props> = ({
  property,
  rehabCategory,
  close,
}) => {
  const classes = useStyles();
  const { setAlert } = useAlerts();
  const [description, setDescription] = useState('');
  const [estimate, setEstimate] = useState('');
  const queryClient = useQueryClient();
  const onMutationSuccess = () => {
    queryClient.invalidateQueries(Query.GET_PROPERTIES);
    close();
  };
  const createMutation = useMutation(
    (data: RehabEstimate) => RemasClient.createRehabCategory(property, data),
    { onSuccess: onMutationSuccess }
  );
  const updateMutation = useMutation(
    (data: RehabEstimate) => RemasClient.updateRehabCategory(property, data),
    { onSuccess: onMutationSuccess }
  );
  const formValid = description && estimate;

  useEffect(() => {
    if (rehabCategory) {
      setDescription(rehabCategory.description);
      setEstimate(rehabCategory.estimate.toFixed(2));
    }
  }, [rehabCategory]);

  const saveChanges = () => {
    if (formValid) {
      const updatedRehabEstimate: RehabEstimate = {
        id: rehabCategory ? rehabCategory.id : undefined,
        description: description,
        estimate: parseFloat(estimate),
      };
      if (rehabCategory && rehabCategory.id) {
        updateMutation.mutate(updatedRehabEstimate, {
          onSuccess: () => {
            setAlert({
              type: AppAlertType.SUCCESS,
              message: 'Rehab category successfully updated',
            });
          },
          onError: () => {
            setAlert({
              type: AppAlertType.ERROR,
              message: 'Failed to update rehab category',
            });
          },
        });
      } else {
        createMutation.mutate(updatedRehabEstimate, {
          onSuccess: () => {
            setAlert({
              type: AppAlertType.SUCCESS,
              message: 'Rehab category successfully created',
            });
          },
          onError: () => {
            setAlert({
              type: AppAlertType.ERROR,
              message: 'Failed to create rehab category',
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
            {`${rehabCategory ? 'Edit' : 'New'} Rehab Category`}
          </Typography>
          <IconButton aria-label="close drawer" onClick={close}>
            <CancelIcon fontSize="large" />
          </IconButton>
        </div>
        <form className={classes.form} noValidate autoComplete="off">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                value={description}
                autoFocus
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setDescription(event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Repair Estimate"
                value={estimate}
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (isNumeric(event.target.value)) {
                    setEstimate(event.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <LargeButton click={saveChanges} disabled={!formValid}>
                SAVE
              </LargeButton>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
};

export default RehabEstimateForm;
