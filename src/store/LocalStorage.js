const save = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const get = (key, defaultValue = null) => {
  try {
    let value = localStorage.getItem(key);
    if (!value) {
      return defaultValue;
    }
    return JSON.parse(value);
  } catch (e) {
    console.log("Storage:get", e);
  }
  return null;
};

const remove = key => {
  localStorage.removeItem(key);
};

const clear = () => {
  try {
    localStorage.clear();
  } catch (e) {
    console.log("Storage:clear", e);
  }
};

export default {
  save,
  get,
  remove,
  clear
};
