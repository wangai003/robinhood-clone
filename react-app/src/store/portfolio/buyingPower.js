export const ADD_BP = 'buying_power/ADD';
export const SUBTRACT_BP = 'buying_power/SUBTRACT';

const add = bp => ({
  type: ADD_BP,
  payload: bp,
});

const subtract = bp => ({
  type: ADD_BP,
  payload: bp,
});

export const addBuyingPower = bp => async dispatch => {
  const response = await fetch('/api/portfolio/buying-power/add', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify({
      buying_power: Number(bp),
    }),
  });

  if (response.ok) {
    const bp = await response.json();

    dispatch(add(Number(bp)));

    return null;
  } else if (response.status < 500) {
    const data = await response.json();

    if (data.errors) {
      return data.errors;
    }
  } else {
    return ['An error occurred. Please try again.'];
  }
};

export const subtractBuyingPower = bp => async dispatch => {
  const response = await fetch('/api/portfolio/buying-power/subtract', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify({
      buying_power: bp.buyingPower,
    }),
  });

  if (response.ok) {
    const bp = await response.json();

    dispatch(subtract(Number(bp)));

    return null;
  } else if (response.status < 500) {
    const data = await response.json();

    if (data.errors) {
      return data.errors;
    }
  } else {
    return ['An error occurred. Please try again.'];
  }
};

export default function bpReducer(state = null, action) {
  let newState;
  switch (action.type) {
    case ADD_BP:
      newState = JSON.parse(JSON.stringify(state));
      newState = action.payload;
      return newState;

    case SUBTRACT_BP:
      newState = JSON.parse(JSON.stringify(state));
      newState = action.payload;
      return newState;

    default:
      return state;
  }
}
