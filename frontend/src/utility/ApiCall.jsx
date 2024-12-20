import axios from "axios";
import JSONBigInt from "json-bigint";
//import createNotification from '../../components/common/createNotification'
//import { version as APP_VERSION } from '../../utility/getAppInfo'
//import { baseURL as bURL } from '../../config/api'
//import { LOGOUT } from '../../action/auth'

export const commonHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  // 'X-Client-Type': 'DesktopApp',
  // 'X-Client-Language': 'ENGLISH',
  // 'X-Client-Platform': 'Web',
  // 'X-User-Agent': (navigator || {}).userAgent || 'Google Chrome',
  // 'X-Client-Version': APP_VERSION,
  // 'X-Requested-At': Date.now(),
  // // Accept: 'application/json',
};

/**
 * This method is a wrapper around axios to do generic calls
 * @param {Object} apiConfig
 * @param {string} apiConfig.method ('get','post','delete','put','patch')
 * @param {Object} apiConfig.headers http headers config
 * @param {string} apiConfig.baseURL baseURL of api, default value will be set by environment variable
 * @param {string} apiConfig.url endpoint of api
 * @param {Object} apiConfig.data data to send in body
 * @param {Object} apiConfig.params data to send as queryParam
 * @return Promise
 */
export default function ApiCall({ method, url, data, params, headers = null }) {
  const newHeader = headers ? { ...commonHeaders, ...headers } : commonHeaders;
  const http = axios.create({
    baseURL: url,
    headers: newHeader,
    // timeout: 30000,
    withCredentials: true,
    transformResponse: [
      function (data) {
        try {
          const parsedData = JSONBigInt.parse(data, { storeAsString: false });
          return parsedData;
        } catch (err) {
          console.log(`Response parsing error on url "${url}"`);
        }
      },
    ],
  });
  const networkRequest = new Promise(async (resolve, reject) => {
    try {
      const response = await http({
        method,
        url,
        data,
        params,
      });

      if (response.status === 200) {
        //console.log("API call success response", response);
        resolve(response);
      } else {
        throw new Error({
          status: response.status,
          message: "Something bad happened",
        });
      }
    } catch (error) {
      //console.error("error response", error.response);
      let message = "";
      if (error.response) {
        switch (error.response.status) {
          case 400:
            message = error.response?.data?.message;
            break;
          case 401:
            sessionStorage.clear();
            localStorage.clear();
            //dispatch({ type: LOGOUT })
            //createNotification('error', 'Access Denied', 'Please contact admin')
            message = "Access Denied. Please contact admin.";
            break;
          case 403:
            message = "Bad Request";
            break;
          case 404:
            message = "Resource not found";
            break;
          case 500:
          case 501:
          case 502:
          case 503:
          case 504:
            message = "Server Error";
            break;
          default:
            message = "Something bad happens, we will be right back.";
            break;
        }
        reject({
          status: error?.response?.status,
          response: error?.response,
          message,
        });
      } else {
        reject({
          status: "",
          message: "Network Error",
          response: "Are you offline?",
        });
      }
    }
  });
  return networkRequest;
}
