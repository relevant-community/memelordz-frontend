import { combineReducers } from 'redux';
import { drizzleReducers } from 'drizzle';
import memeReducer from './memes/meme.reducer';
import ethReducer from './eth/eth.reducer';

export default combineReducers({
  ...drizzleReducers,
  memes: memeReducer,
  eth: ethReducer,
});
