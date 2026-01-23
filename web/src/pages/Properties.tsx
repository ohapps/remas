import {
  createStyles,
  FormControlLabel,
  Switch,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  FormGroup,
  Chip,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import RemasClient from '../clients/RemasClient';
import Page from '../components/Common/Page';
import { appRoutes } from '../config/app-config';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableHeader: {
      backgroundColor: theme.palette.grey[100],
    },
    tableHeaderCell: {
      fontWeight: theme.typography.fontWeightBold,
    },
  })
);

const Properties: React.FC = () => {
  const classes = useStyles();
  const [showArchived, setShowArchived] = useState(false);
  const {
    isLoading,
    isError,
    data: properties,
  } = useQuery('getProperties', RemasClient.getProperties);

  const filteredProperties =
    properties?.filter((prop) => !prop.archived || showArchived) ?? [];

  return (
    <Page
      title="Properties"
      closeText="NEW PROPERTY"
      closeUrl={`${appRoutes.PROPERTY_DETAIL}new`}
      isLoading={isLoading}
      isError={isError}
    >
      <FormGroup row style={{ justifyContent: 'end' }}>
        <FormControlLabel
          control={
            <Switch
              checked={showArchived}
              onChange={() => {
                setShowArchived(!showArchived);
              }}
              color="primary"
            />
          }
          label="Show Archived"
        />
      </FormGroup>
      <Paper>
        <TableContainer>
          <Table aria-label="properties table">
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>
                  Address
                </TableCell>
                <TableCell className={classes.tableHeaderCell}>City</TableCell>
                <TableCell className={classes.tableHeaderCell}>State</TableCell>
                <TableCell className={classes.tableHeaderCell}>
                  Zip Code
                </TableCell>
                <TableCell className={classes.tableHeaderCell}>Units</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <Link to={`${appRoutes.PROPERTY_DETAIL}${property.id}`}>
                      {property.address}{' '}
                    </Link>
                    {property.archived && (
                      <Chip
                        label="archived"
                        size="small"
                        style={{ marginLeft: '10px' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{property.city}</TableCell>
                  <TableCell>{property.state}</TableCell>
                  <TableCell>{property.zipCode}</TableCell>
                  <TableCell>{property.units}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Page>
  );
};

export default Properties;
