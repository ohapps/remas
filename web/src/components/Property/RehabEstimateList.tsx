import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Theme,
  makeStyles,
  createStyles,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  Paper,
} from '@material-ui/core';
import React, { useState } from 'react';
import { Property, RehabEstimate } from '../../types/propertyTypes';
import { formatCurrency } from '../../utils/generalUtils';
import ConfirmButton from '../Common/ConfirmButton';
import LargeButton from '../Common/LargeButton';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import RehabEstimateForm from './RehabEstimateForm';
import { useMutation, useQueryClient } from 'react-query';
import { Query } from '../../types/queryTypes';
import RemasClient from '../../clients/RemasClient';
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

const RehabEstimateList: React.FC<Props> = ({ property }) => {
  const classes = useStyles();
  const { setAlert } = useAlerts();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRehabCategory, setSelectedRehabCategory] =
    useState<RehabEstimate | null>(null);
  const queryClient = useQueryClient();
  const onMutationSuccess = () => {
    queryClient.invalidateQueries(Query.GET_PROPERTIES);
  };
  const deleteMutation = useMutation(
    (data: RehabEstimate) => RemasClient.deleteRehabCategory(property, data),
    { onSuccess: onMutationSuccess }
  );

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const onDeleteRehabCategory = () => {
    if (selectedRehabCategory) {
      deleteMutation.mutate(selectedRehabCategory, {
        onSuccess: () => {
          setAlert({
            type: AppAlertType.SUCCESS,
            message: 'Rehab category successfully deleted',
          });
        },
        onError: () => {
          setAlert({
            type: AppAlertType.ERROR,
            message: 'Failed to delete rehab category',
          });
        },
      });
    }
  };

  const calcEstimateTotal = () => {
    return property.rehabEstimates
      .map((rehabEstimate) => rehabEstimate.estimate)
      .reduce((prev, current) => prev + current);
  };

  return (
    <Paper>
      <TableContainer className={classes.tableContainer}>
        <Table aria-label="rehab estimates table">
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell className={classes.tableHeaderCell}>
                Rehab Category
              </TableCell>
              <TableCell className={classes.tableHeaderCell}>
                Estimate
              </TableCell>
              <TableCell className={classes.tableHeaderCell}>Actual</TableCell>
              <TableCell className={classes.tableHeaderCell} colSpan={2}>
                Remaining
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {property.rehabEstimates &&
              property.rehabEstimates.map((rehabEstimate) => (
                <TableRow key={rehabEstimate.id}>
                  <TableCell>{rehabEstimate.description}</TableCell>
                  <TableCell>
                    {formatCurrency(rehabEstimate.estimate)}
                  </TableCell>
                  <TableCell>$0</TableCell>
                  <TableCell>
                    {formatCurrency(rehabEstimate.estimate)}
                  </TableCell>
                  <TableCell width="30">
                    <IconButton
                      aria-label="rehab category menu"
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        setAnchorEl(event.currentTarget);
                        setSelectedRehabCategory(rehabEstimate);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {property.rehabEstimates && property.rehabEstimates.length > 0 && (
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>Total</TableCell>
                <TableCell className={classes.tableHeaderCell}>
                  {formatCurrency(calcEstimateTotal())}
                </TableCell>
                <TableCell className={classes.tableHeaderCell}>$0.00</TableCell>
                <TableCell className={classes.tableHeaderCell} colSpan={2}>
                  {formatCurrency(calcEstimateTotal())}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <LargeButton
        click={() => {
          setSelectedRehabCategory(null);
          setDrawerOpen(true);
        }}
      >
        NEW REHAB CATEGORY
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
            confirmText="Are you sure you want to delete this rehab category?"
            buttonIcon="delete"
            confirmAction={onDeleteRehabCategory}
          />
        </MenuItem>
      </Menu>
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className={classes.bottomDrawer}
      >
        <RehabEstimateForm
          property={property}
          rehabCategory={selectedRehabCategory}
          close={() => setDrawerOpen(false)}
        />
      </Drawer>
    </Paper>
  );
};

export default RehabEstimateList;
