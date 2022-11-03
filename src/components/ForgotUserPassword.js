import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import {
  Card,
  CardContent,
  Typography,
  withStyles,
  Button
} from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import { withSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { withNamespaces } from 'react-i18next';
import { COLORS } from '../styles/colors';
import Logo from '../assets/images/logoHome.svg';
import { EmailValidator } from '../utils/validators';
import background from '../assets/images/background.jpg';

const ForgotPasswordForm = {
  email: ''
};

const ForgotPasswordSchema = Yup.object().shape({
  email: EmailValidator
});

@inject('authStore', 'userStore')
@withSnackbar
@observer
@withNamespaces()
class ForgotUserPassword extends Component {
  submit = async values => {
    const { t } = this.props;
    const success = await this.props.userStore.forgotPasswordAction({
      email: values.email
    });
    if (!success) {
      this.props.enqueueSnackbar(t('FORGOT_PASSWORD.WRONG_EMAIL')),
        {
          variant: 'error'
        };
    } else {
      this.props.history.push('/login');
      this.props.enqueueSnackbar(t('FORGOT_PASSWORD.SEND_MAIL'));
    }
  };

  render() {
    const {
      t,
      classes,
      authStore: { pending }
    } = this.props;

    return (
      <Formik
        initialValues={ForgotPasswordForm}
        validationSchema={ForgotPasswordSchema}
        onSubmit={(values, { setSubmitting }) => {
          this.submit(values).then(() => {
            setSubmitting(false);
          });
        }}
      >
        {props => {
          const { isSubmitting, isValid, handleSubmit } = props;
          return (
            <div className={classes.container}>
              <div className={classes.logoContainer}>
                <img className={classes.logo} src={Logo} alt="Logo" />
              </div>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <div className={classes.cardContainer}>
                    <img
                      className={classes.media}
                      title="Remondis-logo"
                      src={Logo}
                      alt="Remondis-logo"
                    />
                    <Typography className={classes.forgotTitle} component="h1">
                      {t('FORGOT_PASSWORD.RESET_PASSWORD')}
                    </Typography>
                  </div>
                  <p className={classes.forgotPasswordText}>
                    {t('FORGOT_PASSWORD.SEND_EMAIL_MESSAGE')}
                  </p>
                  <div className={classes.form}>
                    <Form onSubmit={handleSubmit}>
                      <Field
                        id="email"
                        name="email"
                        label="Email"
                        component={TextField}
                        required
                        className={classes.textField}
                        margin="normal"
                        autoComplete="off"
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting || !isValid}
                        className={classes.buttonForgot}
                        type="submit"
                      >
                        {pending ? (
                          <CircularProgress
                            size={20}
                            thickness={5}
                            color="secondary"
                          />
                        ) : (
                          <div>{t('FORGOT_PASSWORD.SEND')}</div>
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
    padding: 25,
    paddingTop: 60
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
  forgotTitle: {
    fontSize: 22,
    marginTop: 30
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '95%',
    marginTop: 12
  },
  buttonForgot: {
    display: 'flex',
    margin: '20px auto',
    fontWeight: 600,
    fontSize: 14,
    backgroundColor: COLORS.PRIMARY_COLOR,
    color: COLORS.WHITE,
    width: '70%',
    height: 36
  },
  forgotPasswordText: {
    textAlign: 'center',
    padding: '0 30px'
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

export default withStyles(styles)(ForgotUserPassword);
