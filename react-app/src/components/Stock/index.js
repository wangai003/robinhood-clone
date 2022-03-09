import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AddToWatchlist from './AddToWatchlist';
import Graph from '../Graph';
import './Stock.css';

function Stock() {
  const [stock, setStock] = useState({});
  const [activePrice, setActivePrice] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [interval, setInterval] = useState('1D');
  const [intervalLong, setIntervalLong] = useState('Today');
  const [resolution, setResolution] = useState('5');
  const [prices, setPrices] = useState([]);
  const [times, setTimes] = useState([]);
  const [color, setColor] = useState('green');
  const [change, setChange] = useState(0);
  const [changePercent, setChangePercent] = useState(0);
  const [showWatchlistForm, setShowWatchlistform] = useState(false);

  const { symbol } = useParams();

  // const hideForm = () => {
  //   setShowWatchlistform('hide');
  // };

  const closeWatchlistForm = () => {
    setShowWatchlistform(false);
  };
  // useEffect(() => {
  //   if (!showWatchlistForm) return;


  //   document.addEventListener('click', closeWatchlistForm);

  //   return () => document.removeEventListener('click', closeWatchlistForm);
  // }, [showWatchlistForm])

  useEffect(() => {
    if (!symbol) {
      return;
    }
    (async () => {
      const response1 = await fetch(`/api/stocks/${symbol}/quote`);
      const stock = await response1.json();
      const response2 = await fetch(`/api/stocks/${symbol}/financials`);
      stock.financials = await response2.json();
      setStock(stock);
      setActivePrice(stock.current);
      setIsLoaded(true);
    })();
  }, [symbol]);

  useEffect(() => {
    (async () => {
      const fromTo = getInterval();
      const response = await fetch(
        `/api/stocks/${symbol}/candles?from=${fromTo[0]}&to=${fromTo[1]}&resolution=${resolution}`
      );
      const data = await response.json();
      const prices = [];
      const times = [];

      for (const obj of data) {
        prices.push(obj.price.toFixed(2));
        times.push(convertTimes(obj.time));
      }

      const change = (prices[prices.length - 1] - prices[0]).toFixed(2);
      const changePercent = (change / prices[0]).toFixed(2);
      const color = change > 0 ? 'green' : 'red';

      setChange(change);
      setChangePercent(changePercent);
      setColor(color);
      setTimes(times);
      setPrices(prices);
    })();
  }, [interval]);

  const handleClick = int => {
    switch (int) {
      case '1D':
        setIntervalLong('Today');
        setResolution('5');
        break;
      case '1W':
        setIntervalLong('Past Week');
        setResolution('30');
        break;
      case '1M':
        setIntervalLong('Past Month');
        setResolution('60');
        break;
      case '3M':
        setIntervalLong('Past 3 Months');
        setResolution('D');
        break;
      case '1Y':
        setIntervalLong('Past Year');
        setResolution('D');
        break;
      // case ('5Y'):
      //     setResolution("W");
      //     break;
      default:
        break;
    }
    setInterval(int);
  };

  const convertTimes = time => {
    const date = new Date(time * 1000);
    const year = date.getFullYear();
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
    const day = date.getDate();
    const hours = date.getHours() > 12 ? `${date.getHours() - 12}` : `${date.getHours()}`;
    const minutes = date.getMinutes() > 9 ? `${date.getMinutes()}` : `0${date.getMinutes()}`;
    const amPM = date.getHours() > 12 ? 'PM' : 'AM';

    switch (interval) {
      case '1D': {
        return `${hours}:${minutes} ${amPM}`;
      }
      case '1W': {
        return `${month} ${day} ${hours}:${minutes} ${amPM}`;
      }
      case '1M': {
        return `${month} ${day} ${hours}:${minutes} ${amPM}`;
      }
      case '3M':
        return `${month} ${day}, ${year}`;
      case '1Y':
        return `${month} ${day}, ${year}`;
      // case ('5Y'):
      //     return `${month} ${day}, ${year}`;
      default:
        return '';
    }
  };

  const unixifyDates = dates => {
    const unixDates = [];
    dates.forEach(date => {
      let unixDate = Date.parse(date) / 1000;
      unixDates.push(unixDate.toString());
    });
    return unixDates;
  };

  const fixMarketCap = (marketCap) => {
    if (marketCap < 1000) {
      return marketCap.toFixed(2).toString();
    }
    else if (marketCap < 1000000) {
      return (marketCap / 1000).toFixed(2).toString() + "K";
    }
    else if (marketCap < 1000000000) {
      return (marketCap / 1000000).toFixed(2).toString() + "M";
    }
    else if (marketCap < 1000000000000) {
      return (marketCap / 1000000000).toFixed(2).toString() + "B";
    }
    else if (marketCap > 1000000000000) {
      return (marketCap / 1000000000000).toFixed(2).toString() + "T";
    }
    else return marketCap;
  }

  const getInterval = () => {
    let today = new Date();
    today.setHours(16);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    const open = new Date(today - 23400000);
    const oneDay = 86400000;
    const oneWeekAgo = new Date(today - oneDay * 7);
    const oneMonthAgo = new Date(today - oneDay * 30);
    const threeMonthsAgo = new Date(today - oneDay * 90);
    const oneYearAgo = new Date(today - oneDay * 365);
    // const fiveYearsAgo = new Date(today - oneDay * 365 * 5 - oneDay);

    switch (interval) {
      case '1D':
        return unixifyDates([open, today]);
      case '1W':
        return unixifyDates([oneWeekAgo, today]);
      case '1M':
        return unixifyDates([oneMonthAgo, today]);
      case '3M':
        return unixifyDates([threeMonthsAgo, today]);
      case '1Y':
        return unixifyDates([oneYearAgo, today]);
      // case ('5Y'):
      //     return unixifyDates([fiveYearsAgo, today]);
      default:
        return ['', ''];
    }
  };

  return (
    <div className='stock-page-container'>
      <div className='stock-container'>
        <div className='stock-symbol-price-container'>
          <h2 id='stock-symbol'>{symbol.toUpperCase()}</h2>
          <h2 id='stock-current-price'>{`$${activePrice}`}</h2>
          <div id='stock-price-change'>
            {change > 0 ? `$${change} (${changePercent}%)` : `-$${change * -1} (${changePercent}%)`}
            <div className='interval-long'>{intervalLong}</div>
          </div>
        </div>
        {isLoaded && <Graph
          symbol={symbol}
          color={color}
          times={times}
          prices={prices}
          stock={stock}
          setActivePrice={setActivePrice} />}
        <nav className='interval-bar'>
          <button
            className={
              interval === '1D' ? `interval-btn selected ${color}` : `interval-btn ${color}`
            }
            onClick={e => handleClick(e.target.innerHTML)}
          >
            1D
          </button>
          <button
            className={
              interval === '1W' ? `interval-btn selected ${color}` : `interval-btn ${color}`
            }
            onClick={e => handleClick(e.target.innerHTML)}
          >
            1W
          </button>
          <button
            className={
              interval === '1M' ? `interval-btn selected ${color}` : `interval-btn ${color}`
            }
            onClick={e => handleClick(e.target.innerHTML)}
          >
            1M
          </button>
          <button
            className={
              interval === '3M' ? `interval-btn selected ${color}` : `interval-btn ${color}`
            }
            onClick={e => handleClick(e.target.innerHTML)}
          >
            3M
          </button>
          <button
            className={
              interval === '1Y' ? `interval-btn selected ${color}` : `interval-btn ${color}`
            }
            onClick={e => handleClick(e.target.innerHTML)}
          >
            1Y
          </button>
          {/* <button
                        className={interval === '5Y' ? `interval-btn selected ${color}` : `interval-btn ${color}`}
                        onClick={(e) => handleClick(e.target.innerHTML)}>
                        5Y
                    </button> */}
        </nav>
        <div className='stock-about-container'>
          <h3 className='stock-dtls-title'>About</h3>
          <p>This company is this</p>
        </div>
        <div className='stock-financials-container'>
          <h3 className='stock-dtls-title'>Key Statistics</h3>
          <ul className='stock-financials-list'>
            <li id="market-cap">
              <div className='financials-title'>Market Cap</div>
              <div>{stock.financials && stock.financials.market_cap ? fixMarketCap(stock.financials.market_cap) : "-"}</div>
            </li>
            <li id="pe-ratio">
              <div className='financials-title'>Price-Earnings ratio</div>
              <div>{stock.financials && stock.financials.pe_ratio ? stock.financials.pe_ratio.toFixed(1) : "-"}</div>
            </li>
            <li id="dividend-yield">
              <div className='financials-title'>Dividend yield</div>
              <div>{stock.financials && stock.financials.dividend_yield ? stock.financials.dividend_yield.toFixed(2) : "-"}</div>
            </li>
            <li id="fifty-two-week-high">
              <div className='financials-title'>52 Week high</div>
              <div>{stock.financials && stock.financials["52_week_high"] ? `$${stock.financials["52_week_high"].toFixed(2)}` : "-"}</div>
            </li>
            <li id="fifty-two-week-low">
              <div className='financials-title'>52 Week low</div>
              <div>{stock.financials && stock.financials["52_week_low"] ? `$${stock.financials["52_week_low"].toFixed(2)}` : "-"}</div>
            </li>
          </ul>
        </div>
      </div>
      <button
        id='add-to-list-btn'
        className={`${color}`}
        onClick={() => !showWatchlistForm && setShowWatchlistform(true)}
      >
        &#10003; Add to Lists
      </button>
      {
        showWatchlistForm &&
        <div className={`${showWatchlistForm} stock-add-to-watchlist-form`}>
          <AddToWatchlist hideForm={closeWatchlistForm} symbol={symbol} stock={stock} />
        </div>
      }
    </div>
  );
}

export default Stock;
