import {
  Button,
  createStyles,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import Page from '../components/Common/Page';
import { appRoutes } from '../config/app-config';
import { DefaultExpense, ExpenseType } from '../types/propertyTypes';
import { formatCurrency, formatEnum } from '../utils/generalUtils';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import LargeButton from '../components/Common/LargeButton';
import ConfirmButton from '../components/Common/ConfirmButton';
import EditIcon from '@material-ui/icons/Edit';
import BottomDrawer from '../components/Common/BottomDrawer';
import DefaultExpenseForm from '../components/Property/DefaultExpenseForm';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import RemasClient from '../clients/RemasClient';
import { Query } from '../types/queryTypes';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableHeader: {
      backgroundColor: theme.palette.grey[100],
    },
    tableHeaderCell: {
      fontWeight: theme.typography.fontWeightBold,
    },
    editMenuItem: {
      '& svg': {
        paddingRight: '15px',
      },
    },
  })
);

const DefaultExpenses: React.FC = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDefaultExpense, setSelectedDefaultExpense] = useState<
    DefaultExpense | undefined
  >();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {
    isLoading,
    isError,
    data: defaultExpenses,
  } = useQuery(Query.GET_DEFAULT_EXPENSES, RemasClient.getDefaultExpenses);
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (data: DefaultExpense) => RemasClient.deleteDefaultExpense(data),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(Query.GET_DEFAULT_EXPENSES),
    }
  );

  const getFormattedAmount = (expense: DefaultExpense) => {
    switch (expense.expenseType) {
      case ExpenseType.PERCENT_OF_RENT:
        return `${expense.amount}%`;
      default:
        return formatCurrency(expense.amount);
    }
  };

  const onDeleteExpense = () => {
    if (selectedDefaultExpense) {
      mutation.mutate(selectedDefaultExpense);
    }
  };

  return (
    <Page
      title="Edit Default Expenses"
      closeText="Return To Settings"
      closeUrl={appRoutes.SETTINGS}
      isLoading={isLoading}
      isError={isError}
    >
      <Paper>
        <TableContainer>
          <Table aria-label="default expenses table">
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>
                  Description
                </TableCell>
                <TableCell className={classes.tableHeaderCell}>
                  Amount
                </TableCell>
                <TableCell className={classes.tableHeaderCell} colSpan={2}>
                  Expense Type
                </TableCell>
              </TableRow>
            </TableHead>
            {defaultExpenses && (
              <TableBody>
                {defaultExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{getFormattedAmount(expense)}</TableCell>
                    <TableCell>{formatEnum(expense.expenseType)}</TableCell>
                    <TableCell width="30">
                      <IconButton
                        aria-label="expense menu"
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {
                          setAnchorEl(event.currentTarget);
                          setSelectedDefaultExpense(expense);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <LargeButton
          click={() => {
            setSelectedDefaultExpense(undefined);
            setDrawerOpen(true);
          }}
        >
          NEW EXPENSE
        </LargeButton>
      </Paper>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          className={classes.editMenuItem}
          onClick={() => {
            setDrawerOpen(true);
            setAnchorEl(null);
          }}
        >
          <Button>
            <EditIcon /> EDIT
          </Button>
        </MenuItem>
        <MenuItem
          className={classes.editMenuItem}
          onClick={() => setAnchorEl(null)}
        >
          <ConfirmButton
            buttonText="DELETE"
            confirmText="Are you sure you want to delete this expense?"
            buttonIcon="delete"
            confirmAction={onDeleteExpense}
          />
        </MenuItem>
      </Menu>
      <BottomDrawer
        drawerOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={'Default Expense'}
      >
        <DefaultExpenseForm
          defaultExpense={selectedDefaultExpense}
          close={() => setDrawerOpen(false)}
        />
      </BottomDrawer>
    </Page>
  );
};

export default DefaultExpenses;
