import React, { useState } from "react"
import {useDispatch, useSelector} from 'react-redux'
import { deleteWatchlistReducer } from "../../store/watchlist"
import CreateWatchlistForm from "../CreateWatchlistform"
import EditWatchlistForm from "../EditWatchlistForm"
import WatchlistStock from "../WatchListStock"
import './watchlist.css'

function Watchlist({watchlist}){
    console.log("HIT WATCHLIST")
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.User)
    const watchlists = useSelector(state => state.watchlist.watchlists)
    const [showEditWatchlistForm,changeEditWatchlistForm] = useState(false)
    const toggleEditWatchlistForm = async(e) => {
        changeEditWatchlistForm(!showEditWatchlistForm)
    }
    const deleteWatchlist = async (e) => {
       let response =  await dispatch(deleteWatchlistReducer(watchlist.id))

    }
    let editForm
    if(showEditWatchlistForm) {
        editForm = <EditWatchlistForm hideform={toggleEditWatchlistForm} watchlist={watchlist}></EditWatchlistForm>
    }
    return (<div className="watchListContainer">
            <ul className="watchList">
            {watchlist.name}
            <button>Add Stock to Watchlist</button>

            <button onClick={toggleEditWatchlistForm}>Edit name of watchlist</button>
            {editForm}
            <button onClick={deleteWatchlist}>Delete watchlist</button>
                        <ul>
                            {
                               watchlist
                                &&
                                watchlist.stocks.map(stock => {
                                  return  <WatchlistStock stock = {stock} key= {"stock"+ stock.id}></WatchlistStock>
                                })
                            }
                        </ul>
            </ul>
        </div>)
}

export default Watchlist
