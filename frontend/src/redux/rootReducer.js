import { combineReducers } from 'redux';
import sideBarReducer from './reducers/sideBarReducer';
import folderReducer from './reducers/filesReducer';
import userReducer from './reducers/userReducer';

const rootReducer = combineReducers({
  folderReducer,
  sideBarReducer,
  userReducer,
});
export default rootReducer;
