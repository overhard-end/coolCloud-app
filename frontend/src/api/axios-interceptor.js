import axios from 'axios';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      return (config.headers = {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      });
    }
    return config;
  },
  (error) => {
    console.log(error);
  },
);
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = 5;
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
      return axios(originalRequest);
    }
    return Promise.reject(error);
  },
);
