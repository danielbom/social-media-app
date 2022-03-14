import _axios from "axios";

function getRequestResult(response) {
    const method = response.config.method.toUpperCase();
    const url = (response.config.baseURL || "") + response.config.url;
    const { status, statusText, data } = response;
    return { method, url, status, statusText, data };
}

export function injectAxiosDebug(axios) {
    axios.interceptors.response.use(
        (response) => {
            console.log(getRequestResult(response));
            return response;
        },
        (error) => {
            if (_axios.isAxiosError(error)) {
                console.error(getRequestResult(error.response));
            } else {
                console.error(error);
            }
            throw error;
        }
    );
}
