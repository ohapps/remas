import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { createContext, ReactNode, useState } from 'react';
import { AppAlert } from '../types/appTypes';

interface AlertContextInterface {
  alert: AppAlert | undefined;
  setAlert: (alert: AppAlert) => void;
}

export const AlertContext = createContext<AlertContextInterface>({
  alert: undefined,
  setAlert: (alert: AppAlert) => {},
});

interface Props {
  children: ReactNode;
}

const AlertProvider: React.FC<Props> = ({ children }) => {
  const [alert, setAlert] = useState<AppAlert | undefined>();

  const closeAlert = () => {
    setAlert(undefined);
  };

  return (
    <AlertContext.Provider
      value={{
        alert: alert,
        setAlert: setAlert,
      }}
    >
      <Snackbar
        open={!!alert}
        autoHideDuration={3000}
        onClose={closeAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {alert && (
          <Alert variant="filled" severity={alert.type} onClose={closeAlert}>
            {alert.message}
          </Alert>
        )}
      </Snackbar>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
