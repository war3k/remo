// @flow
import { action, configure, flow, observable } from 'mobx';
import moment from 'moment';
import userService from '../services/userService';

configure({ enforceActions: 'observed' });

class AuthStore {
  // STORE
  @observable session: any;

  @observable expireDate: any;

  @observable logged: boolean = false;

  @observable pending: boolean = false;

  // ACTIONS

  @action
  setSession = session => {
    this.session = session;
  };

  @action
  setLogged = logged => {
    this.logged = logged;
  };

  @action
  loginAction = flow(function*(credentials) {
    this.pending = true;
    const result = yield userService.login(credentials);
    this.pending = false;
    if (result.error && result.status === 403) {
      this.logoutAction();
      return { error: true, accessDenied: true };
    }
    if (result.error) {
      this.logoutAction();
      return { error: true, accessDenied: false };
    }
    const session = {
      uuid: result.user.uuid,
      fullname: result.user.fullname,
      email: result.user.email,
      xsrfToken: result.xsrfToken
    };

    this.expireDate = moment()
      .add(30, 'm')
      .format('x');

    this.session = session;
    this.setLogged(true);

    const intervalLogout = setInterval(async () => {
      const dateNow = moment().format('x');
      const result =
        sessionStorage.expiredDate && JSON.parse(sessionStorage.expiredDate);
      if (dateNow > result) {
        clearInterval(intervalLogout);
        this.setSession(null);
        sessionStorage.removeItem('expiredDate');
        sessionStorage.removeItem('@session');
      }
    }, 60000);

    sessionStorage.setItem('@session', JSON.stringify(this.session));
    sessionStorage.setItem('expiredDate', JSON.stringify(this.expireDate));

    return result;
  });

  @action
  autoLoginAction = () => {
    this.session = AuthStore.getSession();
  };

  @action
  logoutAction = flow(function*() {
    this.pending = true;
    if (this.session && this.session.xsrfToken) {
      yield userService.logout();
      this.setLogged(false);
    }
    this.session = null;
    sessionStorage.removeItem('@session');
    this.pending = false;
  });

  // UTILS

  static getSession() {
    if (sessionStorage.getItem('@session')) {
      return JSON.parse(sessionStorage.getItem('@session'));
    }
    return null;
  }
}

const authStore = new AuthStore();
export default authStore;
