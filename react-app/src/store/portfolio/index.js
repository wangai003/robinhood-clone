import { TRADE_ASSETS, SELL_ALL_ASSETS } from './assets';
import { ADD_BANK_ACCOUNT, EDIT_BANK_ACCOUNT, REMOVE_BANK_ACCOUNT } from './bankAccount';
import { ADD_BP, SUBTRACT_BP } from './buyingPower';
import {
  CREATE_WATCHLIST,
  DELETE_WATCHLIST,
  EDIT_WATCHLIST,
  ADD_TO_WATCHLIST,
  DELETE_FROM_WATCHLIST,
} from './watchlist';

const LOAD_PORTFOLIO = 'portfolio/LOAD';

const load = portfolio => ({
  type: LOAD_PORTFOLIO,
  portfolio,
});

export const loadPortfolio = () => async dispatch => {
  const response = await fetch('/api/portfolio/');

  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return;
    }

    dispatch(load(data));
  }
};

export default function reducer(state = null, action) {
  let newState;
  switch (action.type) {
    case LOAD_PORTFOLIO:
      return action.portfolio;

    case TRADE_ASSETS:
      const buyState = state.assets;
      if (buyState[action.asset.id]) {
        buyState[action.asset.id].count = action.asset.count;
      } else buyState[action.asset.id] = action.asset;
      return { ...state, ...buyState };
    case SELL_ALL_ASSETS:
      const sellAllState = state.assets;
      if (sellAllState[action.id]) delete sellAllState[action.id];
      return { ...state, ...sellAllState };

    case REMOVE_BANK_ACCOUNT:
      newState = JSON.parse(JSON.stringify(state));
      delete newState.bank_accounts[action.payload];
      return newState;
    case EDIT_BANK_ACCOUNT:
      newState = JSON.parse(JSON.stringify(state));
      newState.bank_accounts[action.payload.id] = action.payload;
      return newState;
    case ADD_BANK_ACCOUNT:
      newState = JSON.parse(JSON.stringify(state));
      newState.bank_accounts[action.payload.id] = action.payload;
      return newState;

    case ADD_BP:
      newState = JSON.parse(JSON.stringify(state));
      newState.buying_power = action.payload;
      return newState;
    case SUBTRACT_BP:
      newState = JSON.parse(JSON.stringify(state));
      newState.buying_power = action.payload;
      return newState;

    case CREATE_WATCHLIST:
      console.log('HITTING CREATE');
      newState = JSON.parse(JSON.stringify(state));
      newState.watchlists[action.payload.id] = action.payload;
      return newState;
    case DELETE_WATCHLIST:
      newState = JSON.parse(JSON.stringify(state));
      // need to find the watchlist that i deleted and remove it
      delete newState.watchlists[action.payload.id];
      return newState;
    case EDIT_WATCHLIST:
      newState = JSON.parse(JSON.stringify(state));
      newState.watchlists[action.payload.id] = action.payload;
      return newState;
    case ADD_TO_WATCHLIST:
      newState = JSON.parse(JSON.stringify(state));
      newState.watchlists[action.watchlist.id].stocks[action.stock.id] = action.stock;
      return newState;
    case DELETE_FROM_WATCHLIST:
      newState = JSON.parse(JSON.stringify(state));
      delete newState.watchlists[action.watchlist.id].stocks[action.stock.id];
      return newState;

    default:
      return state;
  }
}
