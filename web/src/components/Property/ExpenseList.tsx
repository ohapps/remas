import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  makeStyles,
  Theme,
  createStyles,
  TableCell,
  TableBody,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  Paper,
} from '@material-ui/core';
import React, { useState } from 'react';
import { Expense, Property } from '../../types/propertyTypes';
import { formatCurrency } from '../../utils/generalUtils';
import ConfirmButton from '../Common/ConfirmButton';
import LargeButton from '../Common/LargeButton';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpenseForm from './ExpenseForm';
import { useMutation, useQueryClient } from 'react-query';
import RemasClient from '../../clients/RemasClient';
import { Query } from '../../types/queryTypes';
import useAlerts from '../../hooks/useAlerts';
import { AppAlertType } from '../../types/appTypes';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableContainer: {
      marginTop: '40px',
    },
    tableHeader: {
      backgroundColor: theme.palette.grey[100],
    },
    tableHeaderCell: {
      fontWeight: theme.typography.fontWeightBold,
    },
    tableHeaderSelect: {
      display: 'flex',
      flexWrap: 'nowrap',
      '& button': {
        marginLeft: '20px',
      },
    },
    editMenuItem: {
      '& svg': {
        paddingRight: '15px',
      },
    },
    bottomDrawer: {
      borderTop: `3px solid ${theme.palette.info.main}`,
    },
  })
);

interface Props {
  property: Property;
}

const ExpenseList: React.FC<Props> = ({ property }) => {
  const classes = useStyles();
  const { setAlert } = useAlerts();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (data: Expense) => RemasClient.deleteExpense(property, data),
    { onSuccess: () => queryClient.invalidateQueries(Query.GET_PROPERTIES) }
  );

  const calcYearlyAmount = (monthlyAmount: number) => {
    return monthlyAmount * 12;
  };

  const calcPercentOfRent = (monthlyAmount: number) => {
    return (
      property.monthlyRent &&
      ((monthlyAmount / property.monthlyRent) * 100).toFixed(2)
    );
  };

  const calcMonthlyTotal = () => {
    return property.expenses
      .map((expense) => expense.monthlyAmount)
      .reduce((prev, current) => prev + current);
  };

  const calcYearlyTotal = () => {
    return calcMonthlyTotal() * 12;
  };

  const calcPercentOfRentTotal = () => {
    return (
      property.monthlyRent &&
      ((calcMonthlyTotal() / property.monthlyRent) * 100).toFixed(2)
    );
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const onDeleteExpense = () => {
    if (selectedExpense) {
      mutation.mutate(selectedExpense, {
        onSuccess: () => {
          setAlert({
            type: AppAlertType.SUCCESS,
            message: 'Expense successfully deleted',
          });
        },
        onError: () => {
          setAlert({
            type: AppAlertType.ERROR,
            message: 'Failed to delete expense',
          });
        },
      });
    }
  };

  return (
    <Paper>
      <TableContainer className={classes.tableContainer}>
        <Table aria-label="expense table">
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell className={classes.tableHeaderCell}>
                Expenses
              </TableCell>
              <TableCell className={classes.tableHeaderCell}>Monthly</TableCell>
              <TableCell className={classes.tableHeaderCell}>Yearly</TableCell>
              <TableCell className={classes.tableHeaderCell} colSpan={2}>
                % Rent
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {property.expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{formatCurrency(expense.monthlyAmount)}</TableCell>
                <TableCell>
                  {formatCurrency(calcYearlyAmount(expense.monthlyAmount))}
                </TableCell>
                <TableCell>
                  {calcPercentOfRent(expense.monthlyAmount)}%
                </TableCell>
                <TableCell width="30">
                  <IconButton
                    aria-label="expense menu"
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                      setAnchorEl(event.currentTarget);
                      setSelectedExpense(expense);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {property.expenses.length > 0 && (
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>Total</TableCell>
                <TableCell className={classes.tableHeaderCell}>
                  {formatCurrency(calcMonthlyTotal())}
                </TableCell>
                <TableCell className={classes.tableHeaderCell}>
                  {formatCurrency(calcYearlyTotal())}
                </TableCell>
                <TableCell className={classes.tableHeaderCell} colSpan={2}>
                  {calcPercentOfRentTotal()}%
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <LargeButton
        click={() => {
          setSelectedExpense(null);
          setDrawerOpen(true);
        }}
      >
        NEW EXPENSE
      </LargeButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          className={classes.editMenuItem}
          onClick={() => {
            setDrawerOpen(true);
            handleMenuClose();
          }}
        >
          <Button>
            <EditIcon /> EDIT
          </Button>
        </MenuItem>
        <MenuItem className={classes.editMenuItem} onClick={handleMenuClose}>
          <ConfirmButton
            buttonText="DELETE"
            confirmText="Are you sure you want to delete this expense?"
            buttonIcon="delete"
            confirmAction={onDeleteExpense}
          />
        </MenuItem>
      </Menu>
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className={classes.bottomDrawer}
      >
        <ExpenseForm
          property={property}
          expense={selectedExpense}
          close={() => setDrawerOpen(false)}
        />
      </Drawer>
    </Paper>
  );
};

export default ExpenseList;
