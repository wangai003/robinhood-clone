export const TRADE_ASSETS = '/portfolio/assets/TRADE';
export const SELL_ALL_ASSETS = '/portfolio/assets/SELL_ALL';

const trade = asset => ({
  type: TRADE_ASSETS,
  asset,
});

const sellAll = symbol => ({
  type: SELL_ALL_ASSETS,
  symbol,
});

export const buyAssets = payload => async dispatch => {
  const response = await fetch('/api/portfolio/assets/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    const asset = await response.json();
    await dispatch(trade(asset));
  }
};

export const tradeAssets = (payload, id) => async dispatch => {
  const response = await fetch(`/api/portfolio/assets/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    const asset = await response.json();
    await dispatch(trade(asset));
  }
};

export const sellAllAssets = (payload, id) => async dispatch => {
  const response = await fetch(`/api/portfolio/assets/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    const asset = await response.json();
    // console.log(asset);
    await dispatch(sellAll(asset.symbol));
  }
};

const initialState = {};

export default function assetReducer(state = initialState, action) {
  switch (action.type) {
    case TRADE_ASSETS:
      const tradeState = { ...state };
      if (tradeState[action.asset.symbol]) {
        tradeState[action.asset.symbol].count = action.asset.count;
      } else tradeState[action.asset.symbol] = action.asset;
      return tradeState;
    case SELL_ALL_ASSETS:
      const sellAllState = { ...state };
      if (sellAllState[action.symbol]) delete sellAllState[action.symbol];
      return sellAllState;
    default:
      return state;
  }
}
