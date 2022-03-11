import React, { useEffect, useState } from 'react';
import { Modal2 } from '../BankForm/context/Modal';
// import { useDispatch } from 'react-redux';
import './AddToWatchlist.css'

function AddToWatchlist({ symbol, stock, showModal, setShowModal }) {
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
            setShowModal(false);
            setShowErrors(false);
            //add stock to watchlist
        }
    }

    return (
        <div className='stock-add-to-watchlist-container'>
            {showModal && (
                <Modal2
                    title={`Add ${symbol.toUpperCase()} to a watchlist`}
                    onClose={() => setShowModal(false)}
                    show={showModal}
                >
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
                </Modal2>
            )
            }
        </div>
    )
}

export default AddToWatchlist;
