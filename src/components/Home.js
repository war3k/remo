import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { Button, Card, Typography, withStyles } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import { withNamespaces } from 'react-i18next';
import { COLORS } from '../styles/colors';
import Logo from '../assets/images/logoHome.svg';
import background from '../assets/images/background.jpg';
import Redirect from './Login';

@withNamespaces()
@inject('authStore', 'userStore')
@withSnackbar
@observer
class Home extends Component {
  state = {
    redirectToReferrer: false
  };

  componentDidMount() {
    if (
      this.props.authStore.session &&
      this.props.authStore.session.xsrfToken
    ) {
      this.setState({ redirectToReferrer: true });
    }
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { redirectToReferrer } = this.state;
    if (redirectToReferrer)
      return <Redirect to={from.pathname === '/home' ? '/' : from} />;
    const { t, classes } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.logoContainer}>
          <img className={classes.logo} src={Logo} alt="Logo" />
        </div>
        <div className={classes.contentContainer}>
          <Typography className={classes.homeHeader} variant="h2">
            {t('HOME.HEADER')}
          </Typography>
          <p className={classes.subHeader}>{t('HOME.DESCRIPTION')}</p>

          <NavLink
            className={classes.link}
            to="/newOrder"
            activeClassName={classes.linkActive}
          >
            <Button
              className={classNames(classes.orderButton, classes.button)}
              color="primary"
              variant="contained"
            >
              {t('LOGIN.ORDER')}
            </Button>
          </NavLink>
          <NavLink
            className={classes.link}
            to="/login"
            activeClassName={classes.linkActive}
          >
            <Button
              variant="contained"
              className={classNames(classes.button, classes.loginButton)}
            >
              {t('LOGIN.LOGIN_BUTTON')}
            </Button>
          </NavLink>
        </div>

        <Card className={classes.bdoCard}>
          <div className={classNames(classes.bdoHeader, classes.boldText)}>
            {t('HOME.ATTENTION')}
          </div>
          <div className={classes.bdoHeader}>{t('HOME.BDO_INFO')}</div>
          <div className={classes.bdoHeader}>
            {t('HOME.BDO_GENERATE')}&nbsp;
            <a
              className={classes.bdoLink}
              href="https://rejestr-bdo.mos.gov.pl/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://rejestr-bdo.mos.gov.pl/
            </a>
          </div>
        </Card>
      </div>
    );
  }
}

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100%',
    background: `${COLORS.BACKGROUND_GREY} url(${background}) no-repeat fixed center right`,
    backgroundSize: 'cover'
  },
  logoContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 300,
    height: 'auto',
    '@media (max-width:600px)': {
      left: 'auto'
    }
  },
  logo: {
    maxWidth: 220,
    height: 'auto',
    marginTop: 20,
    marginLeft: 50,
    marginBottom: 20,
    backgroundSize: 'contain'
  },
  homeHeader: {
    color: COLORS.GRAY,
    '@media only screen and (max-width:600px)': {
      fontSize: 28
    },
    '@media only screen and (min-width: 600px)': {
      fontSize: '48px'
    },
    '@media only screen and (min-width:1200px)': {
      fontSize: '3.75rem'
    }
  },
  subHeader: {
    maxWidth: 600,
    textAlign: 'justify',
    margin: '20px auto',
    '@media only screen and (max-width: 1200px)': {
      maxWidth: 500
    },
    '@media (max-width:600px)': {
      fontSize: 14,
      maxWidth: 300
    }
  },
  bdoCard: {
    marginTop: 30,
    padding: '0 10px',
    color: COLORS.WHITE,
    background: COLORS.PRIMARY_COLOR
  },
  bdoHeader: {
    maxWidth: 600,
    textAlign: 'justify',
    margin: '10px auto',
    '@media only screen and (max-width: 1200px)': {
      maxWidth: 500
    },
    '@media (max-width:600px)': {
      fontSize: 14,
      maxWidth: 300
    }
  },
  bdoLink: {
    color: COLORS.WHITE,
    textDecoration: 'none'
  },
  boldText: {
    fontWeight: 'bold'
  },
  orderButton: {
    width: '150px'
  },
  loginButton: {
    marginTop: 20,
    width: '150px'
  },
  link: {
    textDecoration: 'none',
    margin: '0 auto'
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center'
  }
});

export default withStyles(styles)(Home);
