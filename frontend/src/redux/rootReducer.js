import { combineReducers } from 'redux';

import filesReducer from './reducers/filesReducer';

const rootReducer = combineReducers({
  filesReducer,
});
export default rootReducer;
