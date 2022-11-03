import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { NavLink, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { AppBar, Toolbar, Typography, withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { withNamespaces } from 'react-i18next';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import OrderDetails from './OrderDetails';
import OrderList from './OrderList';
import Logo from '../assets/images/logo.svg';
import { COLORS } from '../styles/colors';
import Profile from './Profile';
import background from '../assets/images/background.jpg';
import OrderFormWrapper from './OrderForm/OrderFormWrapper';

@inject('authStore')
@observer
@withRouter
@withNamespaces()
class DashboardContainer extends Component {
  state = {
    openMenu: false
  };

  logout = () => {
    this.props.authStore.logoutAction();
  };

  handleMenu = () => {
    this.setState({ openMenu: !this.state.openMenu });
  };

  handleClose = event => {
    if (this.anchorel && this.anchorel.contains(event.target)) {
      return;
    }
    this.setState({ openMenu: false });
  };

  render() {
    const { classes, authStore, t, location } = this.props;
    return (
      <div className={classes.root} anchorel={this.anchorel}>
        <AppBar position="fixed" className={classNames(classes.appBar)}>
          <Toolbar className={classes.toolbar}>
            <div className={classes.imageContainer}>
              <img className={classes.image} src={Logo} alt="logo" />
            </div>
            {authStore.session && (
              <Typography
                variant="h6"
                color="inherit"
                noWrap
                className={classes.userLogin}
              >
                {authStore.session.fullname}
              </Typography>
            )}
            <div className={classes.menuContainer}>
              <div className={classes.webMenu}>
                <NavLink
                  className={classes.link}
                  to="/addOrder"
                  activeClassName={classes.linkActive}
                >
                  <Button
                    className={classNames(classes.linkButton, classes.newOrder)}
                  >
                    {t('MENU.NEW_ORDER')}
                  </Button>
                </NavLink>
                <NavLink
                  className={classNames(classes.link, classes.Orders)}
                  to="/orders"
                  activeClassName={classes.activeOrder}
                >
                  <Button
                    className={classNames(classes.linkButton, classes.Orders)}
                  >
                    {t('MENU.ORDERS')}
                  </Button>
                </NavLink>
                <AccountCircle
                  className={classes.iconPosition}
                  onClick={this.handleMenu}
                  data-cy="openMenu"
                />
                {this.state.openMenu && (
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <div className={classes.openMenuProfile}>
                      <ul>
                        <li>
                          <NavLink
                            className={classes.link}
                            to="/profile"
                            activeClassName={classes.linkActiveProfile}
                          >
                            <Button
                              className={classes.btnMenu}
                              onClick={this.handleMenu}
                              data-cy="openProfile"
                            >
                              {t('PROFILE.PROFILE')}
                            </Button>
                          </NavLink>
                        </li>
                        <li className={classes.menuAccent}>
                          <NavLink
                            className={classes.link}
                            to="/addOrder"
                            activeClassName={classes.linkActiveProfile}
                          >
                            <Button
                              className={classes.btnMenu}
                              onClick={this.handleMenu}
                            >
                              {t('MENU.NEW_ORDER')}
                            </Button>
                          </NavLink>
                        </li>
                        <li className={classes.menuAccent}>
                          <NavLink
                            className={classes.link}
                            to="/orders"
                            activeClassName={classes.linkActiveProfile}
                          >
                            <Button
                              className={classes.btnMenu}
                              onClick={this.handleMenu}
                            >
                              {t('MENU.ORDERS')}
                            </Button>
                          </NavLink>
                        </li>
                        <li>
                          <Button
                            className={classes.btnMenu}
                            onClick={this.logout}
                            data-cy="logoutBtn"
                          >
                            {t('MENU.LOGOUT')}
                          </Button>
                        </li>
                      </ul>
                    </div>
                  </ClickAwayListener>
                )}
              </div>
            </div>
          </Toolbar>
        </AppBar>
        <div />
        <Switch location={location}>
          <Route exact path="/orders" component={OrderList} />
          <Route path="/orders/details/:id" component={OrderDetails} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/addOrder" component={OrderFormWrapper} />
          <Redirect to="/orders" />
        </Switch>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    padding: '0 !important',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    backgroundColor: COLORS.DARK_BLUE
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
    color: COLORS.WHITE
  },
  userLogin: {
    marginRight: 10,
    color: COLORS.WHITE
  },
  hide: {
    display: 'none'
  },

  imageContainer: {
    width: '100%'
  },

  image: {
    maxWidth: 220,
    width: '100%',
    backgroundSize: 'contain',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 50
  },
  menuList: {
    backgroundColor: COLORS.DARK_BLUE,
    height: '100%'
  },
  link: {
    textDecoration: 'none',
    outline: 'none'
  },
  linkButton: {
    color: COLORS.WHITE,
    display: 'flex',
    fontWeight: 600,
    textTransform: 'none',
    height: 'fit-content'
  },
  linkActive: {
    backgroundColor: COLORS.SECONDARY_COLOR,
    borderRadius: 4,
    height: 'fit-content',
    '@media only screen and (max-width:600px)': {
      padding: '7px 35px',
      width: '100%'
    }
  },
  activeOrder: {
    backgroundColor: COLORS.SECONDARY_COLOR,
    borderRadius: 4,
    height: 'fit-content',
    marginLeft: 10,
    marginRight: 10,
    '@media only screen and (max-width:600px)': {
      padding: '7px 35px',
      width: '100%'
    }
  },
  linkActiveMenu: {
    backgroundColor: COLORS.PRIMARY_COLOR,
    borderRadius: 4,
    height: 'fit-content',
    marginLeft: 10,
    marginRight: 10,
    padding: '7px 35px'
  },
  linkActiveProfile: {
    '&>button': {
      height: 'auto',
      width: 130,
      color: COLORS.WHITE,
      backgroundColor: COLORS.PRIMARY_COLOR
    }
  },
  menuContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%'
  },
  iconMenu: {
    marginRight: '15px'
  },
  profileButton: {
    padding: '0 5px 0 5px'
  },
  logoutButton: {
    marginRight: 10
  },
  mobileMenu: {
    display: 'none',
    color: COLORS.WHITE,
    '@media only screen and (max-width:600px)': {
      display: 'block'
    }
  },
  webMenu: {
    display: 'flex'
  },
  menuAccent: {
    display: 'none',
    '@media only screen and (max-width:600px)': {
      display: 'block'
    }
  },
  newOrder: {
    backgroundColor: COLORS.PRIMARY_COLOR,
    borderRadius: 4,
    '&:hover': {
      backgroundColor: COLORS.PRIMARY_COLOR
    },
    '@media only screen and (max-width:600px)': {
      display: 'none'
    }
  },
  activeTab: {
    backgroundColor: COLORS.PRIMARY_COLOR
  },
  Orders: {
    marginLeft: 10,
    marginRight: 10,
    '@media only screen and (max-width:600px)': {
      display: 'none'
    }
  },
  openMenuProfile: {
    top: 112,
    position: 'absolute',
    right: 0,
    textAlign: 'center',
    backgroundColor: COLORS.WHITE,
    color: COLORS.BLACK,
    boxShadow:
      '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
    '&>ul': {
      listStyleType: 'none',
      padding: 10,
      '&>li': {
        marginBottom: 5
      }
    }
  },
  btnMenu: {
    width: 130,
    '&:hover': {
      color: COLORS.WHITE,
      backgroundColor: COLORS.PRIMARY_COLOR
    },
    '@media only screen and (max-width:600px)': {
      width: 140
    }
  },
  iconPosition: {
    marginTop: 5,
    marginRight: 10,
    cursor: 'pointer'
  }
});

export default withStyles(styles)(DashboardContainer);
