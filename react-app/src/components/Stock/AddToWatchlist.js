import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import './AddToWatchlist.css'

function AddToWatchlist({ hideForm, symbol, stock }) {
    const [currWatchlist, setCurrWatchlist] = useState('');
    const [showErrors, setShowErrors] = useState(false);
    const [errors, setErrors] = useState([]);
    // const watchlists = useSelector(state => state.watchlists)
    const watchlists = [{ name: "crypto", id: 1 }, { name: "tech", id: 2 }]

    useEffect(() => {
        if (currWatchlist !== '') setErrors([]);
    }, [currWatchlist])

    const submit = (e) => {
        e.preventDefault();
        const errors = [];
        if (currWatchlist === '') {
            errors.push("Please select a watchlist");
        }
        const payload = {
            id: stock.id,
            name: stock.name,
            symbol: stock.symbol
        }
        setErrors(errors);
        setShowErrors(true);
        if (!errors.length) {
            hideForm();
            setShowErrors(false);
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
                {showErrors && errors.map(error => (
                    <div
                        className='stock-watchlist-form-error'
                        key={error}>
                        {error}
                    </div>
                ))}
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
