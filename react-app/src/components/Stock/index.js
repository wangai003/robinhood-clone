import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import AddToWatchlist from './AddToWatchlist';
import BuySellStockForm from './BuySellStockForm';
// import { loadAssets } from '../../store/portfolio/assets';
import Graph from '../Graph';
import GraphBar from '../Graph/GraphBar';
import { convertTimes, getInterval, handleClick } from '../utils/graphUtils';
import { fixMarketCap } from '../utils/stockUtils';
import './Stock.css';

function Stock() {
  const [showMenu, setShowMenu] = useState(false);
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
  const [buySell, setBuySell] = useState('');
  const [showBuySell, SetShowBuySell] = useState(false);
  const [assetsValue, setAssetsValue] = useState(0);
  const assets = useSelector(state => state.portfolio.assets);
  const stocks = useSelector(state => state.stocks);
  const bp = useSelector(state => state.portfolio.buying_power);

  const { symbol } = useParams();

  const closeWatchlistForm = () => {
    setShowWatchlistform(false);
  };

  const closeBuySellForm = () => {
    SetShowBuySell(false);
  };

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
      if (assets[symbol.toUpperCase()]) {
        setAssetsValue((assets[symbol.toUpperCase()].count * stock.current))
      }
    })();
  }, [isLoaded])

  useEffect(() => {
    (async () => {
      const fromTo = getInterval(interval);
      const response = await fetch(
        `/api/stocks/${symbol}/candles?from=${fromTo[0]}&to=${fromTo[1]}&resolution=${resolution}`
      );
      const data = await response.json();
      const prices = [];
      const times = [];

      for (const obj of data) {
        prices.push(obj.price.toFixed(2));
        times.push(convertTimes(obj.time, interval));
      }

      const change = (prices[prices.length - 1] - prices[0]);
      const changePercent = (100 * change / prices[0]).toFixed(2);
      const color = change > 0 ? 'green' : 'red';

      setChange(change);
      setChangePercent(changePercent);
      setColor(color);
      setTimes(times);
      setPrices(prices);
    })();
  }, [interval]);

  const setFunctions = { setInterval, setIntervalLong, setResolution };

  return (
    <div className='stock-page-container'>
      <div className='stock-container'>
        <div className='stock-symbol-price-container'>
          <h2 id='stock-symbol'>{symbol.toUpperCase()}</h2>
          <h2 id='stock-current-price'>{activePrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</h2>
          <div id='stock-price-change'>
            {change > 0 ? `${change.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} (${changePercent}%)` : `-$${change * -1} (${changePercent}%)`}
            <div className='interval-long'>{intervalLong}</div>
          </div>
        </div>
        {isLoaded && <Graph
          symbol={symbol}
          color={color}
          times={times}
          prices={prices}
          current={stock.current}
          setActivePrice={setActivePrice} />}
        <GraphBar color={color} interval={interval} setFunctions={setFunctions} />
        <div className='stock-about-container'>
          <h3 className='stock-dtls-title'>About</h3>
          {stocks[symbol.toUpperCase()] &&
            <p>{stocks[symbol.toUpperCase()].name}</p>
          }
        </div>
        <div className='stock-financials-container'>
          <h3 className='stock-dtls-title'>Key Statistics</h3>
          <ul className='stock-financials-list'>
            <li id='market-cap'>
              <div className='financials-title'>Market Cap</div>
              <div>
                {stock.financials && stock.financials.market_cap
                  ? fixMarketCap(stock.financials.market_cap)
                  : '-'}
              </div>
            </li>
            <li id='pe-ratio'>
              <div className='financials-title'>Price-Earnings ratio</div>
              <div>
                {stock.financials && stock.financials.pe_ratio
                  ? stock.financials.pe_ratio.toFixed(1)
                  : '-'}
              </div>
            </li>
            <li id='dividend-yield'>
              <div className='financials-title'>Dividend yield</div>
              <div>
                {stock.financials && stock.financials.dividend_yield
                  ? stock.financials.dividend_yield.toFixed(2)
                  : '-'}
              </div>
            </li>
            <li id='fifty-two-week-high'>
              <div className='financials-title'>52 Week high</div>
              <div>
                {stock.financials && stock.financials['52_week_high']
                  ? `${stock.financials['52_week_high'].toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`
                  : '-'}
              </div>
            </li>
            <li id='fifty-two-week-low'>
              <div className='financials-title'>52 Week low</div>
              <div>
                {stock.financials && stock.financials['52_week_low']
                  ? `${stock.financials['52_week_low'].toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`
                  : '-'}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className='stock-btn-container'>
        <div className='stock-owned-container'>
          {
            isLoaded && assets[symbol.toUpperCase()] &&
            <div>{`You own ${assets[symbol.toUpperCase()].count} shares worth ${assetsValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`}</div>
          }
        </div>
        <button
          id='add-to-list-btn'
          className={`${color}`}
          onClick={() => !showWatchlistForm && setShowWatchlistform(true)}
        >
          &#10003; Add to Lists
        </button>
        <div className='buy-sell-btn-container'>
          <button
            id='buy-stock-btn'
            className={`${color}` + `${buySell === 'buy' && showBuySell ? ' trade-selected' : ''}`}
            onClick={() => {
              setBuySell('buy');
              SetShowBuySell(true);
            }}>
            Buy {symbol.toUpperCase()}
          </button>
          <button
            id='sell-stock-btn'
            className={`${color}` + `${buySell === 'sell' && showBuySell ? ' trade-selected' : ''}`}
            onClick={() => {
              setBuySell('sell');
              SetShowBuySell(true);
            }}
          >Sell {symbol.toUpperCase()}
          </button>
        </div>
        {isLoaded && showBuySell &&
          < BuySellStockForm
            symbol={symbol.toUpperCase()}
            stock={stock}
            buySell={buySell}
            name={stocks[symbol.toUpperCase()].name}
            hideForm={closeBuySellForm} />
        }
        <div className={'stock buyingPowerContainer' + `${showMenu ? ' selected' : ''}`}>
          <div className='bpHeader noSelect' onClick={() => setShowMenu(!showMenu)}>
            <span>Buying Power</span>
            {!showMenu && <span>{bp?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>}
          </div>
          {showMenu && (
            <div className='bpBody'>
              <div className='bpDetails'>
                <div className='cash'>
                  <span>Brokerage Cash</span>
                  <span>{bp?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                </div>
                <div className='power'>
                  <span>Buying Power</span>
                  <span>{bp?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                </div>
                <Link className='btn btn-filled deposit' to='/add-funds'>
                  Deposit Funds
                </Link>
              </div>
              <div className='bpMessage'>
                Buying Power represents the total value of assets you can purchase.
              </div>
            </div>
          )}
        </div>
      </div>
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
