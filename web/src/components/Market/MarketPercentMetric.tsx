import { InputAdornment, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Market, MarketQuestion } from '../../types/userTypes';
import { isNumeric } from '../../utils/generalUtils';

interface Props {
  market: Market;
  question: MarketQuestion;
  answerValue: string | undefined;
  onUpdate: (marketId: string, questionId: string, metricValue: string) => void;
}

const MarketPercentMetric: React.FC<Props> = ({
  market,
  question,
  answerValue,
  onUpdate,
}) => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    setValue(answerValue);
  }, [answerValue]);

  return (
    <TextField
      value={value ? value : ''}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if (isNumeric(newValue)) {
          setValue(newValue);
          onUpdate(market.id, question.id, newValue);
        }
      }}
      InputProps={{
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
      }}
    />
  );
};

export default MarketPercentMetric;
