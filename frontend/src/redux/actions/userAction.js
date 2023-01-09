import api from '../../api/api';

export function login(email, password) {
  return async (dispatch) => {
    try {
      if (!email || !password) return null;
      const response = await api.post(`/login`, {
        email: email,
        password: password,
      });
      if (response.status === 200) {
        localStorage.clear();
        localStorage.setItem('refreshToken', response.data.refreshToken, { httpOnly: true });
        localStorage.setItem('accessToken', response.data.accessToken);
        return dispatch({ type: 'LOGIN', payload: response.data });
      }
    } catch (error) {
      if (error.response.status === 403) {
        dispatch({ type: 'ERROR', payload: error.response.data.message });
      }
    }
  };
}
export function registration(user) {
  return async (dispatch) => {
    try {
      if (!user.email || !user.password) return null;
      const response = await api.post(`/register`, {
        email: user.email,
        password: user.password,
      });
      if (response.status === 201) {
        localStorage.clear();
        localStorage.setItem('refreshToken', response.data.refreshToken, { httpOnly: true });
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      return dispatch({ type: 'REGISTER', payload: response.data });
    } catch (error) {
      if (error.response.status === 403) {
        dispatch({ type: 'ERROR', payload: error.response.data.message });
      }
    }
  };
}
