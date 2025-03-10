import axios from "axios";
import JSONBigInt from "json-bigint";
import { persistor } from "../store";

const getTokenFromLocalStorage = () => {
  const userDetails = JSON.parse(localStorage.getItem("user"))
  if (userDetails) {
    return userDetails.token;
  }
  return null;
}

export const commonHeaders = {
  "Content-Type": "application/json",
};

export default function ApiCall({ method, url, data, params, headers = null }) {
  const token = getTokenFromLocalStorage();

  if (token) {
    commonHeaders["Authorization"] = `${token}`;
  }

  const newHeader = headers ? { ...commonHeaders, ...headers } : commonHeaders;
  const http = axios.create({
    baseURL: url,
    headers: newHeader,
    withCredentials: true,
    transformResponse: [
      function (data) {
        try {
          return JSONBigInt.parse(data, { storeAsString: false });
        } catch (err) {
          console.log(`Response parsing error on url "${url}"`);
          return data;
        }
      },
    ],
  });

  // Add response interceptor for handling token expiration errors
  http.interceptors.response.use(
    (response) => {
      console.log("response", response);
      return response;
    },
    (error) => {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      if (status === 404 && message === "Invalid or expired token.") {
        // persistor.purge();
        persistor.flush();
        window.localStorage.clear();
        window.location.replace("/signin");
      }

      return Promise.reject(error);
    }
  );


  return new Promise(async (resolve) => {
    try {
      const response = await http({ method, url, data, params });
      resolve({ success: true, status: response.status, data: response.data });
    } catch (error) {
      let status = error?.response?.status || "";
      let responseData = error?.response?.data || null;
      let message = responseData?.error || "Something went wrong";

      if (!status) {
        message = "Network Error. Are you offline?";
      }

      resolve({ success: false, status, message, data: responseData });
    }
  });
}
