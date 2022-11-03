// @flow
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import 'moment/locale/en-gb';
import 'moment/locale/pl';
import Login from './Login';
import ForgotUserPassword from './ForgotUserPassword';
import SetPassword from './SetPassword';
import DashboardContainer from './DashboardContainer';
import Home from './Home';
import OrderNotLogged from './OrderNotLogged';
import InfoPage from './InfoPage';
import ThankYouPage from './ThankYouPage';

const PrivateRoute = ({ component: Component, loggedIn, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      loggedIn ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/home',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

@inject('authStore')
@withRouter
@observer
class AppRouter extends Component {
  constructor(props) {
    super(props);
    this.props.authStore.autoLoginAction();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.authStore.session && !nextProps.authStore.session) {
      this.props.enqueueSnackbar('Session expired! Please login again.', {
        variant: 'warning'
      });
    }
  }

  renderRoutes = session => (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/forgot-password" component={ForgotUserPassword} />
      <Route path="/reset-password/:token" component={SetPassword} />
      <Route path="/newOrder/:token?" component={OrderNotLogged} />
      <Route path="/info/token" component={InfoPage} />
      <Route path="/success" component={ThankYouPage} />
      <Route path="/home" component={Home} />
      <PrivateRoute
        loggedIn={session}
        path="/"
        component={DashboardContainer}
      />
      <Route component={() => <Redirect to="/home" />} />
    </Switch>
  );

  render() {
    const { session, logged } = this.props.authStore;
    if (!session && logged) {
      this.props.authStore.setLogged(false);
      this.props.enqueueSnackbar('Sesja wygasła, zaloguj się ponownie.', {
        variant: 'error'
      });
    }
    return (
      <>
        <MuiPickersUtilsProvider utils={MomentUtils} moment={moment}>
          {this.renderRoutes(session)}
        </MuiPickersUtilsProvider>
      </>
    );
  }
}

export default withSnackbar(AppRouter);
