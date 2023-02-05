import { SET_USER, LOGOUT, USER_MESSAGE, REFRESH_TOKEN } from '../actions/types';
const initialState = {
  id: '',
  email: '',
  role: '',
  accessToken: '',
  errorMessage: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        id: action.payload.id,
        email: action.payload.email,
        role: action.payload.role,
        accessToken: action.payload.accessToken,
      };
    case REFRESH_TOKEN:
      return {
        ...state,
        accessToken: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        id: '',
        email: '',
        role: '',
        accessToken: '',
      };
    case USER_MESSAGE:
      return {
        ...state,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
};
export default userReducer;
