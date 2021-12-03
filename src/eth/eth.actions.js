import * as types from '../types';

export function setEthPrice(price) {
  return {
    type: types.SET_ETH_PRICE,
    price
  };
}
