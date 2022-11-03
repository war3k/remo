import REST from '../constants/rest';
import API from './apiService';
import API_ALL from './apiAllService';

const API_BASE = '/client/user';

export default class UserService {
  static async login(params) {
    const path = '/session';
    const body = {
      email: params.email,
      password: params.password
    };
    const options = {
      method: REST.POST,
      body
    };
    return API.fetch(API_BASE + path, options);
  }

  static async logout() {
    const path = '/session';
    const options = {
      method: REST.DELETE
    };
    return API.fetch(API_BASE + path, options);
  }

  static async forgotPassword(params) {
    const path = '/forgot-password';
    const body = {
      email: params.email
    };
    const options = {
      method: REST.POST,
      body
    };
    return API.fetch(API_BASE + path, options);
  }

  static async getCustomer() {
    const path = '/profile';
    const options = {
      method: REST.GET
    };
    return API.fetch(API_BASE + path, options);
  }

  static async getCustomerCompany(ids) {
    const options = ids.map(uuid => ({
      method: REST.GET,
      path: `/client/user/customerCompany/${uuid}`
    }));
    return API_ALL.fetch(options);
  }

  static async getCustomerCompanyBranch(uuid) {
    const path = `/customerCompany/${uuid}/branches`;
    const options = {
      method: REST.GET
    };
    return API.fetch(API_BASE + path, options);
  }

  static async changePassword(params) {
    const path = '/change-password';
    const body = {
      password: params.password,
      password_new_repeat: params.confirmNewPassword,
      password_new: params.newPassword
    };
    const options = {
      method: REST.POST,
      body
    };
    return API.fetch(API_BASE + path, options);
  }

  static async setPassword(params) {
    const path = '/set-password';
    const body = {
      password: params.password,
      token: params.token
    };
    const options = {
      method: REST.POST,
      body
    };
    return API.fetch(API_BASE + path, options);
  }

  static async editCustomer(params) {
    const path = '/profile';
    const body = {
      name: params.name,
      surname: params.surname,
      phone: params.phone
    };
    const options = {
      method: REST.POST,
      body
    };
    return API.fetch(API_BASE + path, options);
  }
}
