// api.js
import { gltAPI } from "./interceptor";

const postApi = async (api, payload, headers = {}) => {
  return gltAPI()
    .post(api, payload, { headers })
    .then((res) => res)
    .catch((err) => {
      console.log("err", err);
      return err.response;
    });
};

const getApi = async (api, payload) => {
  return gltAPI()
    .get(api, payload)
    .then((res) => res)
    .catch((err) => {
      console.log("err", err);
      return err.response;
    });
};

const putApi = async (api, payload) => {
  return gltAPI()
    .put(api, payload)
    .then((res) => res)
    .catch((err) => {
      console.log("err", err);
      return err.response;
    });
};

const deleteApi = async (api, payload) => {
  return gltAPI()
    .delete(api, payload)
    .then((res) => res)
    .catch((err) => {
      console.log("err", err);
      return err.response;
    });
};

const fileApi = async ({ api, payload, options }) => {
  try {
    return await gltAPI().post(api, payload, options);
  } catch (error) {
    return error.response || error;
  }
};

const fileApiGet = async ({ api, payload, options }) => {
  try {
    return await gltAPI().get(api, payload, options);
  } catch (error) {
    return error.response || error;
  }
};

const Api = {
  postApi,
  getApi,
  putApi,
  deleteApi,
  fileApi,
  fileApiGet,
};

export default Api;
