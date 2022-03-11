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

const deleteFromWatchlistType = (stock,watchlist) => {
    return {
        type:DELETE_FROM_WATCHLIST,
        stock,
        watchlist
    }
}


export const searchStocks = (query) => async (dispatch) => {
    console.log("Hitting Search Stocks")
    const response = await fetch(`/api/stocks/search/${query}`)
    if(response.status ===200){
    let data = await response.json();
    console.log(data)
    return data
    }
}

export const loadWatchlists = () => async (dispatch) => {
    console.log("Loading Watchlists")
    const response  = await fetch("/api/watchlists/")
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
    if(data.error){
        console.log("data error if")
        console.log(data)
        return data
    }else{


    // probabably give them an option to add stock somehow early
    data.stocks = [];
    await dispatch(createWatchlistType(data))
    return data;

}
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
        if(data.error){
            console.log("data error if")
            console.log(data)
            return data
        }
        await dispatch(editWatchlistType(data))
        return data;
    }
}
export const addStockToWatchlist = (name,watchlist) => async(dispatch) => {
    console.log("Hitting add stock to watchlist")
    console.log(name)
    const response  =  await fetch(`/api/watchlists/${watchlist.id}/stocks`,{
        method:"POST",
        headers:{
      "Content-Type": "application/json"
        },
        body:JSON.stringify(
            {
                name
            })
    })
    if(response.status=== 200){
        const data = await response.json()
        if(data.error){

            return data
        }
        await dispatch(addToWatchlistType(data,watchlist))
}
    else{
        //adding the same one error need ot handle
}
}
export const deleteStockFromWatchlist = (id,watchlist) => async (dispatch) => {
    console.log("HITTING DELETE STOCK")
    console.log(id)
    console.log(watchlist)
    const response = await fetch(`/api/watchlists/${watchlist.id}/stocks/${id}`,{
        method:"DELETE"
    })
    const data = await response.json()
    if(response.status === 200){
        await dispatch(deleteFromWatchlistType(data,watchlist))
    }
    else{
        //error handler
    }
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
            newState = JSON.parse(JSON.stringify(state))
            let lists = newState.watchlists
            for(let list of lists){
                if(action.watchlist.id.toString() === list.id.toString()){
                    list.stocks.push(action.stock)
                }
            }
            return newState
        case DELETE_FROM_WATCHLIST:
            newState = JSON.parse(JSON.stringify(state))
            for(let list of newState.watchlists){
                if(action.watchlist.id.toString() === list.id.toString()){
                    for(let x = 0 ; x < list.stocks.length;x++){
                        if(list.stocks[x].id === action.stock.id){
                            list.stocks.splice(x,1)
                        }
                    }
                }
            }
            return newState
        default:
            return state;
    }
}

export default watchlistReducer;
