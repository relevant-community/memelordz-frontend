import * as types from '../types';

export function addMeme(address) {
  return {
    type: types.ADD_MEME,
    address
  };
}

export function addMemes(addresses) {
  return {
    type: types.ADD_MEMES,
    addresses
  };
}

export function noop() {
  return;
}
