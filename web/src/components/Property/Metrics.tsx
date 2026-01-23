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
  Tooltip,
} from '@material-ui/core';
import React from 'react';
import { Metric, MetricUnit, Property } from '../../types/propertyTypes';
import { formatCurrency } from '../../utils/generalUtils';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableContainer: {},
    tableHeader: {
      backgroundColor: theme.palette.grey[100],
    },
    tableHeaderCell: {
      fontWeight: theme.typography.fontWeightBold,
    },
  })
);

interface Props {
  property: Property;
}

const Metrics: React.FC<Props> = ({ property }) => {
  const classes = useStyles();

  const formatMetric = (metric: Metric) => {
    switch (metric.metricUnit) {
      case MetricUnit.DOLLAR_AMOUNT:
        return formatCurrency(metric.metric);
      case MetricUnit.PERCENT:
        return `${metric.metric}%`;
      default:
        return metric.metric;
    }
  };

  return (
    <Paper>
      <TableContainer className={classes.tableContainer}>
        <Table aria-label="metrics table">
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell className={classes.tableHeaderCell} colSpan={2}>
                Metrics
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {property.metrics.map((metric) => (
              <TableRow key={metric.description}>
                <TableCell>
                  {metric.description}{' '}
                  {metric.helpText && (
                    <Tooltip
                      title={metric.helpText}
                      aria-label={metric.helpText}
                    >
                      <InfoIcon style={{ fontSize: '14px' }} />
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>{formatMetric(metric)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Metrics;
