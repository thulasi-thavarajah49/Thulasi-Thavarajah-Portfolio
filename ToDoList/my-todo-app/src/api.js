import axios from "axios";

const api = axios.create({
  baseURL: "https://todo-api-zlkh.onrender.com",
  withCredentials: true,
});

export default api;