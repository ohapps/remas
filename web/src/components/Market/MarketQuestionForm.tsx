import {
  createStyles,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Theme,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import RemasClient from '../../clients/RemasClient';
import { Query } from '../../types/queryTypes';
import { MarketQuestion, MarketQuestionUpdate } from '../../types/userTypes';
import LargeButton from '../Common/LargeButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '40px',
    },
    formInput: {
      marginBottom: '10px',
    },
  })
);

interface Props {
  marketQuestion: MarketQuestion | undefined;
  close: () => void;
}

const MarketQuestionForm: React.FC<Props> = ({ marketQuestion, close }) => {
  const classes = useStyles();
  const [question, setQuestion] = useState(marketQuestion?.question);
  const [answerType, setAnswerType] = useState(marketQuestion?.answerType);
  const formValid = question && answerType;
  const queryClient = useQueryClient();
  const onMutationSuccess = () => {
    queryClient.invalidateQueries(Query.GET_MARKET_QUESTIONS);
    close();
  };
  const createMutation = useMutation(
    (data: MarketQuestionUpdate) => RemasClient.createMarketQuestion(data),
    { onSuccess: onMutationSuccess }
  );
  const updateMutation = useMutation(
    (data: { id: string; marketQuestionUpdate: MarketQuestionUpdate }) =>
      RemasClient.updateMarketQuestion(data.id, data.marketQuestionUpdate),
    { onSuccess: onMutationSuccess }
  );

  const saveChanges = () => {
    if (question && answerType) {
      const marketQuestionUpdate: MarketQuestionUpdate = {
        question,
        answerType,
      };

      if (marketQuestion) {
        updateMutation.mutate({
          id: marketQuestion.id,
          marketQuestionUpdate: marketQuestionUpdate,
        });
      } else {
        createMutation.mutate(marketQuestionUpdate);
      }
    }
  };

  return (
    <form className={classes.form} noValidate autoComplete="off">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Question"
            value={question}
            fullWidth
            required
            className={classes.formInput}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setQuestion(event.target.value);
            }}
          />
          <FormControl fullWidth className={classes.formInput}>
            <InputLabel id="answerType" required>
              Answer Type
            </InputLabel>
            <Select
              required
              label="answerType"
              fullWidth
              value={answerType}
              onChange={(
                event: React.ChangeEvent<{ name?: string; value: unknown }>
              ) => {
                setAnswerType(event.target.value as string);
              }}
            >
              <MenuItem value="TEXT" key="TEXT">
                Text
              </MenuItem>
              <MenuItem value="PERCENT" key="PERCENT">
                Percent
              </MenuItem>
              <MenuItem value="TRUE_FALSE" key="TRUE_FALSE">
                True/False
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <LargeButton click={saveChanges} disabled={!formValid}>
        SAVE
      </LargeButton>
    </form>
  );
};

export default MarketQuestionForm;
