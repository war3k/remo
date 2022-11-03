import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import {
  Card,
  CardContent,
  Typography,
  withStyles,
  Button
} from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import Redirect from 'react-router-dom/es/Redirect';
import { withSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { withNamespaces } from 'react-i18next';
import { COLORS } from '../styles/colors';
import Logo from '../assets/images/logoHome.svg';
import background from '../assets/images/background.jpg';
import { EmailValidator, StringValidator } from '../utils/validators';

const LoginForm = {
  email: '',
  password: ''
};

const LoginSchema = Yup.object().shape({
  email: EmailValidator,
  password: StringValidator
});

@withNamespaces()
@inject('authStore', 'userStore')
@withSnackbar
@observer
class Login extends Component {
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

  login = async values => {
    const { t } = this.props;
    const result = await this.props.authStore.loginAction(values);
    if (result && result.error && !result.accessDenied) {
      this.props.enqueueSnackbar(t('LOGIN.LOGIN_FAILED'), {
        variant: 'error'
      });
    } else {
      this.setState({ redirectToReferrer: true });
    }
  };

  render() {
    const isIE = window.navigator.userAgent.indexOf('Trident') !== -1;
    const { from } = (this.props.location && this.props.location.state) || {
      from: { pathname: '/' }
    };
    const { redirectToReferrer } = this.state;
    if (redirectToReferrer) return <Redirect to={from} />;
    const {
      t,
      classes,
      authStore: { pending }
    } = this.props;
    return (
      <Formik
        initialValues={LoginForm}
        validationSchema={LoginSchema}
        onSubmit={(values, { setSubmitting }) => {
          this.login(values).then(() => {
            setSubmitting(false);
          });
        }}
      >
        {props => {
          const { handleSubmit, isSubmitting, isValid } = props;
          return (
            <div className={classes.container}>
              <div className={classes.logoContainer}>
                <img className={classes.logo} src={Logo} alt="Logo" />
              </div>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <div
                    className={
                      isIE ? classes.cardContainerIE : classes.cardContainer
                    }
                  >
                    <img
                      className={classes.media}
                      title="Remondis-logo"
                      src={Logo}
                      alt="Remondis-logo"
                    />
                    <Typography className={classes.title} component="h1">
                      {t('LOGIN.LOGIN_MESSAGE')}
                    </Typography>
                  </div>
                  <div className={classes.form}>
                    <Form onSubmit={handleSubmit}>
                      <Field
                        id="email"
                        name="email"
                        label={t('LOGIN.EMAIL')}
                        required
                        component={TextField}
                        className={classes.textField}
                        margin="normal"
                        autoComplete="off"
                      />
                      <Field
                        id="password"
                        name="password"
                        label={t('LOGIN.PASSWORD')}
                        component={TextField}
                        required
                        className={classes.textFieldPassword}
                        margin="normal"
                        autoComplete="off"
                        type="password"
                      />
                      <div className={classes.forgotContainer}>
                        <Link
                          to="/forgot-password"
                          className={classes.forgotPassword}
                        >
                          {t('LOGIN.FORGOT_PASSWORD')}
                        </Link>
                      </div>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting || !isValid}
                        className={classes.button}
                        type="submit"
                        data-cy="loginBtn"
                      >
                        {pending ? (
                          <CircularProgress
                            size={20}
                            thickness={5}
                            color="secondary"
                          />
                        ) : (
                          <div>{t('LOGIN.LOGIN_BUTTON')}</div>
                        )}
                      </Button>
                    </Form>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        }}
      </Formik>
    );
  }
}

const styles = theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100%',
    background: `${COLORS.BACKGROUND_GREY} url(${background}) no-repeat fixed center right`,
    backgroundSize: 'cover'
  },
  card: {
    maxWidth: 400,
    height: 480,
    padding: 0
  },
  cardContent: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    padding: 0
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  cardContainerIE: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0
  },
  form: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 45px'
  },
  media: {
    maxWidth: 210,
    height: 'auto',
    backgroundSize: 'contain'
  },
  title: {
    fontSize: 22,
    marginTop: 30,
    marginBottom: 30
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '95%',
    marginTop: 12
  },
  textFieldPassword: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '95%',
    marginTop: 4
  },
  button: {
    display: 'flex',
    margin: '20px auto',
    fontWeight: 600,
    fontSize: 14,
    backgroundColor: COLORS.PRIMARY_COLOR,
    color: COLORS.WHITE,
    width: '50%',
    height: 36
  },
  forgotPassword: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 16,
    cursor: 'pointer',
    color: COLORS.PRIMARY_COLOR,
    marginRight: theme.spacing.unit,
    marginTop: 10,
    textAlign: 'right'
  },
  forgotContainer: {
    display: 'flex',
    justifyContent: 'flex-end'
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
  }
});

export default withStyles(styles)(Login);
