import {
  Button,
  createStyles,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
} from '@material-ui/core';
import React, { useState } from 'react';
import Page from '../components/Common/Page';
import { appRoutes } from '../config/app-config';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ConfirmButton from '../components/Common/ConfirmButton';
import EditIcon from '@material-ui/icons/Edit';
import { MarketQuestion } from '../types/userTypes';
import MarketQuestionForm from '../components/Market/MarketQuestionForm';
import LargeButton from '../components/Common/LargeButton';
import BottomDrawer from '../components/Common/BottomDrawer';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import RemasClient from '../clients/RemasClient';
import { Query } from '../types/queryTypes';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableHeader: {
      backgroundColor: theme.palette.grey[100],
    },
    tableHeaderCell: {
      fontWeight: theme.typography.fontWeightBold,
    },
    editMenuItem: {
      '& svg': {
        paddingRight: '15px',
      },
    },
  })
);

const MetricQuestions = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMarketQuestion, setSelectedMarketQuestion] = useState<
    MarketQuestion | undefined
  >();
  const queryClient = useQueryClient();
  const {
    isLoading,
    isError,
    data: marketQuestions,
  } = useQuery(Query.GET_MARKET_QUESTIONS, RemasClient.getMarketQuestions);
  const deleteMutation = useMutation(
    (data: string) => RemasClient.deleteMarketQuestion(data),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(Query.GET_MARKET_QUESTIONS),
    }
  );

  const onDeleteQuestion = () => {
    selectedMarketQuestion && deleteMutation.mutate(selectedMarketQuestion.id);
  };

  return (
    <Page
      title="Edit Market Metric Questions"
      closeText="Return To Settings"
      closeUrl={appRoutes.SETTINGS}
      isLoading={isLoading}
      isError={isError}
    >
      <Paper>
        <TableContainer>
          <Table aria-label="metric questions table">
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell className={classes.tableHeaderCell}>
                  Question
                </TableCell>
                <TableCell className={classes.tableHeaderCell} colSpan={2}>
                  Answer Type
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {marketQuestions &&
                marketQuestions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell width="70%">{question.question}</TableCell>
                    <TableCell>{question.answerType}</TableCell>
                    <TableCell width="30">
                      <IconButton
                        aria-label="question menu"
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {
                          setAnchorEl(event.currentTarget);
                          setSelectedMarketQuestion(question);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <LargeButton
          click={() => {
            setSelectedMarketQuestion(undefined);
            setDrawerOpen(true);
          }}
        >
          NEW QUESTION
        </LargeButton>
      </Paper>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          className={classes.editMenuItem}
          onClick={() => {
            setDrawerOpen(true);
            setAnchorEl(null);
          }}
        >
          <Button>
            <EditIcon /> EDIT
          </Button>
        </MenuItem>
        <MenuItem
          className={classes.editMenuItem}
          onClick={() => setAnchorEl(null)}
        >
          <ConfirmButton
            buttonText="DELETE"
            confirmText="Are you sure you want to delete this question?"
            buttonIcon="delete"
            confirmAction={onDeleteQuestion}
          />
        </MenuItem>
      </Menu>
      <BottomDrawer
        drawerOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={'Market Question'}
      >
        <MarketQuestionForm
          marketQuestion={selectedMarketQuestion}
          close={() => setDrawerOpen(false)}
        />
      </BottomDrawer>
    </Page>
  );
};

export default MetricQuestions;
