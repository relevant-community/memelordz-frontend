import { drizzle, BondingCurveContract } from '../eth/drizzle.config';

import * as types from '../types';

export function addMeme(address, fromBlock) {
  drizzle.addContract(BondingCurveContract, {
    name: address,
    address,
    events: [{
      eventName: 'StoreHash',
      eventOptions: {
        fromBlock
      }
    }]
  });

  return {
    type: types.ADD_MEME,
    payload: address
  };
}

export function noop() {
  return;
}