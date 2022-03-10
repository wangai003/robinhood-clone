import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import session from './session'
import bankReducer from './bank'
import bpReducer from './bp'
import stocksReducer from './stocks';
import watchlistReducer from './watchlist';
import assetsReducer from './assets';

const rootReducer = combineReducers({
  session,
  stocks: stocksReducer,
  bank: bankReducer,
  watchlist: watchlistReducer,
  bp: bpReducer,
  assets: assetsReducer
});

let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = preloadedState => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
