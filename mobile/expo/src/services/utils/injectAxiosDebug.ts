import _axios, { Axios } from 'axios';
import config from '../config';

function getRequestResult(response: any) {
  const method = response.config.method.toUpperCase();
  const url = (response.config.baseURL || '') + response.config.url;
  const { status, statusText, data } = response;
  return { method, url, status, statusText, data };
}

export function injectAxiosDebug(axios: Axios): void {
  if (config.isDevelopment) {
    axios.interceptors.response.use(
      response => {
        console.log(getRequestResult(response));
        return response;
      },
      error => {
        if (_axios.isAxiosError(error) && error.response?.config) {
          console.error(getRequestResult(error.response));
        } else {
          console.error(error);
        }
        throw error;
      },
    );
  }
}
