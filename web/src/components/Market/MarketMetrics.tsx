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
import { Market, MarketQuestion } from '../../types/userTypes';
import MarketPercentMetric from './MarketPercentMetric';
import MarketTrueFalseMetric from './MarketTrueFalseMetric';
import { debounce } from 'lodash';
import { getMarketMetricValue } from '../../utils/marketUtils';
import MarketTextMetric from './MarketTextMetric';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Query } from '../../types/queryTypes';
import RemasClient from '../../clients/RemasClient';

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
  market: Market;
}

const MarketMetrics: React.FC<Props> = ({ market }) => {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const {
    isLoading,
    isError,
    data: marketQuestions,
  } = useQuery(Query.GET_MARKET_QUESTIONS, RemasClient.getMarketQuestions);
  const mutation = useMutation(
    (data: { marketId: string; questionId: string; metricValue: string }) =>
      RemasClient.updateMarketMetric(
        data.marketId,
        data.questionId,
        data.metricValue
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(Query.GET_MARKETS);
      },
    }
  );

  const debouncedUpdateMarketMetric = debounce(
    (marketId: string, questionId: string, metricValue: string) => {
      mutation.mutate({ marketId, questionId, metricValue });
    },
    300,
    {
      leading: false,
      trailing: true,
    }
  );

  const getAnswerInput = (question: MarketQuestion) => {
    const answerValue = getMarketMetricValue(market, question);
    switch (question.answerType) {
      case 'TRUE_FALSE':
        return (
          <MarketTrueFalseMetric
            market={market}
            question={question}
            answerValue={answerValue}
            onUpdate={debouncedUpdateMarketMetric}
          />
        );
      case 'TEXT':
        return (
          <MarketTextMetric
            market={market}
            question={question}
            answerValue={answerValue}
            onUpdate={debouncedUpdateMarketMetric}
          />
        );
      default:
        return (
          <MarketPercentMetric
            market={market}
            question={question}
            answerValue={answerValue}
            onUpdate={debouncedUpdateMarketMetric}
          />
        );
    }
  };

  if (isLoading || isError) {
    return <></>;
  }

  return (
    <Paper>
      <TableContainer>
        <Table aria-label="markets table">
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell className={classes.tableHeaderCell} colSpan={2}>
                Metrics
              </TableCell>
            </TableRow>
          </TableHead>
          {marketQuestions && (
            <TableBody>
              {marketQuestions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell>
                    <div>{question.question}</div>
                    <div>{getAnswerInput(question)}</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default MarketMetrics;
