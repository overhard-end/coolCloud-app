import { Http } from '../api/api';

class AuthService {
  async getUserCredentials() {
    return await new Http({ withAuth: true }).get('/user');
  }

  async registration(email, password) {
    return await new Http().post(`/register`, {
      email: email,
      password: password,
    });
  }

  async login(email, password) {
    return await new Http().post(`/login`, {
      email: email,
      password: password,
    });
  }
  async refreshToken() {
    return await new Http().post(`/token`);
  }
}
export default new AuthService();
