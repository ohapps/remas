import {
  makeStyles,
  Theme,
  createStyles,
  Typography,
  IconButton,
  Grid,
  TextField,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Property, PropertyNote } from '../../types/propertyTypes';
import CancelIcon from '@material-ui/icons/Cancel';
import LargeButton from '../Common/LargeButton';
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
  property: Property;
  note: PropertyNote | null;
  close: () => void;
}

const PropertyNoteForm: React.FC<Props> = ({ property, note, close }) => {
  const classes = useStyles();
  const { setAlert } = useAlerts();
  const [noteText, setNoteText] = useState('');
  const [noteError, setNoteError] = useState('');
  const queryClient = useQueryClient();
  const onMutationSuccess = () => {
    queryClient.invalidateQueries(Query.GET_PROPERTIES);
    close();
  };
  const createMutation = useMutation(
    (data: PropertyNote) => RemasClient.createPropertyNote(property, data),
    { onSuccess: onMutationSuccess }
  );
  const updateMutation = useMutation(
    (data: PropertyNote) => RemasClient.updatePropertyNote(property, data),
    { onSuccess: onMutationSuccess }
  );
  const maxNoteLength = 2000;
  const formValid = noteText && noteText.length <= maxNoteLength;

  useEffect(() => {
    if (note) {
      setNoteText(note.note);
    }
  }, [note]);

  const saveChanges = () => {
    if (formValid) {
      const updatedNote: PropertyNote = {
        id: note ? note.id : undefined,
        note: noteText,
      };
      if (note && note.id) {
        updateMutation.mutate(updatedNote, {
          onSuccess: () => {
            setAlert({
              type: AppAlertType.SUCCESS,
              message: 'Note successfully updated',
            });
          },
          onError: () => {
            setAlert({
              type: AppAlertType.ERROR,
              message: 'Failed to update note',
            });
          },
        });
      } else {
        createMutation.mutate(updatedNote, {
          onSuccess: () => {
            setAlert({
              type: AppAlertType.SUCCESS,
              message: 'Note successfully created',
            });
          },
          onError: () => {
            setAlert({
              type: AppAlertType.ERROR,
              message: 'Failed to create note',
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
            {`${note ? 'Edit' : 'New'} Note`}
          </Typography>
          <IconButton aria-label="close drawer" onClick={close}>
            <CancelIcon fontSize="large" />
          </IconButton>
        </div>
        <form className={classes.form} noValidate autoComplete="off">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Note"
                value={noteText}
                autoFocus
                multiline
                rowsMax={4}
                className={classes.formInput}
                error={!!noteError}
                helperText={noteError}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setNoteText(event.target.value);
                  if (
                    event.target.value &&
                    event.target.value.length > maxNoteLength
                  ) {
                    setNoteError(
                      `note exceeds max length of ${maxNoteLength} characters`
                    );
                  } else {
                    setNoteError('');
                  }
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

export default PropertyNoteForm;
