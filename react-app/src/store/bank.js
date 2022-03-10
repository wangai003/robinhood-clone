const GET_BANK = 'bank/GET_BANK'
const GET_ACCOUNTS = 'bank/GET_ACCOUNTS'
const EDIT_ACCOUNT = 'bank/EDIT_ACCOUNT'
const REMOVE_ACCOUNT = 'bank/REMOVE_ACCOUNT'
const ADD_ACCOUNT = 'bank/ADD_ACCOUNT'


const setBank = (bank) => ({
  type: GET_BANK,
  payload: bank
});

const setAccounts = (account) => ({
  type: GET_ACCOUNTS,
  payload: account
});

const editAccount = (account) => ({
  type: EDIT_ACCOUNT,
  payload: account
})

const removeAccount = (id) => ({
  type: REMOVE_ACCOUNT,
  payload: id
})

const addAccountAction = (account) => ({
  type: ADD_ACCOUNT,
  payload: account
})

export const getBanks = () => async (dispatch) => {

  const response = await fetch('/api/banks/');

  if (response.ok) {

    const data = await response.json();
    dispatch(setBank(data))
    return data;

  } else if (response.status < 500) {

    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }

  } else {
    return ['An error occurred. Please try again.']
  }

}



export const getAccounts = () => async (dispatch) => {

  const response = await fetch('/api/accounts/');

  if (response.ok) {
    const data = await response.json();

    dispatch(setAccounts(data));

    return data;
  } else if (response.status < 500) {

    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }

  } else {
    return ['An error occurred. Please try again.']
  }
}



export const addAccount = (userId, bankId, accountNumber, name) => async (dispatch) => {

  const response = await fetch('/api/accounts/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      "user_id": userId,
      "bank_id": bankId,
      "account_number": accountNumber,
      name,
    }),

  });

  if (response.ok) {
    const data = await response.json();

    dispatch(addAccountAction(data))

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
  const response = await fetch(`/api/accounts/delete/${id}`, { method: 'DELETE' });

  if (response.ok) {

    dispatch(removeAccount(id))

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

  let responseBody = {
    "user_id": bank.userId,
    "bank_id": bank.bankId,
    "name": bank.name,
    "account_number": bank.accountNumber
  }

  // if(bank.accountNumber) {
  //   responseBody["account_number"] = bank.accountNumber
  // }


  const response = await fetch(`/api/accounts/edit/${bank.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify(responseBody)
  });


  if (response.ok) {
    const updatedBank = await response.json();

    dispatch(editAccount(updatedBank))

    return null;

  } else if (response.status < 500) {
    const data = await response.json();

    if (data.errors) {
      console.log('INSIDE EDITBANK THUNK --------------------')
      console.log('my errors inside thunk---> ', data.errors)
      return data.errors;
    }

  } else {
    return ['An error occurred. Please try again.']
  }
}


const initialState = { bank: null, linked: null };

export default function bankReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case GET_BANK:

      state.bank = action.payload
      return {...state}

    case GET_ACCOUNTS:

      state.linked = action.payload
      return {...state}

    case REMOVE_ACCOUNT:

      newState = JSON.parse(JSON.stringify(state))
      delete newState.linked[action.payload]
      return newState

    case EDIT_ACCOUNT:

      newState = JSON.parse(JSON.stringify(state))
      newState.linked[action.payload.id] = action.payload
      return newState

    case ADD_ACCOUNT:

      newState = JSON.parse(JSON.stringify(state))
      newState.linked[action.payload.id] = action.payload
      return newState

    default:
      return state;
  }
}
