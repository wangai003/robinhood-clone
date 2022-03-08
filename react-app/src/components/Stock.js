import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AddToWatchlist from './AddToWatchlist';
import Graph from './Graph';
import "./Stock.css"

function Stock() {
    const [stock, setStock] = useState({});
    const [interval, setInterval] = useState("1D");
    const [resolution, setResolution] = useState("5");
    const [prices, setPrices] = useState([]);
    const [times, setTimes] = useState([]);
    const [color, setColor] = useState("green")
    const [change, setChange] = useState(0);
    const [changePercent, setChangePercent] = useState(0)
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
        })();
    }, [symbol])

    useEffect(() => {
        (async () => {
            const fromTo = getInterval();
            console.log(typeof resolution)
            const response = await fetch(`/api/stocks/${symbol}/candles?from=${fromTo[0]}&to=${fromTo[1]}&resolution=${resolution}`);
            const data = await response.json();
            const prices = [];
            const times = [];
            for (const obj of data) {
                prices.push(obj.price.toFixed(2));
                times.push(convertTimes(obj.time));
            }
            const change = (prices[prices.length - 1] - prices[0]).toFixed(2);
            const changePercent = (change / prices[0]).toFixed(2);
            const color = change > 0 ? "green" : "red";

            console.log(times);
            setChange(change)
            setChangePercent(changePercent)
            setColor(color);
            setTimes(times);
            setPrices(prices);
        })();
    }, [interval])

    const handleClick = (int) => {
        console.log(int)
        switch (int) {
            case ('1D'):
                setResolution("5");
            case ('1W'):
                setResolution("30");
            case ('1M'):
                setResolution("60");
            case ('3M'):
                setResolution("D");
            case ('1Y'):
                setResolution("D");
            case ('5Y'):
                setResolution("W");
            default:

        }
        setInterval(int);
    }

    const convertTimes = (time) => {
        const date = new Date(time * 1000);
        const year = date.getFullYear();
        const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)
        const day = date.getDate();
        // const hours = date.getHours() > 12 ? `${date.getHours() - 12}` : `${date.getHours()}`;
        // const minutes = date.getMinutes() > 9 ? `${date.getMinutes()}` : `0${date.getMinutes()}`;
        // const amPM = date.getHours() > 12 ? "PM" : "AM"

        switch (interval) {
            case ('1D'): {
                const hours = date.getHours() > 12 ? `${date.getHours() - 12}` : `${date.getHours()}`;
                const minutes = date.getMinutes() > 9 ? `${date.getMinutes()}` : `0${date.getMinutes()}`;
                const amPM = date.getHours() > 12 ? "PM" : "AM"
                return `${hours}:${minutes} ${amPM}`
            }
            case ('1W'): {
                const hours = date.getHours() > 12 ? `${date.getHours() - 12}` : `${date.getHours()}`;
                const minutes = date.getMinutes() > 9 ? `${date.getMinutes()}` : `0${date.getMinutes()}`;
                const amPM = date.getHours() > 12 ? "PM" : "AM"
                return `${month} ${day} ${hours}:${minutes} ${amPM}`;
            }
            case ('1M'): {
                const hours = date.getHours() > 12 ? `${date.getHours() - 12}` : `${date.getHours()}`;
                const minutes = date.getMinutes() > 9 ? `${date.getMinutes()}` : `0${date.getMinutes()}`;
                const amPM = date.getHours() > 12 ? "PM" : "AM"
                return `${month} ${day} ${hours}:${minutes} ${amPM}`;
            }
            case ('3M'):
                return `${month} ${day}, ${year}`;
            case ('1Y'):
                return `${month} ${day}, ${year}`;
            case ('5Y'):
                return `${month} ${day}, ${year}`;
            default:
                return '';

        }
    }

    const unixifyDates = (dates) => {
        const unixDates = [];
        dates.forEach(date => {
            let unixDate = Date.parse(date) / 1000
            unixDates.push(unixDate.toString())
        })
        return unixDates;
    }

    const getInterval = () => {
        let today = new Date();
        today.setHours(16);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        const open = new Date(today - 28800000);
        const oneDay = 86400000;
        const oneWeekAgo = new Date(today - oneDay * 7);
        const oneMonthAgo = new Date(today - oneDay * 30);
        const threeMonthsAgo = new Date(today - oneDay * 90);
        const oneYearAgo = new Date(today - oneDay * 365);
        const fiveYearsAgo = new Date(today - oneDay * 365 * 5 - oneDay);

        switch (interval) {
            case ('1D'):
                return unixifyDates([open, today]);
            case ('1W'):
                return unixifyDates([oneWeekAgo, today]);
            case ('1M'):
                return unixifyDates([oneMonthAgo, today]);
            case ('3M'):
                return unixifyDates([threeMonthsAgo, today]);
            case ('1Y'):
                return unixifyDates([oneYearAgo, today]);
            case ('5Y'):
                return unixifyDates([fiveYearsAgo, today]);
            default:
                return ['', '']
        }
    }

    return (
        <>
            <div>
                <div>
                    <h2>{symbol}</h2>
                    <h2>{`$${stock.current}`}</h2>
                    <div>{`$${change} (${changePercent}%)`}</div>
                </div>
                <Graph
                    symbol={symbol}
                    color={color}
                    times={times}
                    prices={prices} />
                <nav>
                    <button
                        className={interval === '1D' ? `interval-btn selected ${color}` : `interval-btn ${color}`}
                        onClick={(e) => handleClick(e.target.innerHTML)}>
                        1D
                    </button>
                    <button
                        className={interval === '1W' ? `interval-btn selected ${color}` : `interval-btn ${color}`}
                        onClick={(e) => handleClick(e.target.innerHTML)}>
                        1W
                    </button>
                    <button
                        className={interval === '1M' ? `interval-btn selected ${color}` : `interval-btn ${color}`}
                        onClick={(e) => handleClick(e.target.innerHTML)}>
                        1M
                    </button>
                    <button
                        className={interval === '3M' ? `interval-btn selected ${color}` : `interval-btn ${color}`}
                        onClick={(e) => handleClick(e.target.innerHTML)}>
                        3M
                    </button>
                    <button
                        className={interval === '1Y' ? `interval-btn selected ${color}` : `interval-btn ${color}`}
                        onClick={(e) => handleClick(e.target.innerHTML)}>
                        1Y
                    </button>
                    <button
                        className={interval === '5Y' ? `interval-btn selected ${color}` : `interval-btn ${color}`}
                        onClick={(e) => handleClick(e.target.innerHTML)}>
                        5Y
                    </button>
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
