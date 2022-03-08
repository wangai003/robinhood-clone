import React from "react"
import {useSelector} from 'react-redux'
import Watchlist from "../WatchList"
//probably dont need this since the loading is just done on the main page
function WatchlistList(){
    const sessionUser = useSelector(state => state.session.User)
    const watchlists = useSelector(state => state.watchlist.watchlists)
    return (<div className="watchlistListContainer">
            <ul className="watchlists">
                {
                    watchlists &&
                    watchlists.map(watchlist => {
                        <Watchlist key= {watchlist} watchlist= {watchlist}></Watchlist>
                    })
                }
            </ul>
        </div>)
}

export default WatchlistList;
