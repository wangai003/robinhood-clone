const GET_CANDLE = 'candles/GET';

const get = (symbol, timeFrame, data) => ({
  type: GET_CANDLE,
  symbol,
  timeFrame,
  data,
});

export const getCandle = (symbol, timeFrame) => async dispatch => {
  const response = await fetch(`/api/stocks/${symbol}/candles?time-frame=${timeFrame}`);

  if (response.ok) {
    const data = await response.json();
    dispatch(get(symbol, timeFrame, data));

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
      newState[action.symbol] = { ...newState[action.symbol], [action.timeFrame]: action.data };
      return newState;
    default:
      return state;
  }
};

export default reducer;
