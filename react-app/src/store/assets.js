const LOAD = 'assets/LOAD'
const BUY = 'assets/BUY'

const load = (assets) => ({
    type: LOAD,
    assets
})

const buy = (asset) => ({
    type: buy,
    asset
})

export const getAssets = () => async (dispatch) => {
    const response = await fetch('/api/assets/');
    if (response.ok) {
        const stocks = await response.json();
        dispatch(load(stocks));
        return stocks;
    }
}

export const buyAssets = (payload) => async (dispatch) => {
    console.log("*******************", payload);
    const response = await fetch('/api/assets/', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    if (response.ok) {
        const data = await response.json()
        await dispatch(buy)
    }
}

const initialState = {};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case LOAD:
            return { ...state, ...action.assets };
        case BUY:
            const asset = action.asset;
            return { ...state, asset };
        default:
            return state;
    }
}
