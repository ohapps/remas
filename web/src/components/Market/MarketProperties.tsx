import {
  createStyles,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
} from '@material-ui/core';
import React from 'react';
import { appRoutes } from '../../config/app-config';
import { Property } from '../../types/propertyTypes';
import { Link } from 'react-router-dom';

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

interface Props {
  properties: Property[];
}

const MarketProperties: React.FC<Props> = ({ properties }) => {
  const classes = useStyles();

  return (
    <Paper>
      <TableContainer>
        <Table aria-label="market properties table">
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell className={classes.tableHeaderCell} colSpan={2}>
                Properties
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>
                  <Link to={`${appRoutes.PROPERTY_DETAIL}${property.id}`}>
                    {`${property.address}, ${property.city}, ${property.state} ${property.zipCode}`}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default MarketProperties;
