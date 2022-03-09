import React, { useState } from "react"
import {useSelector} from 'react-redux'
import CreateWatchlistForm from "../CreateWatchlistform"
import Watchlist from "../WatchList"
//probably dont need this since the loading is just done on the main page
function WatchlistList(){
    const sessionUser = useSelector(state => state.session.User)
    const watchlists = useSelector(state => state.watchlist.watchlists)
    const [showCreateWatchlistForm,changeCreateWatchlistForm] = useState(false);
    const toggleCreateWatchlistForm = async(e) => {
        changeCreateWatchlistForm(!showCreateWatchlistForm)

    }
    let createForm;
    if(showCreateWatchlistForm){
        createForm = <CreateWatchlistForm hideform={toggleCreateWatchlistForm}></CreateWatchlistForm>
    }
    return (<div className="watchlistListContainer">
         <button onClick={toggleCreateWatchlistForm}>Create new watchlist</button>
         {createForm}
            <ul className="watchlists">
                {
                    watchlists &&
                    watchlists.map(watchlist => {
                        return <Watchlist key= {"watchlist"+watchlist.id} watchlist= {watchlist}></Watchlist>
                    })
                }
            </ul>
        </div>)
}

export default WatchlistList;
