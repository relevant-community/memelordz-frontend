import { combineReducers } from 'redux';
import memeReducer from './memes/meme.reducer';

export default combineReducers({
  memes: memeReducer
});
