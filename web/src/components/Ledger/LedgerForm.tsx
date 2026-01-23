import {
  createStyles,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import React, { ReactNode, useState } from 'react';
import { LedgerCategory, LedgerEntry } from '../../types/ledgerTypes';
import CancelIcon from '@material-ui/icons/Cancel';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { capitalize } from 'lodash';
import { isNumeric } from '../../utils/generalUtils';
import { Property } from '../../types/propertyTypes';
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
  entry: LedgerEntry | null;
  categories: LedgerCategory[];
  close: () => void;
  properties: Property[];
}

const LedgerForm: React.FC<Props> = ({
  entry,
  categories,
  close,
  properties,
}) => {
  const classes = useStyles();
  const { setAlert } = useAlerts();
  const [transactionDate, setTransactionDate] = useState(
    entry?.transactionDate ?? format(new Date(), 'MM/dd/yyyy')
  );
  const [transactionDateHasError, setTransactionDateHasError] = useState(false);
  const [checkNo, setCheckNo] = useState(entry?.checkNo);
  const [payorPayee, setPayorPayee] = useState(entry?.payorPayee);
  const [categoryId, setCategoryId] = useState(entry?.categoryId);
  const [description, setDescription] = useState(entry?.description);
  const [amount, setAmount] = useState(entry?.amount?.toString() ?? '');
  const [propertyId, setPropertyId] = useState(entry?.propertyId);
  const queryClient = useQueryClient();
  const onMutationSuccess = () => {
    queryClient.invalidateQueries(Query.GET_LEDGER_ENTRIES);
    close();
  };
  const createMutation = useMutation(
    (data: LedgerEntry) => RemasClient.createLedgerEntry(data),
    { onSuccess: onMutationSuccess }
  );
  const updateMutation = useMutation(
    (data: LedgerEntry) => RemasClient.updateLedgerEntry(data),
    { onSuccess: onMutationSuccess }
  );

  const formValid =
    transactionDate &&
    !transactionDateHasError &&
    payorPayee &&
    categoryId &&
    amount &&
    description;

  const saveChanges = () => {
    if (transactionDate && payorPayee && description && categoryId && amount) {
      const updatedEntry: LedgerEntry = {
        id: entry?.id,
        transactionDate,
        payorPayee,
        description,
        categoryId,
        amount: parseFloat(amount),
        checkNo,
        propertyId,
      };

      if (entry && entry.id) {
        updateMutation.mutate(updatedEntry, {
          onSuccess: () => {
            setAlert({
              type: AppAlertType.SUCCESS,
              message: 'Entry successfully updated',
            });
          },
          onError: () => {
            setAlert({
              type: AppAlertType.ERROR,
              message: 'Failed to update entry',
            });
          },
        });
      } else {
        createMutation.mutate(updatedEntry, {
          onSuccess: () => {
            setAlert({
              type: AppAlertType.SUCCESS,
              message: 'Entry successfully created',
            });
          },
          onError: () => {
            setAlert({
              type: AppAlertType.ERROR,
              message: 'Failed to create entry',
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
            {`${entry ? 'Edit' : 'New'} Entry`}
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
                value={transactionDate}
                className={classes.formInput}
                onChange={(date, value) => {
                  setTransactionDate(value ?? '');
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                onError={(error: ReactNode) => {
                  setTransactionDateHasError(!!error);
                }}
              />
              <TextField
                label="Payor / Payee"
                value={payorPayee}
                required
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setPayorPayee(event.target.value);
                }}
              />
              <FormControl fullWidth className={classes.formInput}>
                <InputLabel id="category">Category *</InputLabel>
                <Select
                  label="category"
                  required
                  value={categoryId}
                  onChange={(
                    event: React.ChangeEvent<{ name?: string; value: unknown }>
                  ) => {
                    setCategoryId(event.target.value as string);
                  }}
                >
                  {categories.map((cat) => (
                    <MenuItem value={cat.id} key={cat.id}>
                      {`${capitalize(cat.transactionType)} - ${cat.category}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                label="Amount"
                value={amount}
                required
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (isNumeric(event.target.value)) {
                    setAmount(event.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Check No"
                value={checkNo}
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setCheckNo(event.target.value);
                }}
              />
              <FormControl fullWidth className={classes.formInput}>
                <InputLabel id="property">Property</InputLabel>
                <Select
                  label="property"
                  value={propertyId}
                  onChange={(
                    event: React.ChangeEvent<{ name?: string; value: unknown }>
                  ) => {
                    setPropertyId(event.target.value as string);
                  }}
                >
                  {properties.map((property) => (
                    <MenuItem value={property.id} key={property.id}>
                      {property.address}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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

export default LedgerForm;
