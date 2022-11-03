import React from 'react';
import { Field } from 'formik';
import { TextField, Checkbox } from 'formik-material-ui';
import { Select, Typography } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import { InlineDatePicker } from 'material-ui-pickers';
import * as moment from 'moment';
import OutlinedInput from '@material-ui/core/OutlinedInput/OutlinedInput';
import { StartTimeOptions, EndTimeOptions } from '../../utils/pickerHours';

const OrderFormPickUpPlaceSection = props => {
  const { classes, t, customerCompaniesBranches, setBranch } = props;
  return (
    <div className={classes.formSection}>
      <Typography className={classes.sectionTitle} component="h2">
        {t('ORDER_FORM.PICKUP_PLACE')}
      </Typography>
      {customerCompaniesBranches && props.session && (
        <div className={classes.companySelect}>
          <Typography className={classes.companySelectTitle} component="h2">
            {t('ORDER_FORM.SELECTED_BRANCH')}
          </Typography>
          <Select
            name="selectedBranch"
            value={props.values.selectedBranch}
            onChange={event => {
              setBranch(event.target.value, props.setFieldValue);
            }}
            className={classes.nameCompany}
            renderValue={value => `${value}`}
            type="text"
            input={<OutlinedInput name="selectedBranch" labelWidth={0} />}
          >
            {customerCompaniesBranches.map(item => (
              <MenuItem key={item.uuid} value={item}>
                {item.name}
              </MenuItem>
            ))}
            <MenuItem key="Other" value="Inny">
              Inny
            </MenuItem>
          </Select>
        </div>
      )}
      <>
        {(props.values.selectedBranch === 'Inny' || !props.session) && (
          <Field
            data-cy="customerCompanyBranch"
            name="customerCompanyBranch.name"
            variant="outlined"
            label={t('ORDER_FORM.BRANCH_NAME')}
            component={TextField}
            className={classes.textField}
            margin="normal"
            required
            autoComplete="off"
            type="text"
          />
        )}
        <Field
          data-cy="street"
          name="customerCompanyBranch.street"
          variant="outlined"
          label={t('ORDER_FORM.STREET')}
          component={TextField}
          className={classes.textField}
          margin="normal"
          autoComplete="off"
          type="text"
          disabled={
            props.values &&
            props.values.selectedBranch !== 'Inny' &&
            props.session
          }
        />
        <Field
          data-cy="postalCode"
          name="customerCompanyBranch.postalCode"
          variant="outlined"
          label={t('ORDER_FORM.POSTAL_CODE')}
          component={TextField}
          className={classes.textField}
          margin="normal"
          autoComplete="off"
          type="text"
          disabled={
            props.values &&
            props.values.selectedBranch !== 'Inny' &&
            props.session
          }
        />
        <Field
          data-cy="city"
          name="customerCompanyBranch.city"
          variant="outlined"
          label={t('ORDER_FORM.CITY')}
          component={TextField}
          className={classes.textField}
          margin="normal"
          autoComplete="off"
          type="text"
          disabled={
            props.values &&
            props.values.selectedBranch !== 'Inny' &&
            props.session
          }
        />
        <Field
          data-cy="country"
          name="customerCompanyBranch.country"
          variant="outlined"
          label={t('ORDER_FORM.COUNTRY')}
          component={TextField}
          className={classes.textField}
          margin="normal"
          autoComplete="off"
          type="text"
          disabled={
            props.values &&
            props.values.selectedBranch !== 'Inny' &&
            props.session
          }
        />
      </>
      <Typography className={classes.sectionTitle} component="h2">
        {t('ORDER_FORM.PICKUP_HOURS')}
      </Typography>
      <Field
        select
        name="availableHoursFrom"
        variant="outlined"
        label={t('ORDER_FORM.PICKUP_HOURS_FROM')}
        component={TextField}
        className={classes.textField}
        type="text"
        margin="normal"
      >
        {StartTimeOptions.map((time, index) => (
          <MenuItem
            key={index}
            disabled={
              !!props.values.availableHoursTo &&
              index > EndTimeOptions.indexOf(props.values.availableHoursTo)
            }
            value={time}
          >
            {time}
          </MenuItem>
        ))}
      </Field>
      <Field
        select
        name="availableHoursTo"
        variant="outlined"
        label={t('ORDER_FORM.PICKUP_HOURS_TO')}
        component={TextField}
        className={classes.textField}
        type="text"
        margin="normal"
      >
        {EndTimeOptions.map((time, index) => (
          <MenuItem
            key={index}
            disabled={
              !!props.values.availableHoursFrom &&
              index < StartTimeOptions.indexOf(props.values.availableHoursFrom)
            }
            value={time}
          >
            {time}
          </MenuItem>
        ))}
      </Field>
    </div>
  );
};

export default OrderFormPickUpPlaceSection;
