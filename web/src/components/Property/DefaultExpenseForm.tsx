import {
  makeStyles,
  Theme,
  createStyles,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import RemasClient from '../../clients/RemasClient';
import { DefaultExpense, ExpenseType } from '../../types/propertyTypes';
import { Query } from '../../types/queryTypes';
import { formatEnum, isNumeric } from '../../utils/generalUtils';
import LargeButton from '../Common/LargeButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '40px',
    },
    formInput: {
      marginBottom: '10px',
    },
  })
);

interface Props {
  defaultExpense: DefaultExpense | undefined;
  close: () => void;
}

const DefaultExpenseForm: React.FC<Props> = ({ defaultExpense, close }) => {
  const classes = useStyles();
  const [description, setDescription] = useState(defaultExpense?.description);
  const [amount, setAmount] = useState(
    defaultExpense?.amount?.toString() ?? ''
  );
  const [expenseType, setExpenseType] = useState(defaultExpense?.expenseType);
  const queryClient = useQueryClient();
  const onMutationSuccess = () => {
    queryClient.invalidateQueries(Query.GET_DEFAULT_EXPENSES);
    close();
  };
  const createMutation = useMutation(
    (data: DefaultExpense) => RemasClient.createDefaultExpense(data),
    { onSuccess: onMutationSuccess }
  );
  const updateMutation = useMutation(
    (data: DefaultExpense) => RemasClient.updateDefaultExpense(data),
    { onSuccess: onMutationSuccess }
  );
  const isFormValid = description && amount && expenseType;

  const saveChanges = () => {
    if (description && amount && expenseType) {
      const defaultExpenseUpdate: DefaultExpense = {
        id: defaultExpense?.id,
        description,
        amount: parseFloat(amount),
        expenseType,
      };

      if (defaultExpense) {
        updateMutation.mutate(defaultExpenseUpdate);
      } else {
        createMutation.mutate(defaultExpenseUpdate);
      }
    }
  };

  return (
    <form className={classes.form} noValidate autoComplete="off">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Description"
            value={description}
            fullWidth
            required
            autoFocus
            className={classes.formInput}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDescription(event.target.value);
            }}
          />
          <TextField
            label="Amount"
            value={amount}
            fullWidth
            required
            className={classes.formInput}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (isNumeric(event.target.value)) {
                setAmount(event.target.value);
              }
            }}
          />
          <FormControl fullWidth className={classes.formInput}>
            <InputLabel id="expenseType" required>
              Expense Type
            </InputLabel>
            <Select
              required
              label="expenseType"
              fullWidth
              value={expenseType}
              onChange={(
                event: React.ChangeEvent<{ name?: string; value: unknown }>
              ) => {
                setExpenseType(event.target.value as ExpenseType);
              }}
            >
              {Object.values(ExpenseType).map((item) => (
                <MenuItem value={item} key={item}>
                  {formatEnum(item)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <LargeButton click={saveChanges} disabled={!isFormValid}>
        SAVE
      </LargeButton>
    </form>
  );
};

export default DefaultExpenseForm;
