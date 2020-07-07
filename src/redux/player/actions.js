import {
  LOAD,
  LOAD_START,
  LOAD_SUCCESS,
  LOAD_FAIL,
} from './constants';

export const load = () => ({
  type: LOAD,
});

export const loadStart = () => ({
  type: LOAD_START,
});

export const loadSuccess = (config) => ({
  type: LOAD_SUCCESS,
  payload: config,
});

export const loadFail = (error) => ({
  type: LOAD_FAIL,
  payload: error,
});
