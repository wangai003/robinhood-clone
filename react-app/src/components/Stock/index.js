import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AddToWatchlist from './AddToWatchlist';
import BuySellStockForm from './BuySellStockForm';
import Graph from '../Graph';
import GraphBar from '../Graph/GraphBar';
import { getCandle } from '../../store/candles';
import { fixMarketCap } from '../utils/stockUtils';
import './Stock.css';

function Stock() {
  const dispatch = useDispatch();
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
  const candlesList = useSelector(state => state.candles);

  const assets = useSelector(state => state.portfolio.assets);
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
    })();
  }, []);

  useEffect(() => {
    if (assets[symbol]) {
      setAssetsValue((assets[symbol].count * stock.current).toFixed(2));
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
  }, [timeFrame]);

  useEffect(() => {
    const currCandles = candlesList[timeFrame]?.[symbol];
    if (currCandles) {
      const candles = Object.fromEntries(currCandles.map(c => [c.time, c.price]));

      setTimes(Object.keys(candles));
      setPrices(Object.values(candles));
    }
  }, [candlesList, timeFrame]);

  const startingPrice = stock.open;
  const lastPrice = stock.current;

  useEffect(() => {
    if (lastPrice - startingPrice < 0) {
      setColor('red');
    }
  }, [lastPrice]);

  useEffect(() => {
    const change = activePrice - startingPrice;
    const percentChange = (change * 100) / startingPrice;
    setChange(change);
    setChangePercent(percentChange);
  }, [activePrice]);

  return (
    <div className='stock-page-container'>
      <div className='stock-container'>
        <div className='stock-symbol-price-container'>
          <h2 id='stock-symbol'>{symbol.toUpperCase()}</h2>
          <h2 id='stock-current-price'>{`$${(activePrice || stock.current)?.toLocaleString(
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
          {stocks[symbol.toUpperCase()] && <p>{stocks[symbol.toUpperCase()].name}</p>}
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
                  ? `$${stock.financials['52_week_high'].toFixed(2)}`
                  : '-'}
              </div>
            </li>
            <li id='fifty-two-week-low'>
              <div className='financials-title'>52 Week low</div>
              <div>
                {stock.financials && stock.financials['52_week_low']
                  ? `$${stock.financials['52_week_low'].toFixed(2)}`
                  : '-'}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className='stock-btn-container'>
        <div cla>
          {isLoaded && assets[symbol.toUpperCase()] && (
            <div>
              <div>{`You own ${
                assets[symbol.toUpperCase()].count
              } shares worth $${assetsValue}`}</div>
            </div>
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
            className={`${color}`}
            onClick={() => {
              setBuySell('buy');
              SetShowBuySell(true);
            }}
          >
            Buy {symbol.toUpperCase()}
          </button>
          <button
            id='sell-stock-btn'
            className={`${color}`}
            onClick={() => {
              setBuySell('sell');
              SetShowBuySell(true);
            }}
          >
            Sell {symbol.toUpperCase()}
          </button>
        </div>
        {isLoaded && showBuySell && (
          <BuySellStockForm
            symbol={symbol.toUpperCase()}
            stock={stock}
            buySell={buySell}
            name={stocks[symbol.toUpperCase()].name}
            hideForm={closeBuySellForm}
          />
        )}
      </div>
      {showWatchlistForm && (
        <div className={`${showWatchlistForm} stock-add-to-watchlist-form`}>
          <AddToWatchlist hideForm={closeWatchlistForm} symbol={symbol} stock={stock} />
        </div>
      )}
    </div>
  );
}

export default Stock;
