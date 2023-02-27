import axios from 'axios';
import jwtDecode from 'jwt-decode';
import dayJs from 'dayjs';
import UserFront from '@userfront/react';

export class Http {
  constructor(status) {
    this.withAuth = status && status.withAuth ? status.withAuth : false;
    this.instance = axios.create({ baseURL: 'http://localhost:4000/api', withCredentials: true });
    return this.init();
  }

  init() {
    if (this.withAuth) {
      this.instance.interceptors.request.use((request) => {
        const accessToken = UserFront.accessToken();
        request.headers['Authorization'] = 'Bearer ' + accessToken;
        return request;
      });
      this.instance.interceptors.response.use(
        function (response) {
          return response;
        },
        async function (error) {
          const originalRequest = error.config;
          if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            await UserFront.tokens.refresh();
            return this.instance(originalRequest);
          }
        },
      );
    }

    return this.instance;
  }
}
