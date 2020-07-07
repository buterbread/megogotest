export const initialState = {
  currentBandWidth: null,
  estimatedBandWidth: null,
  bufferSize: null,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_START: {
      return {
        ...state,
        loading: true,
      };
    }
    default:
      return state;
  }
}

export default reducer;
