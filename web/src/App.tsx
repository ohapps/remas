import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Ledger from './pages/Ledger';
import Markets from './pages/Markets';
import Properties from './pages/Properties';
import Travel from './pages/Travel';
import Loading from './components/Common/Loading';
import MarketDetail from './pages/MarketDetail';
import { appRoutes } from './config/app-config';
import PropertyDetail from './pages/PropertyDetail';
import Settings from './pages/Settings';
import MetricQuestions from './pages/MetricQuestions';
import DefaultExpenses from './pages/DefaultExpenses';
import { useQuery } from 'react-query';
import RemasClient from './clients/RemasClient';
import FailedPage from './components/Common/FailedPage';

const App: React.FC = () => {
  const { isLoading, isError } = useQuery('getUser', RemasClient.getUser);

  if (isError) {
    return <FailedPage />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route
            path={`${appRoutes.MARKET_DETAIL}:id/parent/:parent`}
            component={MarketDetail}
          />
          <Route
            path={`${appRoutes.MARKET_DETAIL}:id`}
            component={MarketDetail}
          />
          <Route path={appRoutes.MARKETS} component={Markets} />
          <Route path={appRoutes.PROPERTIES} component={Properties} />
          <Route
            path={`${appRoutes.PROPERTY_DETAIL}:id`}
            component={PropertyDetail}
          />
          <Route path={appRoutes.LEDGER} component={Ledger} />
          <Route path={appRoutes.TRAVEL} component={Travel} />
          <Route path={appRoutes.SETTINGS} component={Settings} exact />
          <Route
            path={appRoutes.SETTINGS_METRICS}
            component={MetricQuestions}
            exact
          />
          <Route
            path={appRoutes.SETTINGS_EXPENSES}
            component={DefaultExpenses}
            exact
          />
          <Route path={appRoutes.DASHBOARD} exact component={Dashboard} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
