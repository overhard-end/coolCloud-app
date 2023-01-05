import axios from 'axios';

export function login(email, password) {
  return async (dispatch) => {
    try {
      if (!email || !password) return null;
      const response = await axios.post('http://localhost:4000/api/login', {
        email: email,
        password: password,
      });
      if (response.status === 403) return dispatch({ type: 'ERROR', payload: response.message });

      if (response.status === 200) return dispatch({ type: 'LOGIN', payload: response.data });
    } catch (error) {}
  };
}
