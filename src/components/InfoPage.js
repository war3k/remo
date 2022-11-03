import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { Typography, withStyles, Button } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import { withNamespaces } from 'react-i18next';
import { COLORS } from '../styles/colors';
import Logo from '../assets/images/logoHome.svg';
import background from '../assets/images/background.jpg';

@withNamespaces()
@inject('authStore', 'userStore')
@withSnackbar
@observer
class InfoPage extends Component {
  render() {
    const { t, classes } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.logoContainer}>
          <img className={classes.logo} src={Logo} alt="Logo" />
        </div>
        <div className={classes.contentContainer}>
          <Typography className={classes.infoHeader} variant="h4">
            {t('INFO_PAGE.EXPIRED_TOKEN')}
          </Typography>

          <NavLink className={classes.link} to="/home">
            <Button
              className={classNames(classes.orderButton, classes.button)}
              color="primary"
              variant="contained"
            >
              {t('INFO_PAGE.BACK_TO_HOME')}
            </Button>
          </NavLink>
        </div>
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
  infoHeader: {
    color: COLORS.GRAY,
    maxWidth: 480,
    margin: 25,
    '@media (max-width:600px)': {
      fontSize: 25
    }
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

export default withStyles(styles)(InfoPage);
