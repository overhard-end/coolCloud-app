const initialState = {
  email: '',
  role: '',
  isAuth: localStorage.getItem('accessToken') ? true : false,
  accessToken: localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : null,
  errorMessage: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        email: action.payload.email,
        role: action.payload.role,
        accessToken: action.payload.accessToken,
        isAuth: true,
      };
    case 'REGISTER':
      return {
        ...state,
        email: action.payload.email,
        role: action.payload.role,
        accessToken: action.payload.accessToken,
        isAuth: true,
      };
    case 'LOGOUT':
      return {
        ...state,
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
