const initialState = {
  email: '',
  role: '',
  isAuth: false,
  accessToken: '',
  errorMessage: '',
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INITIALIZE':
      const access = localStorage.getItem('token');
      return {
        ...state,
        accessToken: access ? access : null,
      };
    case 'LOGIN':
      console.log('LOGIN');
      return {
        ...state,
        email: action.payload.email,
        role: action.payload.role,
        accessToken: action.payload.accessToken,
        isAuth: true,
      };
    case 'ERROR':
      return {
        ...state,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
};
export default userReducer;
