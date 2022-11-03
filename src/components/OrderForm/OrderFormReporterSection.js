import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { Typography } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const OrderFormReporterSection = props => {
  const { classes, t, customer, session } = props;
  return (
    <div className={classes.formSection}>
      {!props.session && (
        <>
          <Typography className={classes.sectionTitle} component="h2">
            {t('ORDER_FORM.REPORTER_PERSON')}
          </Typography>
          <Field
            data-cy="reporterName"
            name="reporterName"
            variant="outlined"
            label={t('ORDER_FORM.REPORTER_NAME')}
            component={TextField}
            className={classes.textField}
            margin="normal"
            autoComplete="off"
            type="text"
            required
          />
          <Field
            data-cy="reporterSurname"
            name="reporterSurname"
            variant="outlined"
            label={t('ORDER_FORM.REPORTER_SURNAME')}
            component={TextField}
            className={classes.textField}
            margin="normal"
            autoComplete="off"
            type="text"
            required
          />
          <Field
            data-cy="reporterEmail"
            name="reporterEmail"
            variant="outlined"
            label={t('ORDER_FORM.REPORTER_EMAIL')}
            component={TextField}
            className={classes.textField}
            margin="normal"
            autoComplete="off"
            type="text"
            required
          />
          <Field
            data-cy="reporterPhone"
            name="reporterPhone"
            variant="outlined"
            label={t('ORDER_FORM.REPORTER_PHONE')}
            component={TextField}
            className={classes.textField}
            margin="normal"
            type="text"
            required
          />
          <FormControlLabel
            data-cy="contactCheckbox"
            className={classes.checkboxForm}
            control={<Checkbox onChange={props.contactCheck} color="primary" />}
            label={t('ORDER_FORM.CONTACT_CHECK')}
          />
        </>
      )}
      {props.contact && (
        <>
          <Typography className={classes.sectionTitle} component="h2">
            {t('ORDER_FORM.CONTACT_PERSON')}
          </Typography>
          <Field
            data-cy="contact"
            name="customerCompanyBranch.contact"
            value={props.values.customerCompanyBranch.contact || ''}
            variant="outlined"
            label={t('ORDER_FORM.CONTACT_NAME')}
            component={TextField}
            className={classes.textField}
            margin="normal"
            autoComplete="off"
            type="text"
          />
          <Field
            data-cy="contactEmail"
            name="customerCompanyBranch.email"
            value={props.values.customerCompanyBranch.email || ''}
            variant="outlined"
            label={t('ORDER_FORM.REPORTER_EMAIL')}
            component={TextField}
            className={classes.textField}
            margin="normal"
            autoComplete="off"
            type="text"
          />
          <Field
            data-cy="contactPhone"
            name="customerCompanyBranch.phone"
            value={props.values.customerCompanyBranch.phone || ''}
            variant="outlined"
            required
            label={t('ORDER_FORM.REPORTER_PHONE')}
            component={TextField}
            className={classes.textField}
            margin="normal"
            type="text"
          />
        </>
      )}
    </div>
  );
};

export default OrderFormReporterSection;
