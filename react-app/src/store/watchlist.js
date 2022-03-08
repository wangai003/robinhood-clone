const CREATE_WATCHLIST = "watchlist/createWatchlist"
const LOAD_WATCHLIST = "watchlist/loadWatchlist"
const ADD_TO_WATCHLIST = "watchlist/addToWatchlist"
const DELETE_WATCHLIST = "watchlist/deleteWatchlist"
const EDIT_WATCHLIST = "watchlist/editWatchlist"


const createWatchlistType = (watchlist) => {
    return {
        type:CREATE_WATCHLIST,
        payload:watchlist
    }
}

const addToWatchlistType = (stock,watchlist) => {
    return {
        type:ADD_TO_WATCHLIST,
        stock,
        watchlist
    }
}

const loadWatchlistType = (watchlist) => {
   return { type: LOAD_WATCHLIST,
    payload:watchlist
   }
}
const deleteWatchlistType = (watchlist) => {
    return {
        type:DELETE_WATCHLIST,
        payload:watchlist
    }
}

const editWatchlistType = (watchlist,newName)=>{
    return {
        type:EDIT_WATCHLIST,
        payload:watchlist,
        newName
    }
}


export const loadWatchlists = () => async (dispatch) => {
    console.log("Loading Watchlists")
    const response  = await fetch("/api/watchlists")
    if(response.status === 200){
        console.log("loading watchlists worked")
        const data  = await response.json()
        console.log(data)
        await dispatch(loadWatchlistType(data))
        return response
    }
    else{
        console.log("loading watchlists failed")
    }
}


let initialState = {watchlists:null}
const watchlistReducer = (state = initialState, action) => {
    let newState = {};

    switch(action.type){
        case LOAD_WATCHLIST:
            newState = Object.assign({},state);
            newState.watchlists = action.payload;
            return newState
        case CREATE_WATCHLIST:
            return newState
        case ADD_TO_WATCHLIST:
            return newState
        case DELETE_WATCHLIST:
            return newState
        case EDIT_WATCHLIST:
            return newState
        default:
            return state;
    }
}

export default watchlistReducer;
