import { Field, FieldArray } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import {
  Button,
  Typography,
  TextField as CustomTextField
} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton/IconButton';
import classNames from 'classnames';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CustomSelectComponent from './CustomSelectComponent';
import CustomSelectComponentPackage from './CustomSelectComponentPackage';

const mapRecyclingOptions = (options, values) => {
  const selectOptions = [];
  if (options && options.length) {
    options.forEach(option => {
      if (
        !values.orderData.find(item => item.recyclingItem.uuid === option.uuid)
      ) {
        selectOptions.push({
          label: `${option.name}  ${option.code ? `[${option.code}]` : ''} ${
            option.description ? `- ${option.description}` : ''
          }`,
          code: option.code || '',
          name: option.name,
          description: option.description,
          value: option.uuid,
          weightPerCubicMeter: option.weightPerCubicMeter,
          weightPerPiece: option.weightPerPiece
        });
      }
    });
  }
  return selectOptions;
};

const mapPackagesOptions = (options, t, values) => {
  const selectOptions = [];
  if (options && options.length) {
    options.forEach(option => {
      if (!values.find(item => item.uuid === option.uuid)) {
        selectOptions.push({
          label: option.name,
          value: option.uuid,
          unit: option.unit
        });
      }
    });
  }
  return selectOptions;
};

const getTotalWeight = values => {
  let totalWeight = 0;
  values.orderData.forEach(item => {
    if (item.recyclingItem.value && item.recyclingItem.unit) {
      const value = parseFloat(item.recyclingItem.value);
      switch (item.recyclingItem.unit) {
        case 'm3':
          totalWeight += value * item.recyclingItem.weightPerCubicMeter;
          break;
        case 'pieces':
          totalWeight += value * item.recyclingItem.weightPerPiece;
          break;
        default:
          totalWeight += value;
          break;
      }
    }
  });
  if (Number.isInteger(totalWeight)) {
    return totalWeight;
  }
  return totalWeight.toFixed(3);
};

