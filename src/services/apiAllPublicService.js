import axios from 'axios';
import { API_URL } from '../config/api';
import { sentryErrorSend } from '../utils/sentryError';

axios.defaults.withCredentials = true;

async function fetchAllPublic(items) {
  const requestsArray = items.map(item => {
    const request = {
      method: item.method,
      url: API_URL + item.path,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (item.body) {
      request.data = item.body;
    }
    return axios(request);
  });

  try {
    const responses = await axios.all(requestsArray);
    responses.map(response => {
      if (response.status >= 400) {
        throw new Error(response.status);
      }
      return null;
    });
    return responses;
  } catch (error) {
    sentryErrorSend(requestsArray, error);
    return error;
  }
}

export default {
  fetch: fetchAllPublic
};
