import React, { useState } from 'react';
import './AddToWatchlist.css'

function AddToWatchlist({ hideForm, symbol, stock }) {
    const [currWatchlist, setCurrWatchlist] = useState('')
    // const watchlists = useSelector(state => state.watchlists)
    const watchlists = [{ name: "crypto", id: 1 }, { name: "tech", id: 2 }]

    const submit = (e) => {
        e.preventDefault();
        const errors = [];
        if (currWatchlist === '') {
            errors.push("Please select a watchlist")
        }
        // const payload = {
        //     id: stock.id,
        //     name: stock.name,
        //     symbol: stock.symbol
        // }
        if (!errors.length) {
            hideForm();
            //add stock to watchlist
        }
    }

    return (
        <div className='stock-add-to-watchlist-container'>
            <button
                id="stock-add-to-watchlist-x"
                onClick={() => hideForm()}>
                X
            </button>
            <form onSubmit={(e) => submit(e)}>
                <select
                    id="stock-add-to-watchlist-select"
                    value={currWatchlist}
                    onChange={(e) => setCurrWatchlist(e.target.value)}>
                    <option value={''}>Select a Watchlist</option>
                    {watchlists.map(watchlist => (
                        <option key={watchlist.id}>{watchlist.name}</option>
                    ))}
                </select>
                <button id="stock-add-to-watchlist-submit">Submit</button>
            </form>
        </div>
    )
}

export default AddToWatchlist;
