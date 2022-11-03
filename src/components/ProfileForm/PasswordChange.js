import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { Button } from '@material-ui/core';
import React, { Component } from 'react';
import * as Yup from 'yup';
import { withNamespaces } from 'react-i18next';
import { withSnackbar } from 'notistack';
import { inject, observer } from 'mobx-react';
import { PasswordValidator } from '../../utils/validators';

const PasswordForm = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: ''
};

const PasswordSchema = Yup.object().shape({
  oldPassword: PasswordValidator,
  newPassword: PasswordValidator,
  confirmNewPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('newPassword')], 'Hasła muszą być takie same')
});

@withNamespaces()
@withSnackbar
@inject('userStore')
@observer
export default class PasswordChange extends Component {
  changePassword = async values => {
    const { t } = this.props;
    const newValues = {
      password: values.oldPassword,
      newPassword: values.newPassword,
      confirmNewPassword: values.confirmNewPassword
    };
    const success = await this.props.userStore.changePasswordAction(newValues);
    if (!success) {
      this.props.enqueueSnackbar(t('PROFILE.GLOBAL_ERROR'), {
        variant: 'error'
      });
    } else {
      this.props.enqueueSnackbar(t('PROFILE.PASSWORD_UPDATED'), {
        variant: 'success'
      });
      (values.oldPassword = ''),
        (values.newPassword = ''),
        (values.confirmNewPassword = '');
    }
  };

  render() {
    const { classes, t } = this.props;
    return (
      <Formik
        initialValues={PasswordForm}
        validationSchema={PasswordSchema}
        onSubmit={(values, { setSubmitting }) => {
          this.changePassword(values).then(() => {
            setSubmitting(false);
          });
        }}
        onReset={values => {}}
      >
        {props => {
          const { handleSubmit, isSubmitting, isValid } = props;
          return (
            <div className={classes.containerPassword}>
              <Card className={classes.passwordCard}>
                <CardHeader
                  title={t('PROFILE.CHANGE_PASSWORD')}
                  className={classes.profileHeader}
                />
                <CardContent>
                  <Form
                    className={classes.formPassword}
                    onSubmit={handleSubmit}
                  >
                    <Field
                      id="oldPassword"
                      name="oldPassword"
                      variant="outlined"
                      label={t('PROFILE.OLD_PASSWORD')}
                      required
                      type="password"
                      component={TextField}
                      className={classes.textFieldPassword}
                      margin="normal"
                      autoComplete="off"
                    />
                    <Field
                      id="newPassword"
                      name="newPassword"
                      variant="outlined"
                      label={t('PROFILE.NEW_PASSWORD')}
                      required
                      type="password"
                      component={TextField}
                      className={classes.textFieldPassword}
                      margin="normal"
                      autoComplete="off"
                    />
                    <Field
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      variant="outlined"
                      label={t('PROFILE.CONFIRM_PASSWORD')}
                      required
                      type="password"
                      component={TextField}
                      className={classes.textFieldPassword}
                      margin="normal"
                      autoComplete="off"
                    />
                    <CardActions>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        type="submit"
                        data-cy="changePasswordBtn"
                        disabled={
                          isSubmitting ||
                          !isValid ||
                          props.values.newPassword !==
                            props.values.confirmNewPassword
                        }
                      >
                        {t('PROFILE.CHANGE_PASSWORD')}
                      </Button>
                    </CardActions>
                  </Form>
                </CardContent>
              </Card>
            </div>
          );
        }}
      </Formik>
    );
  }
}
