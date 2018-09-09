import * as types from '../types';

export function addMeme(address) {
  return {
    type: types.ADD_MEME,
    payload: address
  };
}

export function noop() {
  return;
}