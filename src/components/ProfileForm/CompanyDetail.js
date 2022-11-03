import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import classNames from 'classnames';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput
} from '@material-ui/core';
import React, { Component } from 'react';
import * as Yup from 'yup';
import { withNamespaces } from 'react-i18next';
import { withSnackbar } from 'notistack';
import { inject, observer } from 'mobx-react';
import {
  EmailValidator,
  NumberValidator,
  PhoneValidator,
  StringValidator
} from '../../utils/validators';

const companySchema = Yup.object().shape({
  companyName: StringValidator,
  companyAdress: StringValidator,
  companyPostalCode: StringValidator,
  companyCity: StringValidator,
  companyCountry: StringValidator,
  companyNip: NumberValidator,
  companyKrs: NumberValidator,
  companyBdo: NumberValidator,
  companyRegon: NumberValidator,
  companyEmail: EmailValidator,
  companyPhone: PhoneValidator
});

@withNamespaces()
@withSnackbar
@inject('userStore')
@observer
export default class CompanyDetail extends Component {
  state = {
    editCompany: false,
    labelWidth: 95,
    companyName: '',
    company: {
      companyAdress: '',
      companyPostalCode: '',
      companyCity: '',
      companyCountry: '',
      companyNip: '',
      companyKrs: '',
      companyBdo: '',
      companyRegon: '',
      companyEmail: '',
      companyPhone: ''
    }
  };

  setCompany = customerCompanies => {
    this.setState({
      companyName: customerCompanies.name,
      company: {
        companyAdress: customerCompanies.address.street,
        companyPostalCode: customerCompanies.address.postalCode,
        companyCity: customerCompanies.address.city,
        companyCountry: customerCompanies.address.country,
        companyNip: customerCompanies.nip,
        companyKrs: customerCompanies.krs,
        companyBdo: customerCompanies.bdo,
        companyRegon: customerCompanies.regon,
        companyEmail: customerCompanies.email,
        companyPhone: customerCompanies.phone
      }
    });
  };

