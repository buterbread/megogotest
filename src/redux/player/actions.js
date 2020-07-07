export const setStreamBandwidth = (data) => ({
  type: 'SET_CURRENT_BANDWIDTH',
  payload: data,
});

export const setEstimatedBandwidth = (data) => ({
  type: 'SET_ESTIMATED_BANDWIDTH',
  payload: data,
});

export const setBufferSize = (data) => ({
  type: 'SET_BUFFER_SIZE',
  payload: data,
});

export const toggleBuffering = (data) => ({
  type: 'TOGGLE_BUFFERING',
  payload: data,
});

export const togglePlaying = (data) => ({
  type: 'TOGGLE_PLAYING',
  payload: data,
});

export const setCurrentTime = (data) => ({
  type: 'SET_CURRENT_TIME',
  payload: data,
});
