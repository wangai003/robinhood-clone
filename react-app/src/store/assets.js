const LOAD = 'assets/LOAD'
const BUY_SELL = 'assets/BUY_SELL'
const SELL_ALL = 'assets/SELL_ALL'

const load = (assets) => ({
    type: LOAD,
    assets
});

const buySell = (asset) => ({
    type: BUY_SELL,
    asset
});

const sellAll = (symbol) => ({
    type: SELL_ALL,
    symbol
})

export const loadAssets = () => async (dispatch) => {
    const response = await fetch('/api/assets/');
    if (response.ok) {
        const assets = await response.json();
        dispatch(load(assets));
        return assets;
    }
}

export const buyAssets = (payload) => async (dispatch) => {
    const response = await fetch('/api/assets/', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    if (response.ok) {
        const asset = await response.json()
        await dispatch(buySell(asset))
    }
}

export const buySellAssets = (payload, id) => async (dispatch) => {
    const response = await fetch(`/api/assets/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    if (response.ok) {
        const asset = await response.json();
        await dispatch(buySell(asset))
    }
}

export const sellAllAssets = (payload, id) => async (dispatch) => {
    const response = await fetch(`/api/assets/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    if (response.ok) {
        const asset = await response.json();
        console.log(asset);
        await dispatch(sellAll(asset.symbol));
    }
}

const initialState = {};

export default function assetReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD:
            const loadState = {};
            action.assets.forEach(asset => {
                loadState[asset.symbol] = asset;
            })
            return loadState;
        case BUY_SELL:
            const buyState = { ...state };
            if (buyState[action.asset.symbol]) {
                buyState[action.asset.symbol].count = action.asset.count;
            } else buyState[action.asset.symbol] = action.asset;
            return buyState;
        case SELL_ALL:
            const sellAllState = { ...state };
            if (sellAllState[action.symbol]) delete sellAllState[action.symbol];
            return sellAllState;
        default:
            return state;
    }
}
