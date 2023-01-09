import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true,
});

api.interceptors.request.use(async (req) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    req.headers.Authorization = `Bearer ${accessToken}`;
  }
  return req;
});

api.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    const status = error.response ? error.response.status : null;
    console.log(status);
    if (status === 401) {
      const response = await axios.post('http://localhost:4000/api/token', {
        refreshToken: localStorage.getItem('refreshToken'),
      });
      if (response.status === 201) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      console.log('refreshing token invalid response');
    }
    return Promise.reject(error);
  },
);

export default api;
