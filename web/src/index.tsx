import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import * as Sentry from '@sentry/react';
import { ThemeProvider } from '@material-ui/core';
import { CustomTheme } from './themes/custom';
import { Auth0Provider } from '@auth0/auth0-react';
import AppInitializer from './AppInitializer';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import AlertProvider from './context/AlertProvider';

Sentry.init({
  dsn: 'https://797e03a579d448cbb83ed97d6ff9e273@o348873.ingest.sentry.io/5768862',
  environment: process.env.NODE_ENV,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

ReactDOM.render(
  <Sentry.ErrorBoundary showDialog>
    <Auth0Provider
      domain="dev--hkrho7z.us.auth0.com"
      clientId="Fdx5o2wEpWgjgpbWeUwc9ZVMFn2eZsxR"
      redirectUri={window.location.origin}
      audience="https://dev--hkrho7z.us.auth0.com/api/v2/"
      scope="profile"
    >
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <React.StrictMode>
            <ThemeProvider theme={CustomTheme}>
              <AlertProvider>
                <AppInitializer>
                  <App />
                </AppInitializer>
              </AlertProvider>
            </ThemeProvider>
          </React.StrictMode>
        </QueryClientProvider>
      </MuiPickersUtilsProvider>
    </Auth0Provider>
  </Sentry.ErrorBoundary>,
  document.getElementById('root')
);
