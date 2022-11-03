import * as Yup from 'yup';
import i18n from '../config/i18n';

export const EmailValidator = Yup.string()
  .email(() => i18n.t('LOGIN.EMAIL_INVALID'))
  .required(() => i18n.t('LOGIN.EMAIL_REQUIRED'));

export const PasswordValidator = Yup.string()
  .min(8, () => i18n.t('LOGIN.PASSWORD_MIN'))
  .required(() => i18n.t('LOGIN.PASSWORD_REQUIRED'));

export const CompanyNameValidator = Yup.string().required(() =>
  i18n.t('ORDER_FORM.COMPANY_NAME_REQUIRED')
);

export const CompanyStreetValidator = Yup.string().required(() =>
  i18n.t('ORDER_FORM.COMPANY_STREET_REQUIRED')
);

export const CompanyPostalCodeValidator = Yup.string().required(() =>
  i18n.t('ORDER_FORM.COMPANY_POSTAL_CODE_REQUIRED')
);

export const CompanyCityValidator = Yup.string().required(() =>
  i18n.t('ORDER_FORM.COMPANY_CITY_REQUIRED')
);

export const CompanyCountryValidator = Yup.string().required(() =>
  i18n.t('ORDER_FORM.COMPANY_COUNTRY_REQUIRED')
);

export const CompanyPhoneValidator = Yup.string().test(
  'phonePattern',
  () => i18n.t('ORDER_FORM.COMPANY_PHONE_PATTERN'),
  value => /^[+]?[\d]{9,}$/.test(value) || value === undefined
);

export const CompanyEmailValidator = Yup.string().email(() =>
  i18n.t('ORDER_FORM.COMPANY_EMAIL_PATTERN')
);

export const BdoValidator = (required: boolean) => {
  if (required) {
    return Yup.number()
      .required(() => i18n.t('ORDER_FORM.FIELD_EMPTY_BDO'))
      .typeError(i18n.t('ORDER_FORM.BDO_MUST_BE_NUMBER'));
  }
  return Yup.number().typeError(i18n.t('ORDER_FORM.BDO_MUST_BE_NUMBER'));
};

export const NipValidator = Yup.string()
  .required(() => i18n.t('ORDER_FORM.COMPANY_NIP_REQUIRED'))
  .test(
    'nipPattern',
    () => i18n.t('ORDER_FORM.COMPANY_NIP_PATTERN'),
    value => /^[0-9]{10}$/.test(value)
  );

export const KrsValidator = Yup.string().test(
  'krsPattern',
  () => i18n.t('ORDER_FORM.COMPANY_KRS_PATTERN'),
  value => /^[0-9]{10}$/.test(value) || value === undefined
);

export const RegonValidator = Yup.string().test(
  'regonPattern',
  () => i18n.t('ORDER_FORM.COMPANY_REGON_PATTERN'),
  value =>
    /^[0-9]{9}$/.test(value) || /^[0-9]{14}$/.test(value) || value === undefined
);

export const AvailableHoursFromValidator = Yup.string().required(() =>
  i18n.t('ORDER_FORM.AVAILABLE_HOURS_REQUIRED')
);

export const AvailableHoursToValidator = Yup.string().required(() =>
  i18n.t('ORDER_FORM.AVAILABLE_HOURS_REQUIRED')
);

export const ContactPhoneValidator = Yup.string()
  .required(() => i18n.t('ORDER_FORM.CONTACT_PHONE_REQUIRED'))
  .test(
    'phonePattern',
    () => i18n.t('ORDER_FORM.CONTACT_PHONE_PATTERN'),
    value => /^[+]?[\d]{9,}$/.test(value)
  );

export const PickUpPlaceStreetValidator = Yup.string().required(() =>
  i18n.t('ORDER_FORM.PICK_UP_PLACE_STREET_REQUIRED')
);

export const PickUpPlacePostalCodeValidator = Yup.string()
  .test(
    'postalCodePattern',
    () => i18n.t('ORDER_FORM.PICK_UP_PLACE_POSTAL_CODE_PATTERN'),
    value => /^[0-9]{2}[-]?[0-9]{3}$/.test(value)
  )
  .required(() => i18n.t('ORDER_FORM.COMPANY_POSTAL_CODE_REQUIRED'));

