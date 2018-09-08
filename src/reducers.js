import { combineReducers } from 'redux';
import { drizzleReducers } from 'drizzle';
import memeReducer from './memes/meme.reducer';

export default combineReducers({
  ...drizzleReducers,
  memes: memeReducer,
});
