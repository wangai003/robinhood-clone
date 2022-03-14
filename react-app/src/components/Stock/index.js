import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import AddToWatchlist from './AddToWatchlist';
import BuySellStockForm from './BuySellStockForm';
import Graph from '../Graph';
import GraphBar from '../Graph/GraphBar';
import { getCandle } from '../../store/candles';
import { fixMarketCap } from '../utils/stockUtils';
import './Stock.css';

function Stock() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [stock, setStock] = useState({});
  const [activePrice, setActivePrice] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeFrame, setTimeFrame] = useState('1D');
  const [timeFrameText, setTimeFrameText] = useState('Today');
  const [color, setColor] = useState('green');
  const [change, setChange] = useState(0);
  const [changePercent, setChangePercent] = useState(0);
  const [showWatchlistForm, setShowWatchlistform] = useState(false);
  const [buySell, setBuySell] = useState('');
  const [showBuySell, SetShowBuySell] = useState(false);
  const [assetsValue, setAssetsValue] = useState(0);
  const [times, setTimes] = useState([]);
  const [prices, setPrices] = useState([]);
  const [startingPrice, setStartingPrice] = useState(0);
  const [currPrice, setCurrPrice] = useState(0);
  const candlesList = useSelector(state => state.candles);

  const assets = useSelector(state => state.portfolio.assets);
  const bp = useSelector(state => state.portfolio.buying_power);
  const stocks = useSelector(state => state.stocks);

  const symbol = useParams().symbol.toUpperCase();

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
      setCurrPrice(stock.current);
    })();
  }, [symbol]);

  useEffect(() => {
    if (assets[symbol]) {
      setAssetsValue(assets[symbol].count * stock.current);
    }
  });

  useEffect(() => {
    (async () => {
      const candle = candlesList[timeFrame]?.[symbol];

      if (!candle) {
        await dispatch(getCandle(timeFrame, symbol));
      }
    })();
    setIsLoaded(true);
  }, [symbol, timeFrame]);

  useEffect(() => {
    const currCandles = candlesList[timeFrame]?.[symbol];
    if (currCandles) {
      const candles = Object.fromEntries(currCandles.map(c => [c.time, c.price]));

      setTimes(Object.keys(candles));
      setPrices(Object.values(candles));
    }
  }, [symbol, candlesList, timeFrame]);

  useEffect(() => {
    setStartingPrice(prices[0]);
  }, [prices]);

  useEffect(() => {
    if (currPrice - startingPrice < 0) {
      setColor('red');
    }
  }, [currPrice, startingPrice]);

  useEffect(() => {
    const change = (activePrice || currPrice) - startingPrice;
    const percentChange = (change * 100) / startingPrice;
    setChange(change);
    setChangePercent(percentChange);
  }, [currPrice, activePrice, startingPrice]);

  return (
    <div className='stock-page-container'>
      <div className='stock-container'>
        <div className='stock-symbol-price-container'>
          <h2 id='stock-symbol'>{symbol}</h2>
          <h2 id='stock-current-price'>{`${(activePrice || stock.current)?.toLocaleString(
            'en-US',
            {
              style: 'currency',
              currency: 'USD',
            }
          )}`}</h2>
          <div id='stock-price-change'>
            {`${change.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })} (${changePercent.toFixed(2)}%)`}
            <div className='interval-long'> {timeFrameText}</div>
          </div>
        </div>
        {isLoaded && (
          <Graph
            times={times}
            prices={prices}
            color={color}
            inverval={timeFrame}
            setActivePrice={setActivePrice}
          />
        )}
        <GraphBar
          color={color}
          timeFrame={timeFrame}
          setTimeFrame={setTimeFrame}
          setTimeFrameText={setTimeFrameText}
        />
        <div className='stock-about-container'>
          <h3 className='stock-dtls-title'>About</h3>
          {stocks[symbol] && <p>{stocks[symbol].name}</p>}
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
                  ? `${stock.financials['52_week_high'].toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}`
                  : '-'}
              </div>
            </li>
            <li id='fifty-two-week-low'>
              <div className='financials-title'>52 Week low</div>
              <div>
                {stock.financials && stock.financials['52_week_low']
                  ? `${stock.financials['52_week_low'].toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}`
                  : '-'}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className='stock-btn-container'>
        <div className='stock-owned-container'>
          {isLoaded && assets[symbol] && (
            <div>{`You own ${assets[symbol].count} shares worth ${assetsValue.toLocaleString(
              'en-US',
              {
                style: 'currency',
                currency: 'USD',
              }
            )}`}</div>
          )}
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
            }}
          >
            Buy {symbol}
          </button>
          <button
            id='sell-stock-btn'
            className={`${color}` + `${buySell === 'sell' && showBuySell ? ' trade-selected' : ''}`}
            onClick={() => {
              setBuySell('sell');
              SetShowBuySell(true);
            }}
            disabled={!assets[symbol]}
          >
            Sell {symbol}
          </button>
        </div>

        {isLoaded && showBuySell && (
          <BuySellStockForm
            symbol={symbol}
            stock={stock}
            buySell={buySell}
            name={stocks[symbol].name}
            hideForm={closeBuySellForm}
            setIsLoaded={setIsLoaded}
          />
        )}
        <div className={'stock buyingPowerContainer' + `${showMenu ? ' selected' : ''}`}>
          <div className='bpHeader noSelect' onClick={() => setShowMenu(!showMenu)}>
            <span>Buying Power</span>
            {!showMenu && (
              <span>{bp?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
            )}
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
      {showWatchlistForm && (
        <AddToWatchlist
          showModal={showWatchlistForm}
          setShowModal={setShowWatchlistform}
          symbol={symbol}
          stock={stock}
        />
      )}
    </div>
  );
}

export default Stock;