export const PickUpPlaceCityValidator = Yup.string().required(() =>
  i18n.t('ORDER_FORM.PICK_UP_PLACE_CITY_REQUIRED')
);

export const PickUpPlaceCountryValidator = Yup.string().required(() =>
  i18n.t('ORDER_FORM.PICK_UP_PLACE_COUNTRY_REQUIRED')
);

export const RecycleUuidValidator = Yup.string().required(() =>
  i18n.t('ORDER_FORM.RECYCLE_UUID_REQUIRED')
);

export const RecycleUnitValidator = Yup.string().required(() =>
  i18n.t('ORDER_FORM.PACKAGE_UNIT_REQUIRED')
);

export const RecycleValueValidator = Yup.string()
  .test(
    'valuePattern',
    () => i18n.t('ORDER_FORM.RECYCLE_VALUE_INVALID'),
    value => /^[1-9]([0-9]+)?$/.test(value)
  )
  .required(() => i18n.t('ORDER_FORM.RECYCLE_VALUE_REQUIRED'));

export const PackageUnitValidator = Yup.string().required(() =>
  i18n.t('ORDER_FORM.PACKAGE_UNIT_REQUIRED')
);

export const PackageUuidValidator = Yup.string().required(() =>
  i18n.t('ORDER_FORM.PACKAGE_UUID_REQUIRED')
);

export const PackageNameValidator = Yup.string().required(() =>
  i18n.t('ORDER_FORM.PACKAGE_NAME_REQUIRED')
);

export const PackageValueDecimalValidator = Yup.string()
  .test(
    'valuePattern',
    () => i18n.t('ORDER_FORM.PACKAGE_VALUE_DECIMAL_INVALID'),
    value => /^(?!0\d|$)\d*([.]\d{1,3})?$/.test(value)
  )
  .test(
    'valuePatternZero',
    () => i18n.t('ORDER_FORM.PACKAGE_VALUE_DECIMAL_INVALID'),
    value => value !== '0'
  )
  .required(() => i18n.t('ORDER_FORM.PACKAGE_VALUE_REQUIRED'));

export const PackageValueIntValidator = Yup.string()
  .test(
    'valuePattern',
    () => i18n.t('ORDER_FORM.PACKAGE_VALUE_INT_INVALID'),
    value => /^[1-9]([0-9]+)?$/.test(value)
  )
  .required(() => i18n.t('ORDER_FORM.PACKAGE_VALUE_REQUIRED'));

export const SuggestedDateValidator = Yup.string().required(() =>
  i18n.t('ORDER_FORM.SUGGESTED_DATE_REQUIRED')
);

export const StringValidator = Yup.string().required(() =>
  i18n.t('LOGIN.FIELD_EMPTY')
);

export const NumberValidator = Yup.number().required(() =>
  i18n.t('LOGIN.FIELD_EMPTY')
);

export const PhoneValidator = Yup.string()
  .min(9, () => i18n.t('PROFILE.PHONE_MIN_LENGTH'))
  .test(
    'phonePattern',
    () => i18n.t('PROFILE.PHONE_REQUIRED'),
    value => /^[+]?[\d]{9,}$/.test(value)
  )
  .required(() => i18n.t('PROFILE.PHONE_REQUIRED'));

export const PhoneValidatorRequired = Yup.string().required(() =>
  i18n.t('PROFILE.PHONE_REQUIRED')
);

export const reporter = (field, session) => {
  if (session) {
    return Yup.string();
  }
  if (!session && field === 'email') {
    return Yup.string()
      .email(() => i18n.t('LOGIN.EMAIL_INVALID'))
      .required(() => i18n.t('LOGIN.EMAIL_REQUIRED'));
  }
  return Yup.string().required(() =>
    i18n.t(`ORDER_FORM.REPORTER_${field.toUpperCase()}_REQUIRED`)
  );
};

export const phoneValid = (field, contact) => {
  if (!contact) {
    return Yup.string();
  }
  return Yup.string().required(() =>
    i18n.t(`PROFILE.${field.toUpperCase()}_REQUIRED`)
  );
};
