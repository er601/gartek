import numeral from "numeral";
import moment from "moment";

import constants from "./constants";

export const _amountFormat = amount => {
  if (amount === undefined || amount === "" || amount === null)
    return numeral(0).format();
  return numeral(parseFloat(amount)).format();
};

export const dateTimeFormat = dt => {
  if (dt === undefined || dt === "" || dt === null) return "";
  return moment(dt).format(constants.DATE_TIME_FORMAT);
};

export const dateFormat = dt => {
  if (dt === undefined || dt === "" || dt === null) return "";
  return moment(dt).format(constants.DATE_FORMAT);
};

export const isEmptySting = str => {
  if (!str) return true;
  str = str.trim();
  return str.length === 0;
};

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function isExternalUrl(url) {
  if (!url) return false;
  if (
    url.startsWith("blob:") ||
    url.startsWith("data:") ||
    url.startsWith("//")
  )
    return true;
  return /^(https?:\/\/|www\.)/.test(url);
}

export const isDevMode = () => {
  return process.env.NODE_ENV === "development";
};

export const fileToBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result;
        resolve(base64);
      };
    }catch (e) {
      reject(e);
    }
  })
};
