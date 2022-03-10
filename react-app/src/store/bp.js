const ADD_BP = 'bp/ADD_BP'
const GET_BP = 'bp/GET_BP'


const addBpAction = (bp) => ({
  type: ADD_BP,
  payload: bp
})

const getBpAction = (bp) => ({
  type: GET_BP,
  payload: bp
})




export const getBp = (id) => async (dispatch) => {
  const response = await fetch(`/api/users/${id}/mybp`);

  if (response.ok) {

    const bp = await response.json();

    dispatch(getBpAction(Number(bp)))

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




export const addBp = (bp) => async (dispatch) => {
  const response = await fetch(`/api/users/${bp.userId}/add-bp`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify({
      "buying_power": bp.buyingPower
    })

  });

  if (response.ok) {

    const bp = await response.json();

    dispatch(addBpAction(Number(bp)))

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




export default function bpReducer(state = null, action) {
  let newState;
  switch (action.type) {

    case ADD_BP:

      newState = JSON.parse(JSON.stringify(state))
      newState = action.payload
      return newState

    case GET_BP:

      newState = JSON.parse(JSON.stringify(state))
      newState = action.payload
      return newState

    default:
      return state;
  }
}
