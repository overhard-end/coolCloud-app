import authService from '../../services/authService';
import { USER_MESSAGE, SET_USER, LOGOUT, REFRESH_TOKEN } from './types';

export const getUserCredentials = () => async (dispatch) => {
  const response = await authService.getUserCredentials();
  if (response.status === 200) {
    dispatch({ type: SET_USER, payload: response.data });
    return true;
  }
  return false;
};

export const refreshToken = () => async (dispatch) => {
  const response = await authService.refreshToken();
  if (response.status === 201) {
    const action = dispatch({ type: REFRESH_TOKEN, payload: response.data.accessToken });
    return action.payload;
  }
};

export const login = (email, password) => async (dispatch) => {
  authService.login(email, password).then(
    (response) => {
      dispatch({ type: SET_USER, payload: response.data });
    },
    (error) => {
      dispatch({ type: USER_MESSAGE, payload: error.response.data.message });
      return Promise.reject();
    },
  );
};

export const registration = (email, password) => async (dispatch) => {
  authService.registration(email, password).then(
    (response) => {
      dispatch({ type: SET_USER, payload: response.data });
    },
    (error) => {
      dispatch({ type: USER_MESSAGE, payload: error.response.data.message });
      return Promise.reject();
    },
  );
};

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};
