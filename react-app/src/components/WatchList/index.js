import React from "react"
import {useSelector} from 'react-redux'
import WatchlistStock from "../WatchListStock"
import './watchlist.css'

function Watchlist(){
    const sessionUser = useSelector(state => state.session.User)
    const watchlists = useSelector(state => state.watchlist.watchlists)
    return (<div className="watchListContainer">
            <ul className="watchList">
                {
                    watchlists && watchlists.map(watchlist => {
                        return (
                        <div key={watchlist.name}>{watchlist.name}
                        <ul>
                            {
                               watchlist
                                &&
                                watchlist.stocks.map(stock => {
                                  return  <WatchlistStock stock = {stock} key= {stock.id}></WatchlistStock>
                                })
                            }
                        </ul>
                        </div>
                        )
                    })
                }
            </ul>
        </div>)
}

export default Watchlist
