import { Container, createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { ReactNode, useState } from 'react';
import { appConfig } from '../../config/app-config';
import FailedPage from './FailedPage';
import Loading from './Loading';
import Sidebar from './Sidebar';
import TitleBar from './TitleBar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.up('sm')]: {
        marginLeft: appConfig.drawerWidth,
      },
      marginTop: appConfig.titleBarHeight,
    },
    container: {
      paddingTop: appConfig.contentTopPadding,
    },
  })
);

interface Props {
  title: string;
  children: ReactNode;
  closeText?: string;
  closeUrl?: string;
  closeAction?: () => void;
  isLoading?: boolean;
  isError?: boolean;
}

const Page: React.FC<Props> = ({
  title,
  children,
  closeText,
  closeUrl,
  closeAction,
  isLoading = false,
  isError = false,
}) => {
  const classes = useStyles();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <Sidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <TitleBar
        title={title}
        closeText={closeText}
        closeUrl={closeUrl}
        closeAction={closeAction}
        toggleMobileMenu={toggleMobileMenu}
      />
      <div className={classes.root}>
        <Container maxWidth="lg">
          <div className={classes.container}>
            {isError ? <FailedPage /> : children}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Page;
