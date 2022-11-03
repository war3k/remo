import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { Divider, MenuItem, Select, Typography } from '@material-ui/core';
import OutlinedInput from '@material-ui/core/OutlinedInput/OutlinedInput';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const OrderFormCompanySection = props => {
  const { classes, t, customerCompanies, setCompany, gus } = props;
  return (
    <div className={classes.formSection}>
      <Typography className={classes.sectionTitle} component="h2">
        {t('ORDER_FORM.COMPANY')}
      </Typography>
      {(customerCompanies && props.session && (
        <div className={classes.companySelect}>
          <Typography className={classes.companySelectTitle} component="h2">
            {t('ORDER_FORM.SELECTED_COMPANY')}
          </Typography>
          <Select
            value={props.values.selectedCompany}
            onChange={event => {
              setCompany(event.target.value, props.setFieldValue);
            }}
            className={classes.nameCompany}
            renderValue={value => `${value}`}
            type="text"
            input={<OutlinedInput name="companyName" labelWidth={0} />}
          >
            {customerCompanies.map(item => (
              <MenuItem key={item.data.customerCompany.uuid} value={item}>
                {item.data.customerCompany.name}
              </MenuItem>
            ))}
          </Select>
        </div>
      )) || (
        <div>
          <Field
            data-cy="nip"
            name="nip"
            variant="outlined"
            label={t('ORDER_FORM.NIP')}
            component={TextField}
            className={classes.textField}
            margin="normal"
            autoComplete="off"
            type="text"
          />
          <Button
            data-cy="getGusData"
            variant="contained"
            color="primary"
            className={classNames(classes.button, classes.btnGus)}
            disabled={!props.values.nip || props.values.nip.length < 10}
            onClick={() =>
              gus(props.values.nip, props.setFieldValue, props.setFieldTouched)
            }
          >
            {t('ORDER_FORM.GET_GUS_DATA')}
          </Button>
          <Field
            name="customerCompanyName"
            variant="outlined"
            label={t('ORDER_FORM.COMPANY_NAME')}
            component={TextField}
            className={classes.textField}
            margin="normal"
            autoComplete="off"
            type="text"
          />
          <Field
            name="customerCompanyAddress.street"
            variant="outlined"
            label={t('ORDER_FORM.STREET')}
            component={TextField}
            className={classes.textField}
            margin="normal"
            autoComplete="off"
            type="text"
          />
          <Field
            name="customerCompanyAddress.postalCode"
            variant="outlined"
            label={t('ORDER_FORM.POSTAL_CODE')}
            component={TextField}
            className={classes.textField}
            margin="normal"
            autoComplete="off"
            type="text"
          />
          <Field
            name="customerCompanyAddress.city"
            variant="outlined"
            label={t('ORDER_FORM.CITY')}
            component={TextField}
            className={classes.textField}
            margin="normal"
            autoComplete="off"
            type="text"
          />
          <Field
            data-cy="companyCountry"
            name="customerCompanyAddress.country"
            variant="outlined"
            label={t('ORDER_FORM.COUNTRY')}
            component={TextField}
            className={classes.textField}
            margin="normal"
            autoComplete="off"
            type="text"
          />
          <Field
            name="krs"
            variant="outlined"
            label={t('ORDER_FORM.KRS')}
            component={TextField}
            className={classes.textField}
            margin="normal"
            autoComplete="off"
            type="text"
          />
          <Field
            name="regon"
            variant="outlined"
            label={t('ORDER_FORM.REGON')}
            component={TextField}
            className={classes.textField}
            margin="normal"
            autoComplete="off"
            type="text"
          />
          <Field
            name="companyEmail"
            variant="outlined"
            label={t('ORDER_FORM.COMPANY_EMAIL')}
            component={TextField}
            className={classes.textField}
            margin="normal"
            autoComplete="off"
            type="email"
          />
          <Field
            name="companyPhone"
            variant="outlined"
            label={t('ORDER_FORM.COMPANY_PHONE')}
            component={TextField}
            className={classes.textField}
            margin="normal"
            autoComplete="off"
            type="text"
          />

          <Divider className={classes.dividerFields} />
          <Typography className={classes.sectionTitle} component="h2">
            {t('ORDER_FORM.COMPANY_BDO')}
          </Typography>

          <Field
            data-cy="bdoNumber"
            name="bdo"
            variant="outlined"
            disabled={props.bdo}
            required={props.bdoIsRequired}
            label={t('ORDER_FORM.COMPANY_BDO')}
            component={TextField}
            className={classes.textField}
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
                color="primary"
                data-cy="notLoggedBdo"
                className={classes.checkboxField}
                checked={props.values.bdoFree}
                onChange={(e, checked) => {
                  props.bdoCheck(
                    props.setFieldValue,
                    props.values,
                    'bdoFree',
                    checked
                  );
                }}
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
                checked={props.values.bdoPeopleCollection}
                onChange={(e, checked) => {
                  props.bdoCheck(
                    props.setFieldValue,
                    props.values,
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
    </div>
  );
};

export default OrderFormCompanySection;
