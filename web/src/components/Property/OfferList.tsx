import {
  Button,
  createStyles,
  Drawer,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Offer, Property } from '../../types/propertyTypes';
import { formatCurrency } from '../../utils/generalUtils';
import LargeButton from '../Common/LargeButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import OfferForm from './OfferForm';
import ConfirmButton from '../Common/ConfirmButton';
import { useMutation, useQueryClient } from 'react-query';
import { Query } from '../../types/queryTypes';
import RemasClient from '../../clients/RemasClient';
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

const OfferList: React.FC<Props> = ({ property }) => {
  const classes = useStyles();
  const { setAlert } = useAlerts();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editOffer, setEditOffer] = useState<Offer | null>(null);
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const queryClient = useQueryClient();
  const onMutationSuccess = () => {
    queryClient.invalidateQueries(Query.GET_PROPERTIES);
  };
  const deleteMutation = useMutation(
    (data: Offer) => RemasClient.deleteOffer(property, data),
    { onSuccess: onMutationSuccess }
  );
  const markActiveMutation = useMutation(
    (data: Offer) => RemasClient.markOfferActive(property, data),
    { onSuccess: onMutationSuccess }
  );

  useEffect(() => {
    setActiveOffer(
      property.offers
        ? property.offers.find((offer) => offer.active) ?? null
        : null
    );
  }, [property]);

  const newOffer = () => {
    setEditOffer(null);
    setDrawerOpen(true);
    setAnchorEl(null);
  };

  const onDeleteOffer = () => {
    if (activeOffer) {
      deleteMutation.mutate(activeOffer, {
        onSuccess: () => {
          setAlert({
            type: AppAlertType.SUCCESS,
            message: 'Offer successfully deleted',
          });
        },
        onError: () => {
          setAlert({
            type: AppAlertType.ERROR,
            message: 'Failed to delete offer',
          });
        },
      });
    }
  };

  const onSetActiveOffer = (offerId: string) => {
    const selectedOffer =
      property.offers.find((ofr) => ofr.id === offerId) ?? null;
    setActiveOffer(selectedOffer);
    selectedOffer && markActiveMutation.mutate(selectedOffer);
  };

  return (
    <Paper>
      <TableContainer style={{ marginTop: '40px' }}>
        <Table aria-label="offer table">
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell
                className={classes.tableHeaderCell}
                colSpan={property.offers && property.offers.length > 0 ? 1 : 2}
              >
                Offer
              </TableCell>
              {property.offers && property.offers.length > 0 && (
                <TableCell
                  className={`${classes.tableHeaderCell} ${classes.tableHeaderSelect}`}
                >
                  <Select
                    fullWidth
                    value={activeOffer ? activeOffer.id : ''}
                    placeholder="select offer"
                    onChange={(
                      event: React.ChangeEvent<{
                        name?: string;
                        value: unknown;
                      }>
                    ) => {
                      onSetActiveOffer(event.target.value as string);
                    }}
                  >
                    {property.offers.map((offer) => (
                      <MenuItem key={offer.id} value={offer.id}>
                        {offer.description}
                      </MenuItem>
                    ))}
                  </Select>
                  <IconButton
                    aria-label="market rent menu"
                    size="small"
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                      setAnchorEl(event.currentTarget);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          {activeOffer && (
            <TableBody>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>
                  Purchase Price
                </TableCell>
                <TableCell>
                  {formatCurrency(activeOffer.purchasePrice)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>
                  Cash Down Percent
                </TableCell>
                <TableCell>{activeOffer.cashDownPercent}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>
                  Cash Down Amount
                </TableCell>
                <TableCell>{formatCurrency(activeOffer.cashDown)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>
                  Loan Amount
                </TableCell>
                <TableCell>{formatCurrency(activeOffer.loanAmount)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>
                  Loan Term
                </TableCell>
                <TableCell>{activeOffer.loanYears} years</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>
                  Loan Rate
                </TableCell>
                <TableCell>{activeOffer.loanRate}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>
                  Mortgage Payment
                </TableCell>
                <TableCell>
                  {formatCurrency(activeOffer.mortgagePayment)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>
                  Principal Pay Down
                </TableCell>
                <TableCell>
                  {formatCurrency(activeOffer.principalPayDown)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>
                  Closing Cost
                </TableCell>
                <TableCell>{formatCurrency(activeOffer.closingCost)}</TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {(!property.offers || property.offers.length === 0) && (
        <LargeButton click={newOffer}>NEW OFFER</LargeButton>
      )}
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
        }}
      >
        <MenuItem className={classes.editMenuItem} onClick={newOffer}>
          <Button>
            <AddIcon /> NEW
          </Button>
        </MenuItem>
        {activeOffer && [
          <MenuItem
            className={classes.editMenuItem}
            key="edit"
            onClick={() => {
              setEditOffer(activeOffer);
              setDrawerOpen(true);
              setAnchorEl(null);
            }}
          >
            <Button>
              <EditIcon /> EDIT
            </Button>
          </MenuItem>,
          <MenuItem
            className={classes.editMenuItem}
            key="delete"
            onClick={() => setAnchorEl(null)}
          >
            <ConfirmButton
              buttonText="DELETE"
              confirmText={`Are you sure you want to delete ${activeOffer.description}?`}
              buttonIcon="delete"
              confirmAction={onDeleteOffer}
            />
          </MenuItem>,
        ]}
      </Menu>
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className={classes.bottomDrawer}
      >
        <OfferForm
          property={property}
          offer={editOffer}
          close={() => setDrawerOpen(false)}
        />
      </Drawer>
    </Paper>
  );
};

export default OfferList;
