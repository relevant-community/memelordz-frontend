import * as types from '../types';

const initialState = {
  price: null
};

export default function ethReducer(state = initialState, action) {
  // console.log(action.type);
  switch (action.type) {
    case types.SET_ETH_PRICE:
      return {
        ...state,
        price: action.price
      };
    default:
      return state;
  }
}
