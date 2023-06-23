import axios from "axios";


axios.defaults.headers.post["Content-Type"] = "application/json"
axios.defaults.headers.get["Content-Type"] = "application/json"

export const Axios = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL
});
