import { isDemoMode, getDemoConfig } from '../config/demo';
import { MOCK_STOCKS, simulateApiDelay } from '../services/mockData';

const LOAD = 'stocks/LOAD';

const load = stocks => ({
  type: LOAD,
  stocks,
});

export const getAllStocks = () => async dispatch => {
  if (isDemoMode()) {
    await simulateApiDelay(getDemoConfig().API_DELAY);
    dispatch(load(MOCK_STOCKS));
    return MOCK_STOCKS;
  }

  const response = await fetch('/api/stocks/');
  if (response.ok) {
    const stocks = await response.json();
    dispatch(load(stocks));
    return stocks;
  }
};

export default function reducer(state = [], action) {
  switch (action.type) {
    case LOAD:
      return { ...action.stocks };
    default:
      return state;
  }
}
