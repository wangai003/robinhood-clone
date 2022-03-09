const SET_BANK = 'bank/SET_BANK'
const REMOVE_BANK = 'bank/REMOVE_BANK'
const LOAD_BANK = 'bank/LOAD_BANK'

export const loadSingleBank = (bank) => ({
  type: LOAD_BANK,
  bank
})

const setBank = (bank) => ({
  type: SET_BANK,
  payload: bank
});

const removeBank = () => ({
  type: REMOVE_BANK,
})

const initialState = { bank: null };



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


export const deleteBank = (id) => async (dispatch) => {
  const response = await fetch(`/api/banks/delete/${id}`);

  if (response.ok) {
    dispatch(removeBank())
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


//editing
export const editBank = (bank) => async (dispatch) => {
  const response = await fetch(`/api/banks/edit/${bank.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      "user_id": bank.userId,
      "bank_id": bank.bankId,
      "account_number": bank.accountNumber,
      "name": bank.name,
    })
  });

  if (response.ok) {
    const updatedBank = await response.json();
    dispatch(loadSingleBank(updatedBank))
  }
  return response;
}

export default function bankReducer(state = initialState, action) {
  switch (action.type) {
    case SET_BANK:
      return { bank: action.payload }
    case REMOVE_BANK:
      return { bank: null }
    case LOAD_BANK:
      return { bank: action.payload }
    default:
      return state;
  }
}
