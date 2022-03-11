const GET_BANK = 'bank/GET_BANK';

const setBank = bank => ({
  type: GET_BANK,
  payload: bank,
});

export const getBanks = () => async dispatch => {
  const response = await fetch('/api/banks/');

  if (response.ok) {
    const data = await response.json();
    dispatch(setBank(data));
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

export default function bankReducer(state = null, action) {
  switch (action.type) {
    case GET_BANK:
      state = action.payload;
      return { ...state };
    default:
      return state;
  }
}
