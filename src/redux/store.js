import { combineReducers, createStore } from 'redux';
import chart from './player/reducer';
import player from './player/reducer';

const reducers = combineReducers({
  chart,
  player,
});

const store = createStore(reducers, {});

export default store;
