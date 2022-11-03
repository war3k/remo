import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import {
  Button,
  Card,
  Divider,
  Typography,
  withStyles
} from '@material-ui/core';
import { withSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { withNamespaces } from 'react-i18next';
import { Redirect, withRouter } from 'react-router-dom';
import Checkbox from '@material-ui/core/Checkbox';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { TextField } from 'formik-material-ui';
import { COLORS } from '../../styles/colors';
import {
  AvailableHoursFromValidator,
  AvailableHoursToValidator,
  BdoValidator,
  CompanyCityValidator,
  CompanyCountryValidator,
  CompanyEmailValidator,
  CompanyNameValidator,
  CompanyPostalCodeValidator,
  CompanyStreetValidator,
  KrsValidator,
  NipValidator,
  PackageNameValidator,
  PackageUnitValidator,
  PackageUuidValidator,
  PackageValueDecimalValidator,
  PackageValueIntValidator,
  phoneValid,
  PickUpPlaceCityValidator,
  PickUpPlaceCountryValidator,
  PickUpPlaceStreetValidator,
  RecycleUnitValidator,
  RecycleUuidValidator,
  RecycleValueValidator,
  RegonValidator,
  reporter
} from '../../utils/validators';
import OrderFormCompanySection from './OrderFormCompanySection';
import OrderFormReporterSection from './OrderFormReporterSection';
import OrderFormPickUpPlaceSection from './OrderFormPickUpPlaceSection';
import OrderFormItemsSection from './OrderFormItemsSection';
import OrderFormFooterSection from './OrderFormFooterSection';
import FormErrorsModal from './FormErrorsModal';

const OrderForm = {
  orderType: 'receiving',
  selectedCompany: '',
  selectedBranch: '',
  customerCompanyName: '',
  companyEmail: '',
  companyPhone: '',
  nip: '',
  krs: '',
  bdo: '',
  bdoFree: false,
  bdoPeopleCollection: false,
  tmpBdo: '',
  bdoIsRequired: true,
  regon: '',
  customerCompanyAddress: {
    city: '',
    street: '',
    postalCode: '',
    country: 'Polska'
  },
  customerCompanyBranch: {
    name: '',
    sameAsCompany: true,
    city: '',
    street: '',
    postalCode: '',
    country: 'Polska',
    mainBranch: false,
    contact: '',
    email: '',
    phone: ''
  },
  availableHoursFrom: '',
  availableHoursTo: '',
  reporterName: '',
  reporterSurname: '',
  reporterEmail: '',
  reporterPhone: '',
  orderData: [
    {
      recyclingItem: {
        uuid: '',
        name: '',
        copyName: '',
        code: '',
        description: '',
        unit: '',
        value: '',
        weightPerPiece: 0,
        weightPerCubicMeter: 0
      },
      packageTypes: [
        {
          uuid: '',
          name: '',
          value: '',
          unit: ''
        }
      ]
    }
  ],
  files: [],
  comment: ''
};

@withNamespaces()
@inject('authStore', 'userStore', 'ordersStore')
@withSnackbar
@withRouter
@observer
class OrderFormWrapper extends Component {
  state = {
    redirectToReferrer: false,
    showErrors: false,
    rodoChecked: false,
    expanded: 'recyclingItem0',
    contact: this.props.authStore.session
  };

  componentDidMount() {
    if (this.props.match.params.token) {
      this.getTokenStatus(this.props.match.params.token);
    }
    this.getRecyclingItems();
    this.getPackageTypes();
    if (this.isUserLogged()) {
      this.getCustomer();
    } else {
      this.props.userStore.deleteCustomer();
    }
  }

  componentWillUnmount() {
    this.props.userStore.deleteCustomer();
  }

  submitOrder = async formProps => {
    delete formProps.copyName;
    if (formProps.values.selectedBranch !== 'Inny') {
      formProps.values.customerCompanyBranch.name =
        formProps.values.selectedBranch;
    }
    if (!this.state.contact) {
      formProps.values.customerCompanyBranch.contact = `${formProps.values.reporterName} ${formProps.values.reporterSurname}`;
      formProps.values.customerCompanyBranch.phone =
        formProps.values.reporterPhone;
      formProps.values.customerCompanyBranch.email =
        formProps.values.reporterEmail;
    }
    if (formProps.isValid) {
      formProps.setSubmitting(true);
      const { files, ...apiValues } = formProps.values;
      if (this.props.match.params.token) {
        apiValues.publicToken = this.props.match.params.token;
      }

      const result = await this.props.ordersStore.addOrder(apiValues);
      if (result && !result.error) {
        if (files.length > 0) {
          await this.props.ordersStore.addFiles(files, result.order.uuid);
        }
        this.props.enqueueSnackbar(this.props.t('ORDER_FORM.ORDER_SUCCESS'), {
          variant: 'success'
        });
        this.setState({ redirectToReferrer: true });
      } else if (result && result.error) {
        this.props.enqueueSnackbar(this.props.t('ORDER_FORM.ORDER_FAILED'), {
          variant: 'error'
        });
        formProps.validateForm();
        formProps.setSubmitting(false);
      }
    } else {
      this.setState({ showErrors: true });
    }
  };

  hideModal = () => {
    this.setState({ showErrors: false });
  };

  getPackageTypes = async search => {
    await this.props.ordersStore.getPackageTypes(search);
  };

  getRecyclingItems = async search => {
    await this.props.ordersStore.getRecyclingItems(search);
  };

  getCustomer = async () => {
    await this.props.userStore.getCustomerAction();
  };

  getBranches = async id => {
    await this.props.userStore.getCustomerCompanyBranchAction(id);
  };

  getTokenStatus = async token => {
    const isTokenValid = await this.props.ordersStore.getTokenStatus(token);
    if (!isTokenValid) {
      this.props.history.push('/info/token');
    }
  };

  setCustomer = customer => {
    OrderForm.reporterName = customer ? customer.name : '';
    OrderForm.reporterEmail = customer ? customer.email : '';
    OrderForm.reporterSurname = customer ? customer.surname : '';
    OrderForm.reporterPhone = customer ? customer.phone : '';
  };

  setInitialCustomerCompany = company => {
    if (company) {
      OrderForm.customerCompanyName = company.data.customerCompany.name || '';
      OrderForm.selectedCompany = company.data.customerCompany.name || '';
      OrderForm.selectedBranch =
        (this.props.userStore.customerCompaniesBranches &&
          this.props.userStore.customerCompaniesBranches[0].name) ||
        '';
      OrderForm.companyEmail = company.data.customerCompany.email || '';
      OrderForm.companyPhone = company.data.customerCompany.phone || '';
      OrderForm.nip = company.data.customerCompany.nip || '';
      OrderForm.krs = company.data.customerCompany.krs || '';
      OrderForm.bdo = company.data.customerCompany.bdo || '';
      OrderForm.bdoFree = company.data.customerCompany.bdoFree || false;
      OrderForm.bdoPeopleCollection =
        company.data.customerCompany.bdoPeopleCollection || false;
      OrderForm.bdoIsRequired = company.data.customerCompany.bdo !== null;
      OrderForm.tmpBdo = company.data.customerCompany.bdo || '';
      OrderForm.regon = company.data.customerCompany.regon || '';
      OrderForm.customerCompanyAddress.street =
        company.data.customerCompany.address.street || '';
      OrderForm.customerCompanyAddress.postalCode =
        company.data.customerCompany.address.postalCode || '';
      OrderForm.customerCompanyAddress.city =
        company.data.customerCompany.address.city || '';
      OrderForm.customerCompanyAddress.country =
        company.data.customerCompany.address.country || 'Polska';
      OrderForm.customerCompanyBranch.street =
        (this.props.userStore.customerCompaniesBranches &&
          this.props.userStore.customerCompaniesBranches[0].street) ||
        '';
      OrderForm.customerCompanyBranch.city =
        (this.props.userStore.customerCompaniesBranches &&
          this.props.userStore.customerCompaniesBranches[0].city) ||
        '';
      OrderForm.customerCompanyBranch.postalCode =
        (this.props.userStore.customerCompaniesBranches &&
          this.props.userStore.customerCompaniesBranches[0].postalCode) ||
        '';
      OrderForm.customerCompanyBranch.country =
        (this.props.userStore.customerCompaniesBranches &&
          this.props.userStore.customerCompaniesBranches[0].country) ||
        'Polska';
      OrderForm.customerCompanyBranch.contact =
        (this.props.userStore.customerCompaniesBranches &&
          this.props.userStore.customerCompaniesBranches[0].contact) ||
        '';
      OrderForm.customerCompanyBranch.email =
        (this.props.userStore.customerCompaniesBranches &&
          this.props.userStore.customerCompaniesBranches[0].email) ||
        '';
      OrderForm.customerCompanyBranch.phone =
        (this.props.userStore.customerCompaniesBranches &&
          this.props.userStore.customerCompaniesBranches[0].phone) ||
        '';
    }
  };

  setInitialAnonymousOrder = () => {
    OrderForm.customerCompanyName = '';
    OrderForm.companyEmail = '';
    OrderForm.companyPhone = '';
    OrderForm.nip = '';
    OrderForm.krs = '';
    OrderForm.bdo = '';
    OrderForm.bdoFree = false;
    OrderForm.bdoPeopleCollection = false;
    OrderForm.tmpBdo = '';
    OrderForm.regon = '';
    OrderForm.customerCompanyAddress.street = '';
    OrderForm.customerCompanyAddress.city = '';
    OrderForm.customerCompanyAddress.postalCode = '';
    OrderForm.customerCompanyAddress.country = '';
    OrderForm.customerCompanyBranch.street = '';
    OrderForm.customerCompanyBranch.city = '';
    OrderForm.customerCompanyBranch.postalCode = '';
    OrderForm.customerCompanyBranch.country = '';
    OrderForm.customerCompanyBranch.contact = '';
    OrderForm.customerCompanyBranch.email = '';
    OrderForm.customerCompanyBranch.phone = '';
  };

  changeCustomerCompany = async (company, setFieldValue) => {
    await this.getBranches(company.data.customerCompany.uuid);
    setFieldValue(
      'selectedBranch',
      this.props.userStore.customerCompaniesBranches[0].name
    );
    setFieldValue('selectedCompany', company.data.customerCompany.name);
    setFieldValue('customerCompanyName', company.data.customerCompany.name);
    setFieldValue('companyEmail', company.data.customerCompany.email || '');
    setFieldValue('companyPhone', company.data.customerCompany.phone || '');
    setFieldValue('nip', company.data.customerCompany.nip || '');
    setFieldValue('bdo', company.data.customerCompany.bdo || '');
    setFieldValue('bdoFree', company.data.customerCompany.bdoFree || false);
    setFieldValue(
      'bdoPeopleCollection',
      company.data.customerCompany.bdoPeopleCollection || false
    );
    setFieldValue('tmpBdo', company.data.customerCompany.bdo || '');
    if (company.data.customerCompany.bdo === null) {
      setFieldValue('bdoIsRequired', false);
    } else {
      setFieldValue('bdoIsRequired', true);
    }
    setFieldValue('krs', company.data.customerCompany.krs || '');
    setFieldValue('regon', company.data.customerCompany.regon || '');
    setFieldValue(
      'customerCompanyAddress.street',
      company.data.customerCompany.address.street
    );
    setFieldValue(
      'customerCompanyAddress.city',
      company.data.customerCompany.address.city
    );
    setFieldValue(
      'customerCompanyAddress.postalCode',
      company.data.customerCompany.address.postalCode
    );
    setFieldValue(
      'customerCompanyAddress.country',
      company.data.customerCompany.address.country
    );
    this.changeCustomerCompanyBranch(
      this.props.userStore.customerCompaniesBranches[0],
      setFieldValue
    );
  };

  changeCustomerCompanyBranch = (branch, setFieldValue) => {
    if (branch === 'Inny') {
      setFieldValue('selectedBranch', 'Inny' || '');
      setFieldValue('customerCompanyBranch.name', branch.name || '');
      setFieldValue('customerCompanyBranch.street', '');
      setFieldValue('customerCompanyBranch.city', '');
      setFieldValue('customerCompanyBranch.postalCode', '');
      setFieldValue('customerCompanyBranch.country', '');
      setFieldValue('customerCompanyBranch.contact', '');
      setFieldValue('customerCompanyBranch.email', '');
      setFieldValue('customerCompanyBranch.phone', '');
    } else {
      setFieldValue('selectedBranch', branch.name);
      setFieldValue('customerCompanyBranch.name', branch.name || '');
      setFieldValue('customerCompanyBranch.street', branch.street || '');
      setFieldValue('customerCompanyBranch.city', branch.city || '');
      setFieldValue(
        'customerCompanyBranch.postalCode',
        branch.postalCode || ''
      );
      setFieldValue('customerCompanyBranch.country', branch.country || '');
      setFieldValue('customerCompanyBranch.contact', branch.contact || '');
      setFieldValue('customerCompanyBranch.email', branch.email || '');
      setFieldValue('customerCompanyBranch.phone', branch.phone || '');
    }
  };

  getGusInfo = async (nip, setFieldValue, setFieldTouched) => {
    const result = await this.props.ordersStore.getGusInformationAction(nip);
    if (result) {
      setFieldValue('regon', result.regon || '');
      setFieldTouched('regon');
      setFieldValue('customerCompanyName', result.name || '');
      setFieldTouched('customerCompanyName');
      setFieldValue('customerCompanyAddress.city', result.city || '');
      setFieldTouched('customerCompanyAddress.city');
      setFieldValue('customerCompanyAddress.street', result.street || '');
      setFieldTouched('customerCompanyAddress.street');
      setFieldValue(
        'customerCompanyAddress.postalCode',
        result.postalCode || ''
      );
      setFieldTouched('customerCompanyAddress.postalCode');
      this.props.enqueueSnackbar(
        this.props.t('ORDER_FORM.GET_GUS_DATA_VALID'),
        {
          variant: 'success'
        }
      );
    } else {
      this.props.enqueueSnackbar(
        this.props.t('ORDER_FORM.GET_GUS_DATA_INVALID'),
        {
          variant: 'error'
        }
      );
    }
  };

  isUserLogged = () =>
    this.props.authStore.session && this.props.authStore.session.xsrfToken;

  handleChange = recyclingItem => (event, expanded) => {
    this.setState({
      expanded: expanded ? recyclingItem : false
    });
  };

  rodoCheck = () => {
    this.setState({ rodoChecked: !this.state.rodoChecked });
  };

  contactCheck = () => {
    this.setState({ contact: !this.state.contact });
  };

  bdoCheck = (setFieldValue, values, fieldName, checked) => {
    const secondBdoCheckboxName =
      fieldName === 'bdoFree' ? 'bdoPeopleCollection' : 'bdoFree';
    setFieldValue(fieldName, checked);
    setFieldValue(secondBdoCheckboxName, false);
    setFieldValue('bdo', checked ? '' : values.tmpBdo);
    setFieldValue('bdoIsRequired', !checked);
  };

  render() {
    const { expanded } = this.state;
    const {
      t,
      classes,
      ordersStore: { packageTypes, recyclingItems, pending },
      userStore: { customer, customerCompanies, customerCompaniesBranches }
    } = this.props;

    const OrderSchema = Yup.object().shape({
      customerCompanyName: CompanyNameValidator,
      companyEmail: CompanyEmailValidator,
      nip: NipValidator,
      krs: KrsValidator,
      bdo: Yup.number().when('bdoIsRequired', {
        is: true,
        then: BdoValidator(true),
        otherwise: BdoValidator(false)
      }),
      regon: RegonValidator,
      customerCompanyAddress: Yup.object().shape({
        city: CompanyCityValidator,
        street: CompanyStreetValidator,
        postalCode: CompanyPostalCodeValidator,
        country: CompanyCountryValidator
      }),
      reporterName: reporter('name', this.props.authStore.session),
      reporterSurname: reporter('surname', this.props.authStore.session),
      reporterEmail: reporter('email', this.props.authStore.session),
      reporterPhone: reporter('phone', this.props.authStore.session),
      customerCompanyBranch: Yup.object().shape({
        sameAsCompany: Yup.boolean(),
        city: PickUpPlaceCityValidator,
        street: PickUpPlaceStreetValidator,
        postalCode: CompanyPostalCodeValidator,
        country: PickUpPlaceCountryValidator,
        phone: phoneValid('phone', this.state.contact),
        mainBranch: Yup.boolean().when('sameAsCompany', {
          is: false,
          then: PickUpPlaceCountryValidator
        })
      }),
      availableHoursFrom: AvailableHoursFromValidator,
      availableHoursTo: AvailableHoursToValidator,
      orderData: Yup.array().of(
        Yup.object().shape({
          recyclingItem: Yup.object().shape({
            uuid: RecycleUuidValidator,
            unit: RecycleUnitValidator,
            code: Yup.string(),
            description: Yup.string(),
            value: Yup.string().when('unit', {
              is: 'pieces',
              then: RecycleValueValidator,
              otherwise: PackageValueDecimalValidator
            })
          }),
          packageTypes: Yup.array().of(
            Yup.object().shape({
              uuid: PackageUuidValidator,
              name: Yup.string().when('uuid', {
                is: 'other',
                then: PackageNameValidator
              }),
              unit: PackageUnitValidator,
              value: Yup.string().when('unit', {
                is: 'pieces',
                then: PackageValueIntValidator,
                otherwise: PackageValueDecimalValidator
              })
            })
          )
        })
      )
    });

    if (customer && this.isUserLogged()) {
      this.setCustomer(customer);
    } else {
      this.setCustomer();
    }
    if (customerCompanies && this.isUserLogged()) {
      this.setInitialCustomerCompany(customerCompanies[0]);
    } else {
      this.setInitialAnonymousOrder();
    }

    if (this.state.redirectToReferrer) {
      return <Redirect to="/success" />;
    }
    return (
      <Formik
        enableReinitialize
        initialValues={OrderForm}
        validationSchema={OrderSchema}
        onSubmit={() => {}}
      >
        {props => {
          const { handleSubmit, values, reset, setFieldValue } = props;
          return (
            <div className={classes.container}>
              <Card className={classes.card}>
                <div className={classes.formHeader}>
                  <Typography className={classes.formTitle} component="h1">
                    {t('ORDER_FORM.TITLE')}
                  </Typography>
                </div>
                <Form onSubmit={handleSubmit} noValidate>
                  <OrderFormCompanySection
                    classes={classes}
                    t={t}
                    {...props}
                    customerCompanies={customerCompanies}
                    setCompany={this.changeCustomerCompany}
                    gus={this.getGusInfo}
                    session={this.props.authStore.session}
                    bdoCheck={this.bdoCheck}
                  />
                  {this.props.authStore.session && (
                    <div className={classes.bdoContainer}>
                      <Divider className={classes.dividerFields} />
                      <Typography
                        className={classes.sectionTitle}
                        component="h2"
                      >
                        {t('ORDER_FORM.COMPANY_BDO')}
                      </Typography>

                      <Field
                        name="bdo"
                        variant="outlined"
                        disabled
                        label={t('ORDER_FORM.COMPANY_BDO')}
                        component={TextField}
                        className={classes.bdo}
                        margin="normal"
                        autoComplete="off"
                        type="text"
                      />

                      <Typography className={classes.textField}>
                        {t('ORDER_FORM.OR')}
                      </Typography>

                      <FormControlLabel
                        className={classes.checkboxForm}
                        control={
                          <Checkbox
                            data-cy="notBdoLogged"
                            className={classes.checkboxField}
                            checked={values.bdoFree}
                            onChange={(e, checked) => {
                              this.bdoCheck(
                                setFieldValue,
                                values,
                                'bdoFree',
                                checked
                              );
                            }}
                            color="primary"
                          />
                        }
                        label={t('ORDER_FORM.BDO_CHECK')}
                      />
                      <Typography className={classes.textField}>
                        {t('ORDER_FORM.OR')}
                      </Typography>

                      <FormControlLabel
                        className={classes.checkboxForm}
                        control={
                          <Checkbox
                            data-cy="bdoPeopleCollection"
                            className={classes.checkboxField}
                            checked={values.bdoPeopleCollection}
                            onChange={(e, checked) => {
                              this.bdoCheck(
                                setFieldValue,
                                values,
                                'bdoPeopleCollection',
                                checked
                              );
                            }}
                            color="primary"
                          />
                        }
                        label={t('ORDER_FORM.BDO_PEOPLE_COLLECTION')}
                      />
                      <Divider className={classes.dividerFields} />
                    </div>
                  )}
                  <OrderFormPickUpPlaceSection
                    classes={classes}
                    customerCompaniesBranches={customerCompaniesBranches}
                    setBranch={this.changeCustomerCompanyBranch}
                    t={t}
                    session={this.props.authStore.session}
                    {...props}
                  />
                  <OrderFormReporterSection
                    classes={classes}
                    t={t}
                    {...props}
                    customer={customerCompaniesBranches}
                    session={this.props.authStore.session}
                    contactCheck={this.contactCheck}
                    contact={this.state.contact}
                  />
                  <OrderFormItemsSection
                    classes={classes}
                    t={t}
                    {...props}
                    handleChange={this.handleChange}
                    expanded={expanded}
                    packageTypes={packageTypes}
                    recyclingItems={recyclingItems}
                    getPackagesTypes={this.getPackageTypes}
                    getRecyclingItems={this.getRecyclingItems}
                  />
                  <OrderFormFooterSection
                    classes={classes}
                    t={t}
                    {...props}
                    enqueueSnackbar={this.props.enqueueSnackbar}
                  />
                  <ExpansionPanel
                    className={classes.rodoExpansionPanel}
                    expanded={expanded === 'rodo'}
                    onChange={this.handleChange('rodo')}
                  >
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography className={classes.heading}>
                        {t('ORDER_FORM.RODO_SUMMARY')}
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails
                      className={classes.expansionWithoutFlex}
                    >
                      <Typography className={classes.rodoInfo}>
                        {t('ORDER_FORM.RODO_0')}
                      </Typography>
                      <ol className={classes.rodoList}>
                        <li className={classes.rodoListChild}>
                          {t('ORDER_FORM.RODO_1')}
                        </li>
                        <li className={classes.rodoListChild}>
                          {t('ORDER_FORM.RODO_2')}
                        </li>
                        <li className={classes.rodoListChild}>
                          {t('ORDER_FORM.RODO_3')}
                          <ol className={classes.rodoSubList}>
                            <li>{t('ORDER_FORM.RODO_3A')}</li>
                            <li>{t('ORDER_FORM.RODO_3B')}</li>
                          </ol>
                        </li>
                        <li className={classes.rodoListChild}>
                          {t('ORDER_FORM.RODO_4')}
                        </li>
                        <li className={classes.rodoListChild}>
                          {t('ORDER_FORM.RODO_5')}
                        </li>
                        <li className={classes.rodoListChild}>
                          {t('ORDER_FORM.RODO_6')}
                          <ol className={classes.rodoSubList}>
                            <li>{t('ORDER_FORM.RODO_6A')}</li>
                            <li>{t('ORDER_FORM.RODO_6B')}</li>
                          </ol>
                          <p>{t('ORDER_FORM.RODO_6C')}</p>
                        </li>
                        <li className={classes.rodoListChild}>
                          {t('ORDER_FORM.RODO_7')}
                        </li>
                        <li className={classes.rodoListChild}>
                          {t('ORDER_FORM.RODO_8')}
                        </li>
                      </ol>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <FormControlLabel
                    className={classes.checkboxForm}
                    control={
                      <Checkbox
                        onChange={this.rodoCheck}
                        color="primary"
                        data-cy="rodoCheckbox"
                      />
                    }
                    label={t('ORDER_FORM.RODO_CHECK')}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!this.state.rodoChecked}
                    className={classes.buttonSubmit}
                    onClick={() => this.submitOrder(props)}
                    type="submit"
                    data-cy="sendOrder"
                  >
                    {pending ? (
                      <CircularProgress
                        size={30}
                        thickness={5}
                        color="secondary"
                      />
                    ) : (
                      <div>{t('ORDER_FORM.SEND')}</div>
                    )}
                  </Button>
                  {this.state.showErrors && (
                    <FormErrorsModal
                      errors={props.errors}
                      hideModal={this.hideModal}
                      t={t}
                    />
                  )}
                </Form>
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
    width: '100%',
    padding: '150px 0 100px 0',
    boxSizing: 'border-box',
    position: 'relative'
  },

  expansionWithoutFlex: {
    display: 'block'
  },

  card: {
    width: '90%',
    maxWidth: '700px'
  },
  formHeader: {
    backgroundColor: COLORS.DARK_BLUE
  },
  logo: {
    maxWidth: '220px',
    height: 'auto',
    backgroundSize: 'contain',
    position: 'fixed',
    top: '20px',
    right: '30px'
  },
  formTitle: {
    fontSize: '20px',
    padding: '20px 0',
    paddingLeft: '4%',
    color: COLORS.WHITE
  },
  formSection: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap'
  },
  sectionTitle: {
    width: '100%',
    marginTop: '20px',
    paddingBottom: '10px',
    paddingLeft: '4%',
    fontSize: '20px'
  },
  textField: {
    width: '44%',
    marginTop: '12px',
    marginLeft: '4%',
    '@media(max-width: 800px)': {
      width: '92%',
      marginRight: '4%'
    }
  },
  dividerFields: {
    margin: '15px 0 10px'
  },
  itemsSection: {
    width: '92%',
    margin: '0 0 30px 4%'
  },
  orderItemsWrapper: {
    width: '100%',
    paddingBottom: '20px',
    marginBottom: '20px'
  },
  orderItemsSection: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap'
  },
  orderItemTextField: {
    width: '30%'
  },
  orderItemsHeaderSection: {
    width: '100%',
    display: 'flex',
    backgroundColor: COLORS.DARK_BLUE,
    margin: '15px 0'
  },
  orderPackageHeaderSection: {
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  itemSectionTitle: {
    padding: '16px 4%',
    width: '100%',
    fontSize: '16px',
    color: COLORS.WHITE
  },
  packageSectionTitle: {
    padding: '16px 4%',
    flex: 1,
    fontSize: '16px'
  },
  removePackageButton: {
    marginRight: '4%',
    cursor: 'pointer',
    padding: 0,
    '&:hover': {
      background: 'none',
      color: COLORS.PRIMARY_COLOR
    },
    '@media(max-width: 800px)': {
      marginRight: 0
    }
  },
  addPackageHolder: {
    width: '100%',
    textAlign: 'right',
    marginRight: '4%',
    marginTop: '10px'
  },
  addPackageButton: {
    backgroundColor: COLORS.PRIMARY_COLOR,
    color: COLORS.WHITE,
    width: 'auto',
    '&:hover': {
      backgroundColor: COLORS.SECONDARY_COLOR
    }
  },
  addPackageButtonDisabled: {
    backgroundColor: COLORS.LIGHT_GREY,
    width: 'auto'
  },

  addIcon: {
    position: 'absolute'
  },
  textArea: {
    width: '92%',
    marginLeft: '4%'
  },
  itemsActionsHolder: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  itemActionButton: {
    marginRight: 35,
    fontWeight: 600,
    fontSize: 14,
    color: COLORS.WHITE
  },
  addItemsActionsHolder: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    paddingTop: '20px'
  },
  checkboxWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 4%'
  },
  checkbox: {
    width: '30px'
  },
  checkboxLabel: {
    cursor: 'pointer'
  },
  imagesHolder: {
    width: '100%',
    padding: '4%',
    display: 'flex',
    flexWrap: 'wrap'
  },
  imageWrapper: {
    width: '23%',
    display: 'flex',
    margin: '1%',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  image: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  imageContent: {
    width: '90%',
    height: 'auto'
  },
  imageTittle: {
    width: '100%',
    padding: '5px 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'center'
  },
  addFileButton: {
    marginLeft: '4%'
  },
  buttonRemove: {
    padding: '5px 5px',
    border: 'none',
    textTransform: 'none',
    justifyContent: 'flex-end',
    '&:hover': {
      backgroundColor: 'transparent',
      color: 'initial'
    }
  },
  buttonSubmit: {
    display: 'flex',
    margin: '50px auto',
    fontWeight: '600',
    fontSize: '20px',
    backgroundColor: COLORS.PRIMARY_COLOR,
    color: COLORS.WHITE,
    width: '60%'
  },
  searchInput: {
    width: '100%',
    padding: '10px',
    outline: 'none'
  },
  companySelect: {
    width: '93%',
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto 28px',
    marginBottom: '30px'
  },
  companySelectTitle: {
    width: '44%',
    marginTop: '12px',
    marginBottom: '10px',
    fontSize: '20px',
    '@media(max-width: 800px)': {
      width: '92%'
    }
  },
  btnGus: {
    height: 56,
    background: COLORS.PRIMARY_COLOR,
    color: COLORS.WHITE,
    border: 'none',
    marginTop: 12,
    borderRadius: 4,
    fontWeight: 'bold',
    marginLeft: 28
  },
  totalWeight: {
    width: '100%',
    textAlign: 'right',
    paddingRight: '4.5%',
    fontWeight: 600
  },
  typeField: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: '20px',
    marginBottom: 15,
    paddingBottom: 0,
    '@media only screen and (max-width:800px)': {
      flexDirection: 'column'
    }
  },

  packageField: {
    width: '100%',
    display: 'flex',
    marginTop: '20px',
    marginBottom: 0,
    paddingBottom: 0,
    '@media only screen and (max-width:800px)': {
      flexDirection: 'column'
    }
  },
  unitField: {
    width: '50%',
    marginTop: 0,
    '@media only screen and (max-width:800px)': {
      width: '100%',
      marginLeft: 0,
      marginTop: 15,
      marginBottom: 20
    }
  },

  quantityField: {
    width: '50%',
    marginTop: 0,
    marginLeft: '26px',
    '@media only screen and (max-width:800px)': {
      width: '100%',
      marginLeft: 0
    }
  },

  quantityPackageField: {
    width: '20%',
    marginTop: 0,
    marginLeft: '26px',
    '@media only screen and (max-width:800px)': {
      width: '100%',
      marginLeft: 0
    }
  },

  centerForm: {
    justifyContent: 'center',
    flexDirection: 'column'
  },

  detailPackageHeader: {
    textAlign: 'center',
    fontWeight: 600
  },

  deleteWrapper: {
    display: 'flex',
    alignItems: 'center',
    width: '20%',
    justifyContent: 'flex-start',
    marginLeft: '3%',
    '@media only screen and (max-width:800px)': {
      width: '100%',
      justifyContent: 'flex-end',
      margin: '2% 0'
    }
  },

  expansionPanelWidth: {
    width: '92%',
    margin: '0 auto'
  },
  packageTypeField: {
    width: '70%',
    '@media only screen and (max-width:800px)': {
      width: '100%',
      marginBottom: 15
    }
  },

  expansionSummary: {
    background: COLORS.DARK_BLUE
  },

  orderItemTitle: {
    color: COLORS.WHITE,
    fontWeight: 600,
    marginTop: 8
  },

  iconOpenColor: {
    color: COLORS.WHITE
  },

  packageContainer: {
    backgroundColor: COLORS.BACKGROUND_PACKAGE_TYPE,
    padding: '16px'
  },

  rodoExpansionPanel: {
    boxShadow: 'none',
    margin: '27px 20px',
    marginBottom: 0
  },

  rodoList: {
    fontSize: 16,
    '&>li': {
      marginTop: 10
    }
  },

  rodoInfo: {
    marginTop: 20
  },

  rodoSubList: {
    listStyleType: 'lower-alpha',
    '&>li': {
      marginTop: 10
    }
  },

  checkboxForm: {
    margin: '0 27px'
  },

  checkboxField: {
    paddingLeft: 0
  },

  nameCompany: {
    width: '100%',
    flexWrap: 'wrap'
  },

  bdoContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  bdo: {
    margin: 'auto 28px'
  },

  unitAndQuantity: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20
  }
});

export default withStyles(styles)(OrderFormWrapper);
