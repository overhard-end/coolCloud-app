import { combineReducers } from 'redux';
import sideBarReducer from './reducers/sideBarReducer';
import folderReducer from './reducers/folderReducer';

const rootReducer = combineReducers({
  folderReducer,
  sideBarReducer,
});
export default rootReducer;
