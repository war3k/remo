import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import { withSnackbar } from 'notistack';
import { COLORS } from '../styles/colors';
import ProfileDetail from './ProfileForm/ProfileDetail';
import CompanyDetail from './ProfileForm/CompanyDetail';
import PasswordChange from './ProfileForm/PasswordChange';

@withNamespaces()
@withSnackbar
@inject('userStore')
@observer
class Profile extends Component {
  componentDidMount() {
    this.getCustomer();
  }

  getCustomer = async () => {
    const success = await this.props.userStore.getCustomerAction();
    if (!success) {
      return this.props.history.replace('/orders');
    }
  };

  render() {
    const {
      classes,
      userStore: { customer, customerCompanies }
    } = this.props;
    return (
      <div className={classes.mainContainer}>
        <div className={classes.firstColumnContainer}>
          {customer && customer.name && (
            <>
              <ProfileDetail classes={classes} />
              <PasswordChange classes={classes} />
            </>
          )}
        </div>
        <div className={classes.secondColumnContainer}>
          {customerCompanies && <CompanyDetail classes={classes} />}
        </div>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: 90
  },

  mainContainer: {
    display: 'flex',
    margin: '0 auto',
    width: '100%',
    maxWidth: 1400,
    justifyContent: 'center',
    marginTop: 100,
    '@media only screen and (max-width:992px)': {
      display: 'block',
      padding: 0,
      marginTop: 150
    }
  },
  firstColumnContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '50%',
    padding: '0 30px',
    '@media only screen and (max-width:992px)': {
      display: 'block',
      width: 'auto'
    }
  },
  secondColumnContainer: {
    width: '50%',
    marginLeft: 50,
    padding: '0 30px',
    '@media only screen and (max-width:992px)': {
      display: 'block',
      width: 'auto',
      padding: '0 30px 30px 30px',
      marginLeft: 0
    }
  },
  container: {
    width: '100%',
    maxWidth: 1400,
    margin: '50px 0 -20px 0',
    '@media only screen and (max-width:992px)': {
      margin: 0
    }
  },
  containerSecond: {
    width: '100%',
    maxWidth: 1400,
    margin: '50px 0 -20px 0',
    marginBottom: 50,
    '@media only screen and (max-width:992px)': {
      margin: 0
    }
  },
  containerPassword: {
    width: '100%',
    maxWidth: 1400,
    margin: '36px auto',
    textAlign: 'center'
  },
  containerCompany: {
    width: '100%',
    maxWidth: 1400,
    margin: '130px 0 -20px 0',
    textAlign: 'center'
  },
  textField: {
    width: '100%'
  },
  textFieldPassword: {
    width: '100%'
  },
  addButton: {
    boxShadow: 'none',
    position: 'fixed',
    right: '20%',
    bottom: '15%',
    color: COLORS.WHITE
  },
  profileTitle: {
    display: 'flex',
    justifyContent: 'center'
  },
  subTitleOrder: {
    margin: '25px 0 0 0px',
    textAlign: 'center'
  },
  formContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },
  formContainerCompany: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },
  formProfile: {
    display: 'flex',
    marginTop: 10,
    justifyContent: 'space-between',
    flexDirection: 'column',
    margin: '0 10px'
  },
  editButton: {
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 40
  },
  changePasswordTitle: {
    textAlign: 'center'
  },
  changePasswordContainer: {
    display: 'flex',
    marginTop: 10,
    justifyContent: 'space-between',
    flexDirection: 'column'
  },
  formPassword: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    margin: '0 10px'
  },
  passwordTitle: {
    textAlign: 'center'
  },
  profileCard: {
    maxWidth: 600,
    width: '100%',
    margin: '0 auto'
  },
  passwordCard: {
    maxWidth: 600,
    width: '100%',
    margin: '50px auto'
  },
  profileHeader: {
    textAlign: 'center',
    color: COLORS.WHITE,
    backgroundColor: COLORS.DARK_BLUE
  },
  marginRadio: {
    margin: 0
  },
  selectCompany: {
    width: '100%',
    marginTop: 18,
    marginBottom: 8
  },
  cancelBtn: {
    marginLeft: 30,
    color: COLORS.WHITE
  }
});

export default withStyles(styles)(Profile);
