import {
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import CancelIcon from '@material-ui/icons/Cancel';
import { Expense, Property } from '../../types/propertyTypes';
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
  expense: Expense | null;
  close: () => void;
}

const ExpenseForm: React.FC<Props> = ({ property, expense, close }) => {
  const classes = useStyles();
  const { setAlert } = useAlerts();
  const [description, setDescription] = useState('');
  const [monthly, setMonthly] = useState('');
  const [yearly, setYearly] = useState('');
  const [percentOfRent, setPercentOfRent] = useState('');
  const queryClient = useQueryClient();
  const onMutationSuccess = () => {
    queryClient.invalidateQueries(Query.GET_PROPERTIES);
    close();
  };
  const createMutation = useMutation(
    (data: Expense) => RemasClient.createExpense(property, data),
    { onSuccess: onMutationSuccess }
  );
  const updateMutation = useMutation(
    (data: Expense) => RemasClient.updateExpense(property, data),
    { onSuccess: onMutationSuccess }
  );

  const formValid = description && monthly && yearly && percentOfRent;

  useEffect(() => {
    if (expense) {
      setDescription(expense.description);
      setMonthly(expense.monthlyAmount.toFixed(2));
      setYearly((expense.monthlyAmount * 12).toFixed(2));
      setPercentOfRent(
        property.monthlyRent
          ? ((expense.monthlyAmount / property.monthlyRent) * 100).toFixed(2)
          : ''
      );
    }
  }, [expense, property]);

  const handleMonthlyChange = (monthlyAmount: string) => {
    setMonthly(monthlyAmount);
    if (monthlyAmount && !isNaN(parseFloat(monthlyAmount))) {
      setYearly((parseFloat(monthlyAmount) * 12).toFixed(2));
      setPercentOfRent(
        property.monthlyRent
          ? ((parseFloat(monthlyAmount) / property.monthlyRent) * 100).toFixed(
              2
            )
          : ''
      );
    } else {
      setYearly('');
      setPercentOfRent('');
    }
  };

  const handleYearlyChange = (yearlyAmount: string) => {
    setYearly(yearlyAmount);
    if (yearlyAmount && !isNaN(parseFloat(yearlyAmount))) {
      const monthlyAmount = parseFloat(yearlyAmount) / 12;
      setMonthly(monthlyAmount.toFixed(2));
      setPercentOfRent(
        property.monthlyRent
          ? ((monthlyAmount / property.monthlyRent) * 100).toFixed(2)
          : ''
      );
    } else {
      setMonthly('');
      setPercentOfRent('');
    }
  };

  const handlePercentOfRentChange = (percentAmount: string) => {
    setPercentOfRent(percentAmount);
    if (property.monthlyRent && !isNaN(parseFloat(percentAmount))) {
      const monthlyAmount =
        property.monthlyRent * (parseFloat(percentAmount) / 100);
      setMonthly(monthlyAmount.toFixed(2));
      setYearly((monthlyAmount * 12).toFixed(2));
    } else {
      setMonthly('');
      setYearly('');
    }
  };

  const saveChanges = () => {
    if (formValid) {
      const updatedExpense: Expense = {
        description: description,
        monthlyAmount: parseFloat(monthly),
        id: expense ? expense.id : undefined,
      };

      if (expense && expense.id) {
        updateMutation.mutate(updatedExpense, {
          onSuccess: () => {
            setAlert({
              type: AppAlertType.SUCCESS,
              message: 'Expense successfully updated',
            });
          },
          onError: () => {
            setAlert({
              type: AppAlertType.ERROR,
              message: 'Failed to update expense',
            });
          },
        });
      } else {
        createMutation.mutate(updatedExpense, {
          onSuccess: () => {
            setAlert({
              type: AppAlertType.SUCCESS,
              message: 'Expense successfully created',
            });
          },
          onError: () => {
            setAlert({
              type: AppAlertType.ERROR,
              message: 'Failed to create expense',
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
            {`${expense ? 'Edit' : 'New'} Expense`}
          </Typography>
          <IconButton aria-label="close drawer" onClick={close}>
            <CancelIcon fontSize="large" />
          </IconButton>
        </div>
        <form className={classes.form} noValidate autoComplete="off">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Description"
                value={description}
                autoFocus
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setDescription(event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Monthly"
                value={monthly}
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (isNumeric(event.target.value)) {
                    handleMonthlyChange(event.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Yearly"
                value={yearly}
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (isNumeric(event.target.value)) {
                    handleYearlyChange(event.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="% Rent"
                value={percentOfRent}
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (isNumeric(event.target.value)) {
                    handlePercentOfRentChange(event.target.value);
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

export default ExpenseForm;
