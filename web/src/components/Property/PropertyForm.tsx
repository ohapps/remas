import {
  makeStyles,
  Theme,
  createStyles,
  TextField,
  Grid,
  Button,
  Paper,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
} from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React, { ReactNode, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import RemasClient from '../../clients/RemasClient';
import { appRoutes } from '../../config/app-config';
import useAlerts from '../../hooks/useAlerts';
import { AppAlertType } from '../../types/appTypes';
import { Property } from '../../types/propertyTypes';
import { Query } from '../../types/queryTypes';
import { isNumeric } from '../../utils/generalUtils';
import ConfirmButton from '../Common/ConfirmButton';
import MoreHorizIcon from '@material-ui/icons/MoreHorizOutlined';
import { Market } from '../../types/userTypes';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: 'flex',
      flexDirection: 'column',
      '& div': {
        marginBottom: '10px',
      },
    },
    smallButton: {
      marginTop: '5px',
      marginBottom: '33px',
    },
    formColumn: {
      padding: '0px 20px',
    },
    editMenuItem: {
      '& svg': {
        paddingRight: '15px',
      },
    },
    formSelect: {
      textAlign: 'left',
    },
  })
);

interface Props {
  property: Property;
  setNewId: (id: string) => void;
  markets: Market[];
}

const PropertyForm: React.FC<Props> = ({ property, setNewId, markets }) => {
  const classes = useStyles();
  const history = useHistory();
  const { setAlert } = useAlerts();
  const [editableProperty, setEditableProperty] = useState(property);
  const [enterPurchased, setEnterPurchased] = useState(!!property?.purchased);
  const [enterInService, setEnterInService] = useState(!!property?.inService);
  const [purchasedHasError, setPurchasedHasError] = useState(false);
  const [inServiceHasError, setInServiceHasError] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const queryClient = useQueryClient();
  const onMutationSuccess = () => {
    queryClient.invalidateQueries(Query.GET_PROPERTIES);
  };
  const createMutation = useMutation(
    (data: Property) => RemasClient.createProperty(data),
    {
      onSuccess: (data) => {
        onMutationSuccess();
        data && propertyCreated(data);
      },
    }
  );
  const updateMutation = useMutation(
    (data: Property) => RemasClient.updateProperty(data),
    { onSuccess: onMutationSuccess }
  );
  const deleteMutation = useMutation(
    (data: Property) => RemasClient.deleteProperty(data),
    { onSuccess: onMutationSuccess }
  );
  const archiveMutation = useMutation(
    (data: Property) => RemasClient.archiveProperty(data),
    { onSuccess: onMutationSuccess }
  );
  const unarchiveMutation = useMutation(
    (data: Property) => RemasClient.unarchiveProperty(data),
    { onSuccess: onMutationSuccess }
  );
  const isFormInvalid =
    !editableProperty.address ||
    !editableProperty.city ||
    !editableProperty.state ||
    !editableProperty.zipCode ||
    !editableProperty.units ||
    purchasedHasError ||
    inServiceHasError;

  const saveProperty = () => {
    if (!property.id) {
      createMutation.mutate(editableProperty, {
        onSuccess: () => {
          setAlert({
            type: AppAlertType.SUCCESS,
            message: 'Property successfully created',
          });
        },
        onError: () => {
          setAlert({
            type: AppAlertType.ERROR,
            message: 'Failed to create property',
          });
        },
      });
    } else {
      updateMutation.mutate(editableProperty, {
        onSuccess: () => {
          setAlert({
            type: AppAlertType.SUCCESS,
            message: 'Property successfully updated',
          });
        },
        onError: () => {
          setAlert({
            type: AppAlertType.ERROR,
            message: 'Failed to update property',
          });
        },
      });
    }
  };

  const onDeleteProperty = () => {
    deleteMutation.mutate(property);
    history.push(appRoutes.PROPERTIES);
  };

  const onArchiveProperty = () => {
    archiveMutation.mutate(property);
    history.push(appRoutes.PROPERTIES);
  };

  const onRestoreProperty = () => {
    unarchiveMutation.mutate(property);
    history.push(appRoutes.PROPERTIES);
  };

  const propertyCreated = (newProperty: Property) => {
    setEditableProperty(newProperty);
    setNewId(newProperty.id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Paper>
      <form className={classes.form} noValidate autoComplete="off">
        <Grid container>
          <Grid
            item
            md={6}
            className={classes.formColumn}
            style={{ textAlign: 'left', display: 'flex' }}
          >
            <Typography variant="h5">Property Details</Typography>
            {property.archived && (
              <Chip
                label="archived"
                size="small"
                style={{ marginLeft: '10px' }}
              />
            )}
          </Grid>
          <Grid
            item
            md={6}
            className={classes.formColumn}
            style={{ textAlign: 'right' }}
          >
            {property.id && (
              <>
                <IconButton
                  aria-label="property menu"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    setAnchorEl(event.currentTarget);
                  }}
                >
                  <MoreHorizIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  {!property.archived && (
                    <MenuItem
                      className={classes.editMenuItem}
                      onClick={handleMenuClose}
                    >
                      <ConfirmButton
                        buttonText="ARCHIVE"
                        buttonIcon="archive"
                        confirmText="Are you sure you want to archive this property?"
                        confirmAction={onArchiveProperty}
                      />
                    </MenuItem>
                  )}
                  {property.archived && (
                    <MenuItem
                      className={classes.editMenuItem}
                      onClick={handleMenuClose}
                    >
                      <ConfirmButton
                        buttonText="RESTORE"
                        buttonIcon="unarchive"
                        confirmText="Are you sure you want to restore this property?"
                        confirmAction={onRestoreProperty}
                      />
                    </MenuItem>
                  )}
                  <MenuItem
                    className={classes.editMenuItem}
                    onClick={handleMenuClose}
                  >
                    <ConfirmButton
                      buttonText="DELETE"
                      buttonIcon="delete"
                      confirmText="Are you sure you want to delete this property?"
                      confirmAction={onDeleteProperty}
                    />
                  </MenuItem>
                </Menu>
              </>
            )}
          </Grid>
          <Grid item md={7} className={classes.formColumn}>
            <TextField
              label="Address"
              required
              value={editableProperty.address}
              fullWidth
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setEditableProperty({
                  ...editableProperty,
                  address: event.target.value,
                });
              }}
            />
            <TextField
              label="City"
              required
              value={editableProperty.city}
              fullWidth
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setEditableProperty({
                  ...editableProperty,
                  city: event.target.value,
                });
              }}
            />
            <TextField
              label="State"
              required
              value={editableProperty.state}
              fullWidth
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setEditableProperty({
                  ...editableProperty,
                  state: event.target.value,
                });
              }}
            />
            <TextField
              label="Zip"
              required
              value={editableProperty.zipCode}
              fullWidth
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setEditableProperty({
                  ...editableProperty,
                  zipCode: event.target.value,
                });
              }}
            />
            <TextField
              label="Listing URL"
              value={editableProperty.listingUrl}
              fullWidth
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setEditableProperty({
                  ...editableProperty,
                  listingUrl: event.target.value,
                });
              }}
            />
            <FormControl fullWidth>
              <InputLabel id="market">Market</InputLabel>
              <Select
                labelId="market"
                value={editableProperty.marketId}
                className={classes.formSelect}
                onChange={(
                  event: React.ChangeEvent<{ name?: string; value: unknown }>
                ) => {
                  setEditableProperty({
                    ...editableProperty,
                    marketId: event.target.value as string,
                  });
                }}
              >
                <MenuItem value="">No Market</MenuItem>
                {markets.map((market) => (
                  <MenuItem value={market.id}>{market.description}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={5} className={classes.formColumn}>
            <TextField
              label="Units"
              required
              value={editableProperty.units}
              fullWidth
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (isNumeric(event.target.value)) {
                  setEditableProperty({
                    ...editableProperty,
                    units: parseFloat(event.target.value),
                  });
                }
              }}
            />
            <TextField
              label="Monthly Rent"
              value={editableProperty.monthlyRent}
              fullWidth
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (isNumeric(event.target.value)) {
                  setEditableProperty({
                    ...editableProperty,
                    monthlyRent: parseFloat(event.target.value),
                  });
                }
              }}
            />
            <TextField
              label="After Repair Value"
              value={editableProperty.arv}
              fullWidth
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (isNumeric(event.target.value)) {
                  setEditableProperty({
                    ...editableProperty,
                    arv: parseFloat(event.target.value),
                  });
                }
              }}
            />
            {enterPurchased ? (
              <KeyboardDatePicker
                fullWidth
                format="MM/dd/yyyy"
                label="Purchased"
                autoOk
                value={editableProperty.purchased}
                onChange={(date, value) => {
                  setEditableProperty({
                    ...editableProperty,
                    purchased: value ? value : undefined,
                  });
                  if (!date) {
                    setEnterPurchased(false);
                  }
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                onError={(error: ReactNode) => {
                  error
                    ? setPurchasedHasError(true)
                    : setPurchasedHasError(false);
                }}
              />
            ) : (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                fullWidth
                className={classes.smallButton}
                onClick={() => setEnterPurchased(true)}
              >
                Enter Purchased Date
              </Button>
            )}
            {enterInService ? (
              <KeyboardDatePicker
                fullWidth
                autoOk
                format="MM/dd/yyyy"
                label="In Service"
                value={editableProperty.inService}
                onChange={(date, value) => {
                  setEditableProperty({
                    ...editableProperty,
                    inService: value ? value : undefined,
                  });
                  if (!date) {
                    setEnterInService(false);
                  }
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                onError={(error: ReactNode) => {
                  error
                    ? setInServiceHasError(true)
                    : setInServiceHasError(false);
                }}
              />
            ) : (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                fullWidth
                className={classes.smallButton}
                onClick={() => setEnterInService(true)}
              >
                Enter In Service Date
              </Button>
            )}
          </Grid>
          <Grid
            item
            md={12}
            className={classes.formColumn}
            style={{ textAlign: 'right' }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={saveProperty}
              disabled={isFormInvalid}
            >
              SAVE
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default PropertyForm;
