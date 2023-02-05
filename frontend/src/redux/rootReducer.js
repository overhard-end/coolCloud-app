import { combineReducers } from 'redux';
import sideBarReducer from './reducers/sideBarReducer';
import filesReducer from './reducers/filesReducer';
import userReducer from './reducers/userReducer';

const rootReducer = combineReducers({
  filesReducer,
  sideBarReducer,
  userReducer,
});
export default rootReducer;
