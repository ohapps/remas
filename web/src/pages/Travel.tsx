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
import Page from '../components/Common/Page';
import EditIcon from '@material-ui/icons/Edit';
import ConfirmButton from '../components/Common/ConfirmButton';
import { TravelLog } from '../types/travelLogTypes';
import TravelLogForm from '../components/TravelLog/TravelLogForm';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import RemasClient from '../clients/RemasClient';
import { useMutation, useQuery, useQueryClient } from 'react-query';
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

const Travel: React.FC = () => {
  const classes = useStyles();
  const { setAlert } = useAlerts();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTravelLog, setSelectedTravelLog] = useState<TravelLog | null>(
    null
  );
  const {
    isLoading,
    isError,
    data: travelLogs,
  } = useQuery('getTravelLogs', RemasClient.getTravelLogs);
  const queryClient = useQueryClient();
  const onMutationSuccess = () => {
    queryClient.invalidateQueries(Query.GET_TRAVEL_LOGS);
  };
  const deleteMutation = useMutation(
    (data: TravelLog) => RemasClient.deleteTravelLog(data),
    { onSuccess: onMutationSuccess }
  );

  const onNewTravelLog = () => {
    setSelectedTravelLog(null);
    setDrawerOpen(true);
  };

  const onDeleteEntry = () => {
    selectedTravelLog &&
      deleteMutation.mutate(selectedTravelLog, {
        onSuccess: () => {
          setAlert({
            type: AppAlertType.SUCCESS,
            message: 'Travel log successfully deleted',
          });
        },
        onError: () => {
          setAlert({
            type: AppAlertType.ERROR,
            message: 'Failed to delete travel log',
          });
        },
      });
  };

  return (
    <Page
      title="Travel"
      closeText="New Travel Log"
      closeAction={onNewTravelLog}
      isLoading={isLoading}
      isError={isError}
    >
      <Paper>
        <TableContainer>
          <Table aria-label="travel log table">
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>Date</TableCell>
                <TableCell className={classes.tableHeaderCell}>
                  Description
                </TableCell>
                <TableCell className={classes.tableHeaderCell} colSpan={2}>
                  Miles
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {travelLogs &&
                travelLogs.map((travelLog) => (
                  <TableRow key={travelLog.id}>
                    <TableCell>{travelLog.travelDate}</TableCell>
                    <TableCell>{travelLog.description}</TableCell>
                    <TableCell>{travelLog.miles}</TableCell>
                    <TableCell width="30">
                      <IconButton
                        aria-label="travel log menu"
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {
                          setAnchorEl(event.currentTarget);
                          setSelectedTravelLog(travelLog);
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
            confirmText="Are you sure you want to delete this travel log?"
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
        <TravelLogForm
          travelLog={selectedTravelLog}
          close={() => setDrawerOpen(false)}
        />
      </Drawer>
    </Page>
  );
};

export default Travel;
