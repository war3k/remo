import { toJS } from 'mobx';
import axios from 'axios';
import moment from 'moment';
import { API_URL } from '../config/api';
import authStore from '../stores/authStore';
import { sentryErrorSend } from '../utils/sentryError';

axios.defaults.withCredentials = true;

async function fetchIt(url, options) {
  const request = {
    method: options.method,
    url: API_URL + url,
    data: options.body
  };
  if (toJS(authStore.session)) {
    request.headers = {
      'Content-Type': 'application/json',
      'X-Xsrftoken': toJS(authStore.session).xsrfToken
    };
  } else {
    request.headers = {
      'Content-Type': 'application/json'
    };
  }

  if (toJS(authStore.expireDate)) {
    authStore.expireDate = moment()
      .add(30, 'm')
      .format('x');
    sessionStorage.setItem('expiredDate', JSON.stringify(authStore.expireDate));
  }

  let response;
  try {
    response = await axios(request);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        authStore.logoutAction();
      } else if (error.response.status >= 400) {
        sentryErrorSend(request, error);
      }
      return { error: error.response.data, status: error.response.status };
    }
    return { error };
  }
}

export default {
  fetch: fetchIt
};
