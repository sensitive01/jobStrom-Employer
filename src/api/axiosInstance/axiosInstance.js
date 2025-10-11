import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: ` ${import.meta.env.VITE_BASE_ROUTE_JOBSTORM}`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log("Error in Axios interceptor request", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
