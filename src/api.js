import axios from "axios";

axios.interceptors.response.use(
  (success) => {
    if (success.status && success.status === 200) {
      if (success.data.code !== 200) {
        alert(["Failure!", " ", success.data.message].join(""));
        return success.data.object;
      }
      if (success.data.message) {
        alert(success.data.message);
      }
    }
    return success.data.object;
  },
  (error) => {
    if (error.response.data.message) {
      alert(["Failure!", " ", error.response.data.message].join(""));
    } else {
      alert("Failure!...");
    }
    return null;
  }
);

const base = "http://127.0.0.1:5000";

export const postRequest = (url, params) => axios.post(`${base}${url}`, params);

export const putRequest = (url, params) => axios.put(`${base}${url}`, params);

export const getRequest = (url, params) => axios.get(`${base}${url}`, params);

export const deleteRequest = (url, params) => axios.delete(`${base}${url}`, params);
