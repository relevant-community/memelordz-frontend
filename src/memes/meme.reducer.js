import * as types from '../types';

const initialState = {
  fetching: [],
  all: []
};

export default function memeReducer(state = initialState, action) {
  // console.log(action.type);
  switch (action.type) {
    case types.ADD_MEME:
      return {
        ...state,
        all: [
          ...(new Set([action.address, ...state.all]))
        ]
      };

    default:
      return state;
  }
}
