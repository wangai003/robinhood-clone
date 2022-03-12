import React, { useEffect, useState } from 'react';
import { Modal2 } from '../BankForm/context/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { addStockToWatchlist } from '../../store/portfolio/watchlist.js'
import './AddToWatchlist.css'

function AddToWatchlist({ symbol, showModal, setShowModal }) {
    const [currWatchlist, setCurrWatchlist] = useState('');
    const [showErrors, setShowErrors] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [errors, setErrors] = useState([]);
    const watchlists = useSelector(state => state.portfolio.watchlists)
    const stocks = useSelector(state => state.stocks);

    const dispatch = useDispatch();

    useEffect(() => {
        if (currWatchlist !== '') setErrors([]);
        console.log(currWatchlist);
    }, [currWatchlist])

    useEffect(() => {
        console.log(watchlists)
        setIsLoaded(true)
    }, [])

    const submit = async (e) => {
        e.preventDefault();
        const errors = [];
        setShowErrors(true);
        if (currWatchlist === '') {
            errors.push("Please select a watchlist");
        }
        else {
            const watchlist = findWatchlist();

            const added = await dispatch(addStockToWatchlist(symbol, watchlist))
            if (!errors.length && !added.error) {
                setShowModal(false);
                setShowErrors(false);
                //add stock to watchlist
            } else {
                errors.push('Something went wrong')
            }
        }
        setErrors(errors);
    }

    const findWatchlist = () => {
        const watchlistArr = Object.values(watchlists);
        // console.log(watchlistArr)
        for (const watchlist of watchlistArr) {
            // console.log(watchlist.name)
            if (watchlist.name === currWatchlist) return watchlist;
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
                    {isLoaded && <form className='stock-watchlist-form' onSubmit={(e) => submit(e)}>
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
                            {Object.values(watchlists).map(watchlist => (
                                <option key={watchlist.id}>{watchlist.name}</option>
                            ))}
                        </select>
                        <button id="stock-add-to-watchlist-submit">Submit</button>
                    </form>}
                </Modal2>
            )
            }
        </div>
    )
}

export default AddToWatchlist;
