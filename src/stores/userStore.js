// @flow
import { action, configure, flow, observable } from 'mobx';
import userService from '../services/userService';
import i18n from '../config/i18n';

configure({ enforceActions: 'observed' });

class UserStore {
  // STORE
  @observable pending: boolean = false;

  @observable locale: string;

  @observable initialized: boolean = false;

  @observable customer: any;

  @observable customerCompanies: any;

  @observable customerCompaniesBranches: any;

  @action
  forgotPasswordAction = flow(function*(data) {
    this.pending = true;
    const result = yield userService.forgotPassword(data);
    this.pending = false;
    if (result.error) {
      return false;
    }
    return true;
  });

  getCustomerAction = flow(function*(data) {
    this.pending = true;
    const result = yield userService.getCustomer(data);

    this.pending = false;
    if (result.error) {
      return false;
    }
    this.customer = result.customer;
    if (result.customer.ccIds) {
      this.getCustomerCompanyAction(result.customer.ccIds);
      this.getCustomerCompanyBranchAction(result.customer.ccIds[0]);
    }

    return true;
  });

  @action
  getCustomerCompanyAction = flow(function*(files) {
    this.pending = true;
    const result = yield userService.getCustomerCompany(files);
    this.pending = false;
    if (result.error) {
      return false;
    }
    this.customerCompanies = result;
    return true;
  });

  @action
  getCustomerCompanyBranchAction = flow(function*(id) {
    this.pending = true;
    const result = yield userService.getCustomerCompanyBranch(id);
    this.pending = false;
    if (result.error) {
      return false;
    }
    this.customerCompaniesBranches = result.branches;
    return true;
  });

  @action
  deleteCustomer = () => {
    this.customerCompanies = null;
    this.customer = null;
  };

  @action
  getInitialLocaleAction() {
    const locale = localStorage.getItem('@REMLocale');
    if (locale != null) {
      this.setLocaleAction(locale);
    } else {
      this.setLocaleAction('en');
    }
    this.initialized = true;
  }

  setLocaleAction(locale) {
    localStorage.setItem('@REMLocale', locale);
    i18n.changeLanguage(locale);
    this.locale = locale;
  }

  @action
  changePasswordAction = flow(function*(data) {
    this.pending = true;
    const result = yield userService.changePassword(data);
    this.pending = false;
    if (result.error) {
      return false;
    }
    return true;
  });

  @action
  setPasswordAction = flow(function*(data) {
    this.pending = true;
    const result = yield userService.setPassword(data);
    this.pending = false;
    if (result.error) {
      return false;
    }
    return true;
  });

  @action
  editCustomerAction = flow(function*(data) {
    this.pending = true;
    const result = yield userService.editCustomer(data);
    this.pending = false;
    if (result.error) {
      return false;
    }
    return true;
  });
}

export default new UserStore();
