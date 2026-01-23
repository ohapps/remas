import { TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Market, MarketQuestion } from '../../types/userTypes';

interface Props {
  market: Market;
  question: MarketQuestion;
  answerValue: string | undefined;
  onUpdate: (marketId: string, questionId: string, metricValue: string) => void;
}

const MarketTextMetric: React.FC<Props> = ({
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
      fullWidth
      multiline
      maxRows={5}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setValue(newValue);
        onUpdate(market.id, question.id, newValue);
      }}
    />
  );
};

export default MarketTextMetric;
