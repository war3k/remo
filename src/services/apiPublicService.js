import axios from 'axios';
import { API_URL } from '../config/api';
import { sentryErrorSend } from '../utils/sentryError';

axios.defaults.withCredentials = true;

async function fetchPublic(url, options) {
  const request = {
    method: options.method,
    url: API_URL + url,
    data: options.body,
    headers: { 'Content-Type': 'application/json' }
  };
  let response;
  try {
    response = await axios(request);
    if (response.status >= 400) {
      throw new Error(response.status);
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status >= 400) {
        sentryErrorSend(request, error);
      }
      return { error: error.response.data, status: error.response.status };
    }
    return { error };
  }
}

export default {
  fetch: fetchPublic
};
