import { isDemoMode, getDemoConfig } from '../config/demo';
import { generateMockCandles, simulateApiDelay } from '../services/mockData';

const GET_CANDLE = 'candles/GET';

const get = (timeFrame, symbol, data) => ({
  type: GET_CANDLE,
  timeFrame,
  symbol,
  data,
});

export const getCandle = (timeFrame, symbol) => async dispatch => {
  if (isDemoMode()) {
    await simulateApiDelay(getDemoConfig().API_DELAY);
    const data = generateMockCandles(symbol, timeFrame);
    dispatch(get(timeFrame, symbol, data));
    return data;
  }

  const response = await fetch(`/api/stocks/${symbol}/candles?time-frame=${timeFrame}`);

  if (response.ok) {
    const data = await response.json();
    dispatch(get(timeFrame, symbol, data));

    return data;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ['An error occurred. Please try again.'];
  }
};

const reducer = (state = {}, action) => {
  switch (action.type) {
    case GET_CANDLE:
      const newState = JSON.parse(JSON.stringify(state));
      newState[action.timeFrame] = { ...newState[action.timeFrame], [action.symbol]: action.data };
      return newState;
    default:
      return state;
  }
};

export default reducer;
