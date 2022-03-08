import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AddToWatchlist from './AddToWatchlist';
import Graph from './Graph';
import "./Stock.css"

function Stock() {
    const [stock, setStock] = useState({});
    const [showWatchlistForm, setShowWatchlistform] = useState("hide");

    const { symbol } = useParams();

    const hideForm = () => {
        setShowWatchlistform("hide");
    }

    useEffect(() => {
        if (!symbol) {
            return;
        }
        (async () => {
            const response = await fetch(`/api/stocks/${symbol}/quote`);
            const stock = await response.json();
            setStock(stock);
            console.log(stock)
        })();
    }, [symbol])

    return (
        <>
            <div>
                <div>
                    <h2>{symbol}</h2>
                    <h2>{`$${stock.current}`}</h2>
                    <div>{`${stock.change} (${stock.change_percent}%)`}</div>
                </div>
                <Graph symbol={symbol} change={stock.change} />
                <nav>
                    <button>1D</button>
                    <button>1W</button>
                    <button>1M</button>
                    <button>3M</button>
                    <button>1Y</button>
                    <button>5Y</button>
                </nav>
                <div>
                    <h3>About</h3>
                    <p>This company is this</p>
                </div>
            </div>
            <button
                onClick={() => setShowWatchlistform((prevState) => prevState === '' ? 'hide' : '')}>
                Add to Watchlist
            </button>
            <div className={showWatchlistForm}>
                <AddToWatchlist hideForm={hideForm} symbol={symbol} />
            </div>
        </>
    )
}

export default Stock;