  render() {
    const {
      userStore: { customerCompanies },
      classes,
      t
    } = this.props;
    const { editCompany } = this.state;

    return (
      <Formik
        enableReinitialize
        initialValues={{
          companyName:
            this.state.companyName ||
            customerCompanies[0].data.customerCompany.name ||
            '',
          companyAdress:
            this.state.company.companyAdress ||
            customerCompanies[0].data.customerCompany.address.street ||
            '',
          companyPostalCode:
            this.state.company.companyPostalCode ||
            customerCompanies[0].data.customerCompany.address.postalCode ||
            '',
          companyCity:
            this.state.company.companyCity ||
            customerCompanies[0].data.customerCompany.address.city ||
            '',
          companyCountry:
            this.state.company.companyCountry ||
            customerCompanies[0].data.customerCompany.address.country ||
            '',
          companyNip:
            this.state.company.companyNip ||
            customerCompanies[0].data.customerCompany.nip ||
            '',
          companyKrs:
            this.state.company.companyKrs ||
            customerCompanies[0].data.customerCompany.krs ||
            '',
          companyBdo:
            this.state.company.companyBdo ||
            customerCompanies[0].data.customerCompany.bdo ||
            '',
          companyRegon:
            this.state.company.companyRegon ||
            customerCompanies[0].data.customerCompany.regon ||
            '',
          companyEmail:
            this.state.company.companyEmail ||
            customerCompanies[0].data.customerCompany.email ||
            '',
          companyPhone:
            this.state.company.companyPhone ||
            customerCompanies[0].data.customerCompany.phone ||
            ''
        }}
        validationSchema={companySchema}
        onSubmit={(values, { setSubmitting }) => {
          this.login(values).then(() => {
            setSubmitting(false);
          });
        }}
      >
        {props => {
          const { handleSubmit, isSubmitting, isValid } = props;
          return (
            <div className={classes.containerSecond}>
              <Card className={classes.profileCard}>
                <CardHeader
                  title={t('PROFILE.COMPANY_DETAILS')}
                  className={classes.profileHeader}
                />
                <CardContent>
                  <Form
                    className={classes.formContainerCompany}
                    onSubmit={handleSubmit}
                    data-cy="companyContainer"
                  >
                    <div>
                      {customerCompanies && customerCompanies.length > 1 && (
                        <FormControl
                          variant="outlined"
                          className={classNames(
                            classes.formControl,
                            classes.selectCompany
                          )}
                          data-cy="selectCompany"
                        >
                          <InputLabel>{t('PROFILE.COMPANY_NAME')}</InputLabel>

                          <Select
                            value={
                              this.state.companyName ||
                              customerCompanies[0].data.customerCompany.name
                            }
                            onChange={event =>
                              this.setCompany(event.target.value)
                            }
                            data-cy="selectCompany"
                            name="companyName"
                            renderValue={value => `${value}`}
                            input={
                              <OutlinedInput
                                labelWidth={this.state.labelWidth}
                                name="companyName"
                              />
                            }
                          >
                            {customerCompanies.map((item, index) => (
                              <MenuItem
                                key={item.data.customerCompany.uuid}
                                data-cy={index}
                                value={item.data.customerCompany}
                              >
                                {item.data.customerCompany.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </div>
                    <Field
                      id="companyName"
                      name="companyName"
                      variant="outlined"
                      label={t('PROFILE.COMPANY_NAME')}
                      disabled={!editCompany}
                      component={TextField}
                      className={classes.textFieldPassword}
                      margin="normal"
                      autoComplete="off"
                    />
                    <Field
                      id="companyAdress"
                      name="companyAdress"
                      variant="outlined"
                      label={t('PROFILE.ADRESS')}
                      disabled={!editCompany}
                      component={TextField}
                      className={classes.textFieldPassword}
                      margin="normal"
                      autoComplete="off"
                    />
                    <Field
                      id="companyPostalCode"
                      name="companyPostalCode"
                      variant="outlined"
                      label={t('PROFILE.POSTAL_CODE')}
                      disabled={!editCompany}
                      component={TextField}
                      className={classes.textFieldPassword}
                      margin="normal"
                      autoComplete="off"
                    />
                    <Field
                      id="companyCity"
                      name="companyCity"
                      variant="outlined"
                      label={t('PROFILE.CITY')}
                      disabled={!editCompany}
                      component={TextField}
                      className={classes.textFieldPassword}
                      margin="normal"
                      autoComplete="off"
                    />
                    <Field
                      id="companyCountry"
                      name="companyCountry"
                      variant="outlined"
                      label={t('PROFILE.COUNTRY')}
                      disabled={!editCompany}
                      component={TextField}
                      className={classes.textFieldPassword}
                      margin="normal"
                      autoComplete="off"
                    />
                    <Field
                      id="companyNip"
                      name="companyNip"
                      variant="outlined"
                      label={t('PROFILE.NIP')}
                      disabled={!editCompany}
                      component={TextField}
                      className={classes.textFieldPassword}
                      margin="normal"
                      autoComplete="off"
                    />
                    <Field
                      id="companyKrs"
                      name="companyKrs"
                      variant="outlined"
                      label={t('PROFILE.KRS')}
                      disabled={!editCompany}
                      component={TextField}
                      className={classes.textFieldPassword}
                      margin="normal"
                      autoComplete="off"
                    />
                    <Field
                      id="companyBdo"
                      name="companyBdo"
                      variant="outlined"
                      label={t('PROFILE.BDO')}
                      disabled={!editCompany}
                      component={TextField}
                      className={classes.textFieldPassword}
                      margin="normal"
                      autoComplete="off"
                    />
                    <Field
                      id="companyRegon"
                      name="companyRegon"
                      variant="outlined"
                      label={t('PROFILE.REGON')}
                      disabled={!editCompany}
                      component={TextField}
                      className={classes.textFieldPassword}
                      margin="normal"
                      autoComplete="off"
                    />
                    <Field
                      id="companyEmail"
                      name="companyEmail"
                      variant="outlined"
                      label={t('PROFILE.EMAIL')}
                      disabled={!editCompany}
                      component={TextField}
                      className={classes.textFieldPassword}
                      margin="normal"
                      autoComplete="off"
                    />
                    <Field
                      id="companyPhone"
                      name="companyPhone"
                      variant="outlined"
                      label={t('PROFILE.PHONE')}
                      disabled={!editCompany}
                      component={TextField}
                      className={classes.textFieldPassword}
                      margin="normal"
                      autoComplete="off"
                    />
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
