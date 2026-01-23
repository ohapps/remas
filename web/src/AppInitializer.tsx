import { useAuth0 } from '@auth0/auth0-react';
import React, { useCallback, useEffect, useState } from 'react';
import Loading from './components/Common/Loading';
import { setAccessTokenHeader } from './config/axios-config';
import axios from './config/axios-config';
import { AxiosError } from 'axios';

interface Props {
  children: React.ReactNode;
}

const AppInitializer: React.FC<Props> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const {
    loginWithRedirect,
    isAuthenticated,
    isLoading,
    user,
    getAccessTokenSilently,
    logout,
  } = useAuth0();

  const checkHealth = useCallback(() => {
    axios
      .get('/app/status', { timeout: 5000 })
      .then(() => {
        setAppReady(true);
      })
      .catch((error: AxiosError) => {
        if (error.response?.status === 401) {
          logout();
        } else {
          setAppReady(false);
        }
      });
  }, [logout]);

  useEffect(() => {
    const getUserAccessToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        setAccessTokenHeader(accessToken);
        setAuthenticated(true);
      } catch (e) {
        console.log('access token error', e);
      }
    };

    if (!isLoading && isAuthenticated && user) {
      getUserAccessToken();
    }
  }, [user, getAccessTokenSilently, isAuthenticated, isLoading, checkHealth]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (authenticated) {
      checkHealth();
      interval = setInterval(checkHealth, 10000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [authenticated, checkHealth]);

  if (!isLoading && !isAuthenticated) {
    loginWithRedirect();
  }

  if (!appReady) {
    return <Loading useAnimatedGif />;
  }

  return <>{children}</>;
};

export default AppInitializer;
