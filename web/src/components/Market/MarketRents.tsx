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
import { Market, MarketRent } from '../../types/userTypes';
import { formatCurrency, formatEnum } from '../../utils/generalUtils';
import LargeButton from '../Common/LargeButton';
import MarketRentForm from './MarketRentForm';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import ConfirmButton from '../Common/ConfirmButton';
import { useMutation, useQueryClient } from 'react-query';
import RemasClient from '../../clients/RemasClient';
import { Query } from '../../types/queryTypes';
import useAlerts from '../../hooks/useAlerts';
import { AppAlertType } from '../../types/appTypes';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableHeader: {
      backgroundColor: theme.palette.grey[100],
    },
    tableHeaderCell: {
      fontWeight: theme.typography.fontWeightBold,
    },
    bottomDrawer: {
      borderTop: `3px solid ${theme.palette.info.main}`,
    },
    editMenuItem: {
      '& svg': {
        paddingRight: '15px',
      },
    },
  })
);

interface Props {
  market: Market;
}

const MarketRents: React.FC<Props> = ({ market }) => {
  const classes = useStyles();
  const { setAlert } = useAlerts();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRent, setSelectedRent] = useState<MarketRent | undefined>();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (data: string) => RemasClient.deleteMarketRent(market.id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(Query.GET_MARKETS);
      },
    }
  );

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const onDeleteMarketRent = () => {
    if (selectedRent?.id) {
      mutation.mutate(selectedRent.id, {
        onSuccess: () => {
          setAlert({
            type: AppAlertType.SUCCESS,
            message: 'Market rent successfully deleted',
          });
        },
        onError: () => {
          setAlert({
            type: AppAlertType.ERROR,
            message: 'failed to delete market rent',
          });
        },
      });
    }
  };

  return (
    <Paper>
      <TableContainer>
        <Table aria-label="rents table">
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell className={classes.tableHeaderCell} colSpan={6}>
                Rents
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {market.rents.map((rent) => (
              <TableRow key={rent.id}>
                <TableCell>{formatEnum(rent.unitType.toString())}</TableCell>
                <TableCell>{rent.bedrooms} bed(s)</TableCell>
                <TableCell>{rent.bathrooms} bath(s)</TableCell>
                <TableCell>{rent.squareFeet} sqft</TableCell>
                <TableCell>
                  {formatCurrency(rent.rentLow)} -{' '}
                  {formatCurrency(rent.rentHigh)} rent/month
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label="market rent menu"
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                      setAnchorEl(event.currentTarget);
                      setSelectedRent(rent);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <LargeButton
        click={() => {
          setSelectedRent(undefined);
          setDrawerOpen(true);
        }}
      >
        NEW RENT
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
            confirmText="Are you sure you want to delete this market rent?"
            buttonIcon="delete"
            confirmAction={onDeleteMarketRent}
          />
        </MenuItem>
      </Menu>
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={closeDrawer}
        className={classes.bottomDrawer}
      >
        <MarketRentForm
          market={market}
          rent={selectedRent}
          close={closeDrawer}
        />
      </Drawer>
    </Paper>
  );
};

export default MarketRents;
