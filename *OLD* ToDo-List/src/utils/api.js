//axios is a JS library that is used to make http requests
import axios from "axios";

//create an axios instance - similar to a query client
const api = axios.create(
  {
    baseURL:"https://todo-api-zlkh.onrender.com/api"
  }
)

//authentication

export const registerUser = async (formData) => {
  const res = await api.post("/auth/register", formData);
  return {
    message: res.data.message,
    user: res.data.user,
  };
};

export const loginUser = async (formData) => {
  const res = await api.post("/auth/login", formData);
  return {
    message: res.data.message,
    user: res.data.user,
  };
};

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return {
    message: res.data.message
  }
}

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return {
    message: res.data.message
  }
}