const OrderFormItemsSection = props => {
  const {
    classes,
    t,
    packageTypes,
    recyclingItems,
    values,
    errors,
    touched,
    getPackagesTypes,
    getRecyclingItems
  } = props;
  return (
    <div className={classes.formSection}>
      <Typography className={classes.sectionTitle} component="h2">
        {t('ORDER_FORM.ITEMS_TO_RECYCLE')}
      </Typography>

      <FieldArray
        name="orderData"
        render={arrayHelpers => (
          <>
            {props.values.orderData.map((item, index) => (
              <div className={classes.orderItemsSection} key={index}>
                <ExpansionPanel
                  className={classes.expansionPanelWidth}
                  expanded={props.expanded === `recyclingItem${index}`}
                  onChange={props.handleChange(`recyclingItem${index}`)}
                >
                  <ExpansionPanelSummary
                    className={classes.expansionSummary}
                    expandIcon={
                      <ExpandMoreIcon className={classes.iconOpenColor} />
                    }
                  >
                    <Typography className={classes.orderItemTitle}>
                      {(values.orderData[index].recyclingItem.copyName &&
                        values.orderData[index].recyclingItem.copyName) ||
                        t('ORDER_FORM.RECYCLING_ITEM')}
                    </Typography>
                    {values.orderData.length > 1 && (
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        className={classes.itemActionButton}
                        onClick={() => {
                          arrayHelpers.remove(index);
                        }}
                      >
                        {t('ORDER_FORM.REMOVE_ITEM')}
                      </Button>
                    )}
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={classes.centerForm}>
                    <div
                      key={index}
                      className={classNames(
                        classes.orderItemsWrapper,
                        classes.typeField
                      )}
                    >
                      <div>
                        <CustomSelectComponent
                          fieldName={`orderData.${index}.recyclingItem.uuid`}
                          additionalFieldName={`orderData.${index}.recyclingItem.copyName`}
                          weightPerPieceFieldName={`orderData.${index}.recyclingItem.weightPerPiece`}
                          weightPerCubicMeterFieldName={`orderData.${index}.recyclingItem.weightPerCubicMeter`}
                          code={`orderData.${index}.recyclingItem.code`}
                          name={`orderData.${index}.recyclingItem.name`}
                          description={`orderData.${index}.recyclingItem.description`}
                          label={t('ORDER_FORM.RECYCLE_TYPE')}
                          value={
                            {
                              value: values.orderData[index].recyclingItem.uuid,
                              label:
                                values.orderData[index].recyclingItem.copyName,
                              name: values.orderData[index].recyclingItem.name,
                              code:
                                values.orderData[index].recyclingItem.code ||
                                '',
                              description:
                                values.orderData[index].recyclingItem
                                  .description
                            } || ''
                          }
                          valueName={values.orderData[index].recyclingItem.name}
                          onChange={props.setFieldValue}
                          onBlur={props.setFieldTouched}
                          touched={
                            touched.orderData &&
                            touched.orderData[index] &&
                            touched.orderData[index].recyclingItem &&
                            touched.orderData[index].recyclingItem.uuid
                          }
                          error={
                            errors.orderData &&
                            errors.orderData[index] &&
                            errors.orderData[index].recyclingItem &&
                            errors.orderData[index].recyclingItem.uuid
                          }
                          itemsType="recyclingItems"
                          options={mapRecyclingOptions(recyclingItems, values)}
                          filterOptions={getRecyclingItems}
                        />
                      </div>
                      <div className={classes.unitAndQuantity}>
                        <Field
                          select
                          name={`orderData.${index}.recyclingItem.unit`}
                          variant="outlined"
                          label={t('ORDER_FORM.UNIT')}
                          component={TextField}
                          className={classNames(classes.unitField)}
                          autoComplete="off"
                          type="text"
                          margin="normal"
                        >
                          <MenuItem value="pieces" data-cy="pieces">
                            {t('ORDER_FORM.PIECES')}
                          </MenuItem>
                          <MenuItem value="m3" data-cy="m3">
                            {t('ORDER_FORM.M3')}
                          </MenuItem>
                          <MenuItem value="kg" data-cy="kg">
                            {t('ORDER_FORM.KG')}
                          </MenuItem>
                        </Field>
                        <Field
                          id="recyclingUnitValue"
                          name={`orderData.${index}.recyclingItem.value`}
                          variant="outlined"
                          label={t('ORDER_FORM.VALUE')}
                          component={TextField}
                          className={classNames(
                            classes.textField,
                            classes.quantityField
                          )}
                          autoComplete="off"
                          type="text"
                          margin="normal"
                        />
                      </div>
                    </div>
                    {values.orderData[index].recyclingItem.value &&
                      values.orderData[index].recyclingItem.unit &&
                      values.orderData[index].recyclingItem.name && (
                        <FieldArray
                          name={`orderData.${index}.packageTypes`}
                          render={arrayHelpers => (
                            <>
                              <div className={classes.packageContainer}>
                                <p className={classes.detailPackageHeader}>
                                  {t('ORDERS_DETAILS.PACKAGE')}
                                </p>
                                {props.values.orderData[index].packageTypes.map(
                                  (pack, i) => (
                                    <div
                                      key={i}
                                      className={classNames(
                                        classes.orderItemsSection,
                                        classes.packageField
                                      )}
                                    >
                                      <div className={classes.packageTypeField}>
                                        {/* eslint-disable-next-line react/jsx-no-undef */}
                                        <CustomSelectComponentPackage
                                          fieldName={`orderData.${index}.packageTypes.${i}.uuid`}
                                          additionalFieldName={`orderData.${index}.packageTypes.${i}.name`}
                                          unitFieldName={`orderData.${index}.packageTypes.${i}.unit`}
                                          label={t('ORDER_FORM.PACKAGE_TYPE')}
                                          value={{
                                            value:
                                              values.orderData[index]
                                                .packageTypes[i].uuid,
                                            label:
                                              values.orderData[index]
                                                .packageTypes[i].name
                                          }}
                                          onChange={props.setFieldValue}
                                          onBlur={props.setFieldTouched}
                                          touched={
                                            touched.orderData &&
                                            touched.orderData[index] &&
                                            touched.orderData[index]
                                              .packageTypes &&
                                            touched.orderData[index]
                                              .packageTypes[i] &&
                                            touched.orderData[index]
                                              .packageTypes[i].uuid
                                          }
                                          error={
                                            errors.orderData &&
                                            errors.orderData[index] &&
                                            errors.orderData[index]
                                              .packageTypes &&
                                            errors.orderData[index]
                                              .packageTypes[i] &&
                                            errors.orderData[index]
                                              .packageTypes[i].uuid
                                          }
                                          options={mapPackagesOptions(
                                            packageTypes,
                                            t,
                                            values.orderData[index].packageTypes
                                          )}
                                          filterOptions={getPackagesTypes}
                                        />
                                      </div>
                                      <CustomTextField
                                        id="quantityRecycling"
                                        className={classNames(
                                          classes.textField,
                                          classes.quantityPackageField
                                        )}
                                        variant="outlined"
                                        label={t('ORDER_FORM.VALUE')}
                                        value={
                                          values.orderData[index].packageTypes[
                                            i
                                          ].value
                                        }
                                        onChange={event =>
                                          props.setFieldValue(
                                            `orderData.${index}.packageTypes.${i}.value`,
                                            event.target.value
                                          )
                                        }
                                        onBlur={() =>
                                          props.setFieldTouched(
                                            `orderData.${index}.packageTypes.${i}.value`
                                          )
                                        }
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              {values.orderData[index]
                                                .packageTypes[i].uuid !==
                                                'other' &&
                                                values.orderData[index]
                                                  .packageTypes[i].unit &&
                                                t(
                                                  `ORDER_FORM.${values.orderData[
                                                    index
                                                  ].packageTypes[
                                                    i
                                                  ].unit.toUpperCase()}`
                                                )}
                                            </InputAdornment>
                                          )
                                        }}
                                        error={
                                          errors.orderData &&
                                          errors.orderData[index] &&
                                          errors.orderData[index]
                                            .packageTypes &&
                                          errors.orderData[index].packageTypes[
                                            i
                                          ] &&
                                          errors.orderData[index].packageTypes[
                                            i
                                          ].value &&
                                          touched.orderData &&
                                          touched.orderData[index] &&
                                          touched.orderData[index]
                                            .packageTypes &&
                                          touched.orderData[index].packageTypes[
                                            i
                                          ] &&
                                          touched.orderData[index].packageTypes[
                                            i
                                          ].value
                                        }
                                        helperText={
                                          touched.orderData &&
                                          touched.orderData[index] &&
                                          touched.orderData[index]
                                            .packageTypes &&
                                          touched.orderData[index].packageTypes[
                                            i
                                          ] &&
                                          touched.orderData[index].packageTypes[
                                            i
                                          ].value &&
                                          errors.orderData &&
                                          errors.orderData[index] &&
                                          errors.orderData[index]
                                            .packageTypes &&
                                          errors.orderData[index].packageTypes[
                                            i
                                          ] &&
                                          errors.orderData[index].packageTypes[
                                            i
                                          ].value
                                        }
                                      />
                                      {values.orderData[index].packageTypes
                                        .length > 1 && (
                                        <div className={classes.deleteWrapper}>
                                          <IconButton
                                            onClick={() => {
                                              arrayHelpers.remove(i);
                                            }}
                                            className={
                                              classes.removePackageButton
                                            }
                                          >
                                            <DeleteIcon />
                                          </IconButton>
                                        </div>
                                      )}
                                      {i ===
                                        values.orderData[index].packageTypes
                                          .length -
                                          1 && (
                                        <div
                                          className={classes.addPackageHolder}
                                        >
                                          <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={
                                              !values.orderData[index]
                                                .packageTypes[i].uuid ||
                                              !values.orderData[index]
                                                .packageTypes[i].value
                                            }
                                            onClick={() => {
                                              arrayHelpers.push({
                                                uuid: '',
                                                name: '',
                                                value: '',
                                                unit: ''
                                              });
                                            }}
                                            className={
                                              !values.orderData[index]
                                                .packageTypes[i].uuid ||
                                              !values.orderData[index]
                                                .packageTypes[i].value
                                                ? classes.addPackageButtonDisabled
                                                : classes.addPackageButton
                                            }
                                          >
                                            {t('ORDER_FORM.ADD_NEW_PACKAGE')}
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            </>
                          )}
                        />
                      )}
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                {!(errors && errors.orderData && errors.orderData[index]) &&
                  touched &&
                  touched.orderData &&
                  touched.orderData[index] &&
                  index === values.orderData.length - 1 && (
                    <div className={classes.addItemsActionsHolder}>
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        className={classes.itemActionButton}
                        onClick={() => {
                          arrayHelpers.push({
                            recyclingItem: {
                              uuid: '',
                              name: '',
                              unit: '',
                              value: ''
                            },
                            packageTypes: [
                              {
                                uuid: '',
                                name: '',
                                value: '',
                                unit: ''
                              }
                            ]
                          });
                          props.handleChange(`recyclingItem${index + 1}`)(
                            null,
                            props.expanded
                          );
                        }}
                      >
                        {t('ORDER_FORM.ADD_ITEM')}
                      </Button>
                    </div>
                  )}
              </div>
            ))}
          </>
        )}
      />
      <p className={classes.totalWeight}>
        {t('ORDER_FORM.TOTAL_WEIGHT')} {getTotalWeight(values)}{' '}
        {t('ORDER_FORM.KG')}
      </p>
    </div>
  );
};

export default OrderFormItemsSection;
