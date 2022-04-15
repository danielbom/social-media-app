import _axios, { Axios } from 'axios';
import config from '../../config';
import { injectAxiosDebug } from '../../utils/injectAxiosDebug';

const axios: Axios = _axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

injectAxiosDebug(axios);

export default axios;
