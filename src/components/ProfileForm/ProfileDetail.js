import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import classNames from 'classnames';
import { Button } from '@material-ui/core';
import React, { Component } from 'react';
import * as Yup from 'yup';
import { withNamespaces } from 'react-i18next';
import { withSnackbar } from 'notistack';
import { inject, observer } from 'mobx-react';
import { PhoneValidator, StringValidator } from '../../utils/validators';

const ProfileSchema = Yup.object().shape({
  name: StringValidator,
  surname: StringValidator,
  phone: StringValidator
});

@withNamespaces()
@withSnackbar
@inject('userStore')
@observer
export default class ProfileDetail extends Component {
  state = {
    edit: false
  };

  enableEdit = (resetForm, values) => () => {
    resetForm(values);
    this.setState({ edit: true });
  };

  disableEdit = (setFieldValue, values) => () => {
    Object.keys(values).forEach(item =>
      setFieldValue(item, this.props.userStore.customer[item])
    );
    this.setState({ edit: false });
  };

  editCustomer = async values => {
    const { t } = this.props;
    const newValues = {
      name: values.name,
      surname: values.surname,
      phone: values.phone
    };

    const success = await this.props.userStore.editCustomerAction(newValues);
    if (!success) {
      this.props.enqueueSnackbar(t('PROFILE.PROFILE_UPDATED_ERROR'), {
        variant: 'error'
      });
    } else {
      this.props.enqueueSnackbar(t('PROFILE.PROFILE_UPDATED'), {
        variant: 'success'
      });
      this.setState({ edit: false });
    }
  };

  render() {
    const {
      userStore: { customer },
      classes,
      t
    } = this.props;
    const { edit } = this.state;
    return (
      <Formik
        initialValues={{
          name: customer.name,
          surname: customer.surname,
          email: customer.email,
          phone: customer.phone
        }}
        enableReinitialize
        validationSchema={ProfileSchema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          this.editCustomer(values).then(() => {
            setSubmitting(false);
          });
        }}
        onReset={values => {}}
      >
        {props => {
          const { handleSubmit, isSubmitting, isValid, setFieldValue } = props;
          return (
            <div className={classes.container}>
              <Card className={classes.profileCard}>
                <CardHeader
                  title={t('PROFILE.PROFILE')}
                  className={classes.profileHeader}
                />
                <CardContent>
                  <Form
                    onSubmit={handleSubmit}
                    className={classes.formContainer}
                  >
                    <Field
                      id="name"
                      type="text"
                      name="name"
                      variant="outlined"
                      disabled={!edit}
                      label={t('PROFILE.NAME')}
                      required
                      component={TextField}
                      className={classes.textField}
                      margin="normal"
                      autoComplete="off"
                    />
                    <Field
                      id="surname"
                      name="surname"
                      variant="outlined"
                      disabled={!edit}
                      label={t('PROFILE.SURNAME')}
                      required
                      component={TextField}
                      className={classes.textField}
                      margin="normal"
                      autoComplete="off"
                    />
                    <Field
                      id="email"
                      name="email"
                      variant="outlined"
                      disabled
                      label={t('PROFILE.EMAIL')}
                      required
                      component={TextField}
                      className={classes.textField}
                      margin="normal"
                      autoComplete="off"
                    />
                    <Field
                      id="phone"
                      name="phone"
                      variant="outlined"
                      disabled={!edit}
                      label={t('PROFILE.PHONE')}
                      required
                      component={TextField}
                      className={classes.textField}
                      margin="normal"
                      autoComplete="off"
                    />
                    <CardActions>
                      {!edit ? (
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          onClick={this.enableEdit(
                            props.resetForm,
                            props.values
                          )}
                          type="button"
                          data-cy="editBtn"
                        >
                          {t('PROFILE.EDIT')}
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            disabled={isSubmitting || !isValid || !edit}
                            type="submit"
                            data-cy="saveBtn"
                          >
                            {t('PROFILE.SAVE')}
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            className={classNames(
                              classes.button,
                              classes.cancelBtn
                            )}
                            onClick={this.disableEdit(
                              props.setFieldValue,
                              props.values
                            )}
                            data-cy="cancelBtn"
                          >
                            {t('PROFILE.CANCEL')}
                          </Button>
                        </>
                      )}
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
