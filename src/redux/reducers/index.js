import { combineReducers } from '@reduxjs/toolkit';
import pesertaReducer from './pesertaSlice';

const rootReducer = combineReducers({
  peserta: pesertaReducer,
});

export default rootReducer;
