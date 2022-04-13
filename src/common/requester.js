import axios from "axios";
import appStore from "../store/AppStore";
import {isDevMode} from "./utils";


const isDev = isDevMode();

export const BASE_URL = CONFIG.API_URL;

// axios.defaults.baseURL = BASE_URL;
axios.defaults.responseType = "json";
axios.defaults.timeout = isDev ? 90000 : 30000;

async function request(method, url, data, params, silent = false) {
  if (!silent) appStore.setBusy(true);
  const token = appStore.token;
  data = data || {};
  let headers = {"Content-Type": "application/json", 'Access-Control-Allow-Origin': '*'};
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  try {
    let res = await axios.request({method, url, data, params, headers});
    return res.data;
  } catch (error) {
    console.warn(error);
    if (!silent) {
      appStore.setAlert("error", error.message);
    }
    return Promise.reject(error);
  } finally {
    appStore.setBusy(false);
  }
}

const requester = {
  get: function (url, params = null, silent = false) {
    return request("get", BASE_URL + url, null, params, silent);
  },
  post: function (url, data = null, silent = false) {
    return request("post", BASE_URL + url, data, null, silent);
  },
  put: function (url, data = null, params = null, silent = false) {
    return request("put", BASE_URL + url, data, params, silent);
  },
  delete: function (url, params = null, silent = false) {
    return request("delete", BASE_URL + url, null, params, silent);
  }
};

export default requester;
