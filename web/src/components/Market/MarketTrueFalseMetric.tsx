import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Market, MarketQuestion } from '../../types/userTypes';

interface Props {
  market: Market;
  question: MarketQuestion;
  answerValue: string | undefined;
  onUpdate: (marketId: string, questionId: string, metricValue: string) => void;
}

const MarketTrueFalseMetric: React.FC<Props> = ({
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
    <RadioGroup
      value={value ? value : ''}
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        onUpdate(market.id, question.id, event.target.value);
      }}
    >
      <FormControlLabel value="true" control={<Radio />} label="True" />
      <FormControlLabel value="false" control={<Radio />} label="False" />
    </RadioGroup>
  );
};

export default MarketTrueFalseMetric;
