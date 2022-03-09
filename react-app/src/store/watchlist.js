const CREATE_WATCHLIST = "watchlist/createWatchlist"
const LOAD_WATCHLIST = "watchlist/loadWatchlist"
const DELETE_WATCHLIST = "watchlist/deleteWatchlist"
const EDIT_WATCHLIST = "watchlist/editWatchlist"

const ADD_TO_WATCHLIST = "watchlist/addToWatchlist"
const DELETE_FROM_WATCHLIST = "watchlist/deleteFromWatchlist"


const createWatchlistType = (watchlist) => {
    return {
        type:CREATE_WATCHLIST,
        payload:watchlist
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

const addToWatchlistType = (stock,watchlist) => {
    return {
        type:ADD_TO_WATCHLIST,
        stock,
        watchlist
    }
}

const deleteFromWatchlistYpe = (stock,watchlist) => {
    return {
        type:DELETE_FROM_WATCHLIST,
        stock,
        watchlist
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

export const createWatchlist = (name,userId) => async(dispatch) => {
    console.log("Creating Watchlist")
    const response  =  await fetch("/api/watchlists/",{
        method:"POST",
        headers:{
      "Content-Type": "application/json"
        },
        body:JSON.stringify(
            {user_id:userId,
      name})
    })
    if(response.status === 200){
    const data  = await response.json()
    console.log(data)
    // probabably give them an option to add stock somehow early
    data.stocks = [];
    await dispatch(createWatchlistType(data))
    return data
}
}

export const deleteWatchlistReducer = (id) => async(dispatch) => {
    console.log("Deleting Watchlist")
    const response  = await fetch (`/api/watchlists/${id}`,
    {method:"DELETE",
    headers:{
        "Content-Type": "application/json"
          },
})
    if(response.status === 200){
        const data = await response.json();
        await dispatch(deleteWatchlistType(data))
        return data
    }
}
export const editWatchlist = (name,userId,watchlistId) => async (dispatch) => {
    console.log("Editing Watchlist")
    const response  =  await fetch(`/api/watchlists/${watchlistId}`,{
        method:"PATCH",
        headers:{
      "Content-Type": "application/json"
        },
        body:JSON.stringify(
            {
    user_id:userId,
      name})
    })
    if(response.status === 200){
        const data = await response.json();
        console.log(data)
        await dispatch(editWatchlistType(data))
        return data;
    }
}
export const addStockToWatchlist = (symbol,name) => async(dispatch) => {

}
let initialState = {}
const watchlistReducer = (state = initialState, action) => {
    let newState = {};
    switch(action.type){
        case LOAD_WATCHLIST:
            newState = Object.assign({},state);
            newState.watchlists = action.payload;
            return newState
        case CREATE_WATCHLIST:
            console.log("HITTING CREATE")
            newState = JSON.parse(JSON.stringify(state))
            newState.watchlists.push(action.payload)
            return newState
        case DELETE_WATCHLIST:
            newState = JSON.parse(JSON.stringify(state))
            // need to find the watchlist that i deleted and remove it
            let watchlists = newState.watchlists
            let index = -1
            for(let i = 0; i < watchlists.length ;i++){
                let watchlist = watchlists[i]
                if(watchlist.id.toString() === action.payload.id.toString()){
                    console.log("found deleted")
                    index = i;
                    break
                }
            }
            watchlists.splice(index,1)
            newState.watchlists  = watchlists
            return newState
        case EDIT_WATCHLIST:
            newState = JSON.parse(JSON.stringify(state))
            let wLists = newState.watchlists
            for(let wList of wLists){
                if(action.payload.id.toString() === wList.id.toString()){
                    wList.name = action.payload.name
                }
            }
            return newState
        case ADD_TO_WATCHLIST:
            return newState
        default:
            return state;
    }
}

export default watchlistReducer;
