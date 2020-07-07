export const initialState = {
  streamBandwidth: null,
  estimatedBandwidth: null,
  bufferSize: null,
  isBuffering: false,
  isPlaying: false,
  playbackTime: null,
  currentTime: null,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_CURRENT_BANDWIDTH': {
      return {
        ...state,
        streamBandwidth: action.payload,
      };
    }
    case 'SET_ESTIMATED_BANDWIDTH': {
      return {
        ...state,
        estimatedBandwidth: action.payload,
      };
    }
    case 'SET_BUFFER_SIZE': {
      return {
        ...state,
        bufferSize: action.payload,
      };
    }
    case 'TOGGLE_BUFFERING': {
      return {
        ...state,
        isBuffering: action.payload,
      };
    }
    case 'TOGGLE_PLAYING': {
      return {
        ...state,
        isPlaying: action.payload,
      };
    }
    case 'SET_CURRENT_TIME': {
      return {
        ...state,
        currentTime: action.payload,
      };
    }
    default:
      return state;
  }
}

export default reducer;
