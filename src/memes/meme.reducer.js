import * as types from '../types';

const initialState = {
  fetching: [],
  all: []
};

export default function memeReducer(state = initialState, action) {
  // console.log(action);
  switch (action.type) {
    case types.ADD_MEME: {
      return {
        ...state,
        all: [
          action.payload,
          ...state.all
        ]
      };
    }

    default:
      return state;
  }
}
