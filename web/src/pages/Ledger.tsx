import {
  Button,
  createStyles,
  Drawer,
  IconButton,
  makeStyles,
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
import React, { useState } from 'react';
import ConfirmButton from '../components/Common/ConfirmButton';
import Page from '../components/Common/Page';
import LedgerForm from '../components/Ledger/LedgerForm';
import { LedgerEntry } from '../types/ledgerTypes';
import { formatCurrency } from '../utils/generalUtils';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import RemasClient from '../clients/RemasClient';
import { Query } from '../types/queryTypes';
import useAlerts from '../hooks/useAlerts';
import { AppAlertType } from '../types/appTypes';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableHeader: {
      backgroundColor: theme.palette.grey[100],
    },
    tableHeaderCell: {
      fontWeight: theme.typography.fontWeightBold,
    },
    expenseIndicator: {
      color: 'red',
      paddingRight: '5px',
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

const Ledger: React.FC = () => {
  const classes = useStyles();
  const { setAlert } = useAlerts();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);
  const {
    isLoading: ledgerLoading,
    isError: ledgerError,
    data: ledgerEntries,
  } = useQuery(Query.GET_LEDGER_ENTRIES, RemasClient.getLedgerEntries);
  const {
    isLoading: categoriesLoading,
    isError: categoriesError,
    data: categories,
  } = useQuery(Query.GET_LEDGER_CATEGORIES, RemasClient.getLedgerCategories);
  const {
    isLoading: propertiesLoading,
    isError: propertiesError,
    data: properties,
  } = useQuery(Query.GET_PROPERTIES, RemasClient.getProperties);
  const queryClient = useQueryClient();
  const onMutationSuccess = () => {
    queryClient.invalidateQueries(Query.GET_LEDGER_ENTRIES);
  };
  const deleteMutation = useMutation(
    (data: LedgerEntry) => RemasClient.deleteLedgerEntry(data),
    { onSuccess: onMutationSuccess }
  );

  const onNewEntry = () => {
    setSelectedEntry(null);
    setDrawerOpen(true);
  };

  const onDeleteEntry = () => {
    selectedEntry &&
      deleteMutation.mutate(selectedEntry, {
        onSuccess: () => {
          setAlert({
            type: AppAlertType.SUCCESS,
            message: 'Entry successfully deleted',
          });
        },
        onError: () => {
          setAlert({
            type: AppAlertType.ERROR,
            message: 'Failed to delete entry',
          });
        },
      });
  };

  return (
    <Page
      title="Ledger"
      closeText="New Entry"
      closeAction={onNewEntry}
      isLoading={ledgerLoading || categoriesLoading || propertiesLoading}
      isError={ledgerError || categoriesError || propertiesError}
    >
      <Paper>
        <TableContainer>
          <Table aria-label="ledger table">
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>Date</TableCell>
                <TableCell className={classes.tableHeaderCell}>
                  Check No
                </TableCell>
                <TableCell className={classes.tableHeaderCell}>
                  Payor / Payee
                </TableCell>
                <TableCell className={classes.tableHeaderCell}>
                  Category
                </TableCell>
                <TableCell className={classes.tableHeaderCell}>
                  Description
                </TableCell>
                <TableCell className={classes.tableHeaderCell}>
                  Property
                </TableCell>
                <TableCell className={classes.tableHeaderCell} colSpan={2}>
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            {ledgerEntries && (
              <TableBody>
                {ledgerEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.transactionDate}</TableCell>
                    <TableCell>{entry.checkNo}</TableCell>
                    <TableCell>{entry.payorPayee}</TableCell>
                    <TableCell>{entry.categoryDescription}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>{entry.propertyDescription}</TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      {entry.transactionType === 'EXPENSE' && (
                        <span className={classes.expenseIndicator}>-</span>
                      )}
                      {formatCurrency(entry.amount)}
                    </TableCell>
                    <TableCell width="30">
                      <IconButton
                        aria-label="ledger entry menu"
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {
                          setAnchorEl(event.currentTarget);
                          setSelectedEntry(entry);
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
            confirmText="Are you sure you want to delete this entry?"
            buttonIcon="delete"
            confirmAction={onDeleteEntry}
          />
        </MenuItem>
      </Menu>
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className={classes.bottomDrawer}
      >
        <LedgerForm
          entry={selectedEntry}
          categories={categories ?? []}
          close={() => setDrawerOpen(false)}
          properties={properties ?? []}
        />
      </Drawer>
    </Page>
  );
};

export default Ledger;
