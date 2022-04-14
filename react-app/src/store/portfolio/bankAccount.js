export const ADD_BANK_ACCOUNT = '/portfolio/bank_accounts/ADD';
export const EDIT_BANK_ACCOUNT = '/portfolio/bank_accounts/EDIT';
export const REMOVE_BANK_ACCOUNT = '/portfolio/bank_accounts/REMOVE';

const add = account => ({
  type: ADD_BANK_ACCOUNT,
  payload: account,
});

const edit = account => ({
  type: EDIT_BANK_ACCOUNT,
  payload: account,
});

const remove = id => ({
  type: REMOVE_BANK_ACCOUNT,
  payload: id,
});

export const addBankAccount = (userId, bankId, accountNumber, name) => async dispatch => {
  const response = await fetch('/api/portfolio/bank-accounts/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      user_id: userId,
      bank_id: bankId,
      account_number: accountNumber,
      name,
    }),
  });

  if (response.ok) {
    const data = await response.json();

    dispatch(add(data));

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

export const deleteBankAccount = id => async dispatch => {
  const response = await fetch(`/api/portfolio/bank-accounts/delete/${id}`, { method: 'DELETE' });

  if (response.ok) {
    dispatch(remove(id));

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

export const editBankAccount = bank => async dispatch => {
  let responseBody = {
    user_id: bank.userId,
    bank_id: bank.bankId,
    name: bank.name,
    account_number: bank.accountNumber,
  };

  // if(bank.accountNumber) {
  //   responseBody["account_number"] = bank.accountNumber
  // }

  const response = await fetch(`/api/portfolio/bank-accounts/edit/${bank.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify(responseBody),
  });

  if (response.ok) {
    const updatedBank = await response.json();

    dispatch(edit(updatedBank));

    return null;
  } else if (response.status < 500) {
    const data = await response.json();

    if (data.errors) {
      // console.log('INSIDE EDITBANK THUNK --------------------');
      // console.log('my errors inside thunk---> ', data.errors);
      return data.errors;
    }
  } else {
    return ['An error occurred. Please try again.'];
  }
};

export default function bankReducer(state = null, action) {
  let newState;
  switch (action.type) {
    case REMOVE_BANK_ACCOUNT:
      newState = JSON.parse(JSON.stringify(state));
      delete newState.linked[action.payload];
      return newState;

    case EDIT_BANK_ACCOUNT:
      newState = JSON.parse(JSON.stringify(state));
      newState.linked[action.payload.id] = action.payload;
      return newState;

    case ADD_BANK_ACCOUNT:
      newState = JSON.parse(JSON.stringify(state));
      newState.linked[action.payload.id] = action.payload;
      return newState;

    default:
      return state;
  }
}
