import {
  makeStyles,
  Theme,
  createStyles,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Drawer,
  Menu,
  MenuItem,
  Button,
  IconButton,
  Paper,
} from '@material-ui/core';
import React, { useState } from 'react';
import { Property, PropertyNote } from '../../types/propertyTypes';
import ConfirmButton from '../Common/ConfirmButton';
import LargeButton from '../Common/LargeButton';
import PropertyNoteForm from './PropertyNoteForm';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { formatDate } from '../../utils/generalUtils';
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
    noteTimestamp: {
      fontStyle: 'italic',
      fontSize: '10px',
      paddingTop: '10px',
    },
  })
);

interface Props {
  property: Property;
}

const PropertyNoteList: React.FC<Props> = ({ property }) => {
  const classes = useStyles();
  const { setAlert } = useAlerts();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [note, setNote] = useState<PropertyNote | null>(null);
  const queryClient = useQueryClient();
  const onMutationSuccess = () => {
    queryClient.invalidateQueries(Query.GET_PROPERTIES);
  };
  const deleteMutation = useMutation(
    (data: PropertyNote) => RemasClient.deletePropertyNote(property, data),
    { onSuccess: onMutationSuccess }
  );

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const onDeleteNote = () => {
    if (note) {
      deleteMutation.mutate(note, {
        onSuccess: () => {
          setAlert({
            type: AppAlertType.SUCCESS,
            message: 'Note successfully deleted',
          });
        },
        onError: () => {
          setAlert({
            type: AppAlertType.ERROR,
            message: 'Failed to delete note',
          });
        },
      });
    }
  };

  return (
    <Paper>
      <TableContainer className={classes.tableContainer}>
        <Table aria-label="notes table">
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell className={classes.tableHeaderCell} colSpan={2}>
                Notes
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {property.notes &&
              property.notes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell>
                    {note.note}{' '}
                    {note.updatedDate && (
                      <div className={classes.noteTimestamp}>
                        updated {formatDate(note.updatedDate)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell width="30">
                    <IconButton
                      aria-label="rehab category menu"
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        setAnchorEl(event.currentTarget);
                        setNote(note);
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
          setNote(null);
          setDrawerOpen(true);
        }}
      >
        NEW NOTE
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
            confirmText="Are you sure you want to delete this note?"
            buttonIcon="delete"
            confirmAction={onDeleteNote}
          />
        </MenuItem>
      </Menu>
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className={classes.bottomDrawer}
      >
        <PropertyNoteForm
          property={property}
          note={note}
          close={() => setDrawerOpen(false)}
        />
      </Drawer>
    </Paper>
  );
};

export default PropertyNoteList;
