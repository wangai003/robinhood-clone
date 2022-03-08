import React from "react"
import {useSelector} from 'react-redux'

function WatchlistStock(params){
    const sessionUser = useSelector(state => state.session.User)
    let stock = params.stock
    console.log(stock)
    console.log("hitting watchliststock")
    return (<div className="watchListStockContainer">
            <div>
            {stock.name}
            </div>
            <div>
            {stock.symbol}
            </div>
        </div>)
}

export default WatchlistStock
