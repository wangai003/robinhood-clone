const SET_BANK = 'bank/SET_BANK'
const REMOVE_BANK = 'bank/REMOVE_BANK'

const setBank = (bank) => ({
  type: SET_BANK,
  payload: bank
});

const removeBank = () => ({
  type: REMOVE_BANK,
})

const initialState = { bank: null };


// addBank(userId, bank, accountNumber, name)

export const addBank = (userId, bank, accountNumber, name) => async (dispatch) => {

  const response = await fetch('/api/banks/addbank', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      "user_id": userId,
      "bank_id": bank,
      "account_number": accountNumber,
      name,
    }),

  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setBank(data))
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ['An error occurred. Please try again.']
  }
}

export default function bankReducer(state = initialState, action) {
  switch (action.type) {
    case SET_BANK:
      return { bank: action.payload }
    case REMOVE_BANK:
      return { bank: null }
    default:
      return state;
  }
}
