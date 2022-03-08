import React, { useState } from 'react';

function AddToWatchlist({ hideForm, symbol, stock }) {
    const [currWatchlist, setCurrWatchlist] = useState('')
    // const watchlists = useSelector(state => state.watchlists)
    const watchlists = [{ name: "crypto", id: 1 }, { name: "tech", id: 2 }]

    const submit = () => {
        const errors = [];
        if (currWatchlist === '') {
            errors.push("Please select a watchlist")
        }
        const payload = {
            id: stock.id,
            name: stock.name,
            symbol: stock.symbol
        }
        if (!errors.length) {
            //add stock to watchlist
        }
    }

    return (
        <div>
            <form onSubmit={() => submit}>
                <select
                    value={currWatchlist}
                    onChange={(e) => setCurrWatchlist(e.target.value)}>
                    <option value={''}>Select a Watchlist</option>
                    {watchlists.map(watchlist => (
                        <option key={watchlist.id}>{watchlist.name}</option>
                    ))}
                </select>
                <button>Submit</button>
            </form>
        </div>
    )
}

export default AddToWatchlist;
