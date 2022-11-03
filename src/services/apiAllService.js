import { toJS } from 'mobx';
import axios from 'axios';
import { API_URL } from '../config/api';
import authStore from '../stores/authStore';
import { sentryErrorSend } from '../utils/sentryError';

axios.defaults.withCredentials = true;

async function fetchAll(items) {
  const requestsArray = items.map(item => {
    const request = {
      method: item.method,
      url: API_URL + item.path
    };
    if (item.body) {
      request.data = item.body;
    }
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
    return axios(request);
  });

  try {
    const responses = await axios.all(requestsArray);
    responses.map(response => {
      if (response.status === 401) {
        authStore.logoutAction();
      }
      if (response.status >= 400) {
        throw new Error(response.status);
      }
      return null;
    });
    return responses;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        authStore.logoutAction();
      } else if (error.response.status >= 400) {
        sentryErrorSend(requestsArray, error);
      }
      return { error: error.response.data, status: error.response.status };
    }
    return { error };
  }
}

export default {
  fetch: fetchAll
};
