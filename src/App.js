import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import MuiThemeProvider from '@material-ui/core/es/styles/MuiThemeProvider';
import { SnackbarProvider, withSnackbar } from 'notistack';
import { I18nextProvider } from 'react-i18next';
import * as Sentry from '@sentry/browser';
import authStore from './stores/authStore';
import dashboardStore from './stores/dashboardStore';
import userStore from './stores/userStore';
import ordersStore from './stores/ordersStore';
import AppRouter from './components/AppRouter';
import { COLORS } from './styles/colors';
import i18n from './config/i18n';
import { OVERRIDES } from './styles/overrides';

const stores = {
  authStore,
  dashboardStore,
  userStore,
  ordersStore
};

const theme = createMuiTheme({
  palette: {
    primary: {
      main: COLORS.PRIMARY_COLOR
    },
    secondary: {
      main: COLORS.GREY
    }
  },
  overrides: OVERRIDES,
  typography: {
    useNextVariants: true
  }
});

class App extends Component {
  componentDidCatch(error, errorInfo) {
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
    });
  }

  render() {
    return (
      <Provider {...stores}>
        <MuiThemeProvider theme={theme}>
          <I18nextProvider i18n={i18n}>
            <SnackbarProvider maxSnack={3}>
              <BrowserRouter>
                <AppRouter />
              </BrowserRouter>
            </SnackbarProvider>
          </I18nextProvider>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default withSnackbar(App);
