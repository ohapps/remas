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
import { Offer, Property } from '../../types/propertyTypes';
import CancelIcon from '@material-ui/icons/Cancel';
import { isNumeric } from '../../utils/generalUtils';
import LargeButton from '../Common/LargeButton';
import { useMutation, useQueryClient } from 'react-query';
import { Query } from '../../types/queryTypes';
import RemasClient from '../../clients/RemasClient';
import useAlerts from '../../hooks/useAlerts';
import { AppAlertType } from '../../types/appTypes';

interface Props {
  property: Property;
  offer: Offer | null;
  close: () => void;
}

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

const OfferForm: React.FC<Props> = ({ property, offer, close }) => {
  const classes = useStyles();
  const { setAlert } = useAlerts();
  const [purchasePrice, setPurchasePrice] = useState('');
  const [cashDownPercent, setCashDownPercent] = useState('20');
  const [cashDown, setCashDown] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanYears, setLoanYears] = useState('');
  const [loanRate, setLoanRate] = useState('');
  const [mortgagePayment, setMortgagePayment] = useState('');
  const [principalPayDown, setPrincipalPayDown] = useState('');
  const [closingCost, setClosingCost] = useState('');
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();
  const onMutationSuccess = () => {
    queryClient.invalidateQueries(Query.GET_PROPERTIES);
    close();
  };
  const createMutation = useMutation(
    (data: Offer) => RemasClient.createOffer(property, data),
    { onSuccess: onMutationSuccess }
  );
  const updateMutation = useMutation(
    (data: Offer) => RemasClient.updateOffer(property, data),
    { onSuccess: onMutationSuccess }
  );
  const formValid =
    purchasePrice &&
    cashDownPercent &&
    cashDown &&
    loanAmount &&
    loanYears &&
    loanRate &&
    mortgagePayment &&
    principalPayDown &&
    closingCost &&
    description;

  useEffect(() => {
    if (offer) {
      setPurchasePrice(offer.purchasePrice.toString());
      setCashDownPercent(offer.cashDownPercent.toString());
      setCashDown(offer.cashDown.toString());
      setLoanAmount(offer.loanAmount.toString());
      setLoanYears(offer.loanYears.toString());
      setLoanRate(offer.loanRate.toString());
      setMortgagePayment(offer.mortgagePayment.toString());
      setPrincipalPayDown(offer.principalPayDown.toString());
      setClosingCost(offer.closingCost.toString());
      setDescription(offer.description);
    }
  }, [offer]);

  // AUTO CALCULATE LOAN AMOUNT
  useEffect(() => {
    if (
      cashDown &&
      purchasePrice &&
      isNumeric(cashDown) &&
      isNumeric(purchasePrice)
    ) {
      setLoanAmount(
        (parseFloat(purchasePrice) - parseFloat(cashDown)).toString()
      );
    }
  }, [cashDown, purchasePrice]);

  // TODO - AUTO CALCULATE MORTGAGE PAYMENT AND PRINCIPAL PAYDOWN
  useEffect(() => {
    if (isNumeric(loanAmount) && isNumeric(loanYears) && isNumeric(loanRate)) {
      const principal = parseFloat(loanAmount);
      const months = parseFloat(loanYears) * 12;
      const interest = parseFloat(loanRate) / 1200;
      const calcMortgagePayment = Math.round(
        (principal * interest) / (1 - Math.pow(1 / (1 + interest), months))
      );
      const monthlyInterest = principal * interest;
      const calcPrincipalPayDown = Math.round(
        calcMortgagePayment - monthlyInterest
      );
      setMortgagePayment(
        isNaN(calcMortgagePayment) ? '' : calcMortgagePayment.toString()
      );
      setPrincipalPayDown(
        isNaN(calcPrincipalPayDown) ? '' : calcPrincipalPayDown.toString()
      );
    }
  }, [loanAmount, loanYears, loanRate]);

  const saveChanges = () => {
    if (formValid) {
      const updatedOffer: Offer = {
        description: description,
        purchasePrice: parseFloat(purchasePrice),
        cashDown: parseFloat(cashDown),
        cashDownPercent: parseFloat(cashDownPercent),
        loanAmount: parseFloat(loanAmount),
        loanYears: parseFloat(loanYears),
        loanRate: parseFloat(loanRate),
        mortgagePayment: parseFloat(mortgagePayment),
        principalPayDown: parseFloat(principalPayDown),
        closingCost: parseFloat(closingCost),
        id: offer ? offer.id : undefined,
        active: offer ? offer.active : false,
      };

      if (offer && offer.id) {
        updateMutation.mutate(updatedOffer, {
          onSuccess: () => {
            setAlert({
              type: AppAlertType.SUCCESS,
              message: 'Offer successfully updated',
            });
          },
          onError: () => {
            setAlert({
              type: AppAlertType.ERROR,
              message: 'Failed to update offer',
            });
          },
        });
      } else {
        createMutation.mutate(updatedOffer, {
          onSuccess: () => {
            setAlert({
              type: AppAlertType.SUCCESS,
              message: 'Offer successfully created',
            });
          },
          onError: () => {
            setAlert({
              type: AppAlertType.ERROR,
              message: 'Failed to create offer',
            });
          },
        });
      }
    }
  };

  const calcCashDown = (cashDownPercent: string, purchasePrice: string) => {
    if (
      cashDownPercent &&
      purchasePrice &&
      isNumeric(cashDownPercent) &&
      isNumeric(purchasePrice)
    ) {
      setCashDown(
        (parseFloat(purchasePrice) * (parseFloat(cashDownPercent) / 100))
          .toFixed(2)
          .toString()
      );
    }
  };

  const calcCashDownPercent = (cashDown: string, purchasePrice: string) => {
    if (
      cashDown &&
      purchasePrice &&
      isNumeric(cashDown) &&
      isNumeric(purchasePrice)
    ) {
      setCashDownPercent(
        ((parseFloat(cashDown) / parseFloat(purchasePrice)) * 100)
          .toFixed(2)
          .toString()
      );
    }
  };

  return (
    <div className={classes.drawerContainer}>
      <div className={classes.drawerContents}>
        <div className={classes.drawerTitle}>
          <Typography variant="h5" gutterBottom>
            Edit Offer
          </Typography>
          <IconButton aria-label="close drawer" onClick={close}>
            <CancelIcon fontSize="large" />
          </IconButton>
        </div>
        <form className={classes.form} noValidate autoComplete="off">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Purchase Price"
                value={purchasePrice}
                autoFocus
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (isNumeric(event.target.value)) {
                    setPurchasePrice(event.target.value);
                    calcCashDown(cashDownPercent, event.target.value);
                  }
                }}
              />
              <TextField
                label="Cash Down Percent"
                value={cashDownPercent}
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (isNumeric(event.target.value)) {
                    setCashDownPercent(event.target.value);
                    calcCashDown(event.target.value, purchasePrice);
                  }
                }}
              />
              <TextField
                label="Cash Down Amount"
                value={cashDown}
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (isNumeric(event.target.value)) {
                    setCashDown(event.target.value);
                    calcCashDownPercent(event.target.value, purchasePrice);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Loan Amount"
                value={loanAmount}
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (isNumeric(event.target.value)) {
                    setLoanAmount(event.target.value);
                  }
                }}
              />
              <TextField
                label="Loan Years"
                value={loanYears}
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (isNumeric(event.target.value)) {
                    setLoanYears(event.target.value);
                  }
                }}
              />
              <TextField
                label="Loan Rate"
                value={loanRate}
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (isNumeric(event.target.value)) {
                    setLoanRate(event.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Mortgage Payment"
                value={mortgagePayment}
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (isNumeric(event.target.value)) {
                    setMortgagePayment(event.target.value);
                  }
                }}
              />
              <TextField
                label="Principal Pay Down"
                value={principalPayDown}
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (isNumeric(event.target.value)) {
                    setPrincipalPayDown(event.target.value);
                  }
                }}
              />
              <TextField
                label="Closing Cost"
                value={closingCost}
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (isNumeric(event.target.value)) {
                    setClosingCost(event.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Description"
                value={description}
                className={classes.formInput}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setDescription(event.target.value);
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

export default OfferForm;
