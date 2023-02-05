import axios from 'axios';
import jwtDecode from 'jwt-decode';
import dayJs from 'dayjs';

import store from '../redux/store';
import { refreshToken } from '../redux/actions/userAction';

export class Http {
  constructor(status) {
    this.withAuth = status && status.withAuth ? status.withAuth : false;
    this.instance = axios.create({ baseURL: 'http://localhost:4000/api', withCredentials: true });
    return this.init();
  }

  init() {
    if (this.withAuth) {
      const state = store.getState();
      const dispatch = store.dispatch;

      this.instance.interceptors.request.use((request) => {
        const accessToken = state.userReducer.accessToken || localStorage.getItem('accessToken');
        request.headers['Authorization'] = 'Bearer ' + accessToken;
        localStorage.removeItem('accessToken');
        return request;
      });

      this.instance.interceptors.response.use(
        (response) => {
          return response;
        },
        async (error) => {
          const originalRequest = error.config;
          if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // the dispath return accessToken that refreshToken actionCreator's returned
            const accessToken = await dispatch(refreshToken());
            if (accessToken) {
              localStorage.setItem('accessToken', accessToken);
              return this.instance(originalRequest);
            }
          }
          return Promise.reject(error);
        },
      );
    }

    return this.instance;
  }
}
