import { combineReducers } from 'redux';
import uploadReducer from './reducers/uploadReducer';
import filesReducer from './reducers/filesReducer';

const rootReducer = combineReducers({
  filesReducer,
  uploadReducer,
});
export default rootReducer;
