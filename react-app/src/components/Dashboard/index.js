import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Watchlists from '../Watchlists';
import GraphBar from '../Graph/GraphBar';
import Graph from '../Graph';
import { getCandle } from '../../store/candles';
import { getStockQuote } from '../../services/stockService';
import { usePortfolioRealTimeUpdates } from '../../hooks/useRealTimeUpdates';
import { isDemoMode } from '../../config/demo';
import DemoPortfolioStats from '../DemoPortfolioStats';
import BlockchainPortfolio from '../BlockchainPortfolio';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeFrameText, setTimeFrameText] = useState('Today');
  const [timeFrame, setTimeFrame] = useState('1D');
  const [color, setColor] = useState('green');
  const [change, setChange] = useState(0);
  const [changePercent, setChangePercent] = useState(0);
  const [activePrice, setActivePrice] = useState(0);
  const [startingPrice, setStartingPrice] = useState(0);
  const [currPrice, setCurrPrice] = useState(0);
  const [quotes, setQuotes] = useState({});
  const candlesList = useSelector(state => state.candles);

  const assetList = useSelector(state =>
    state.portfolio?.assets ? Object.values(state.portfolio.assets) : []
  );
  const assetSymbols = assetList.map(asset => asset.symbol);
  const watchlists = useSelector(state =>
    state.portfolio?.watchlists ? Object.values(state.portfolio.watchlists) : []
  );

  const bp = useSelector(state =>
    state.portfolio?.buying_power?.toLocaleString
      ? state.portfolio.buying_power.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })
      : '$0.00'
  );

  useEffect(() => {
    (async () => {
      try {
        let sum = 0;
        const quotes = {};

        for (const symbol of assetSymbols) {
          const quote = await getStockQuote(symbol);
          sum += quote.current * (assetList.find(asset => asset.symbol === symbol)?.count || 0);
          quotes[symbol] = quote;
        }

        const watchlistSet = new Set();
        for (const watchlist of watchlists) {
          for (const stock of Object.values(watchlist.stocks || {})) {
            if (!assetSymbols.includes(stock.symbol)) {
              watchlistSet.add(stock.symbol);
            }
          }
        }

        for (const symbol of watchlistSet) {
          const quote = await getStockQuote(symbol);
          quotes[symbol] = quote;
        }

        setCurrPrice(sum);
        setQuotes(quotes);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    })();
  }, []);

  usePortfolioRealTimeUpdates((portfolioData) => {
    if (portfolioData) {
      setCurrPrice(portfolioData.totalValue - portfolioData.buyingPower);
    }
  });

  useEffect(() => {
    (async () => {
      for (const symbol of assetSymbols) {
        const candle = candlesList[timeFrame]?.[symbol];

        if (!candle) {
          await dispatch(getCandle(timeFrame, symbol));
        }
      }
    })();

    setIsLoaded(true);
  }, [timeFrame]);

  const candles = {};
  for (const [symbol, data] of Object.entries(candlesList[timeFrame] || {})) {
    if (assetSymbols.includes(symbol)) {
      data.forEach(d => {
        candles[d.time] = {
          ...candles[d.time],
          [symbol]: d.price * (assetList.find(asset => asset.symbol === symbol)?.count || 0),
        };
      });
    }
  }

  const filtedCandles = Object.fromEntries(
    Object.entries(candles)
      .filter(candle => Object.keys(candle[1]).length === assetSymbols.length)
      .map(candle => [candle[0], Object.values(candle[1]).reduce((sum, price) => sum + price)])
  );

  const times = Object.keys(filtedCandles);
  const prices = Object.values(filtedCandles);

  useEffect(() => {
    setStartingPrice(prices[0] || 0);
  }, [prices]);

  useEffect(() => {
    if (currPrice - startingPrice < 0) {
      setColor('red');
    }
  }, [currPrice, startingPrice]);

  useEffect(() => {
    const change = (activePrice || currPrice) - startingPrice;
    const percentChange = startingPrice ? (change * 100) / startingPrice : 0;
    setChange(change);
    setChangePercent(percentChange);
  }, [currPrice, activePrice, startingPrice]);

  if (isDemoMode()) {
    return <BlockchainPortfolio />;
  }

  return (
    <div className='dashboardContainer'>
      <div className='leftContainer'>
        <div className='portfolioContainer'>
          <div className='portfolioValue'>{`${(activePrice || currPrice)?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}`}</div>
          <div className='priceChange'>
            <span>
              {`${change > 0 ? '+' : ''}${change.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })} (${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%)`}
            </span>
            <span className='timeFrame'> {timeFrameText}</span>
          </div>
          <div className='graphContainer'>
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
          </div>
          <div className={'buyingPowerContainer' + `${showMenu ? ' selected' : ''}`}>
            <div className='bpHeader noSelect' onClick={() => setShowMenu(!showMenu)}>
              <span>Buying Power</span>
              {!showMenu && <span>{bp}</span>}
            </div>
            {showMenu && (
              <div className='bpBody'>
                <div className='bpDetails'>
                  <div className='cash'>
                    <span>Brokerage Cash</span>
                    <span>{bp}</span>
                  </div>
                  <div className='power'>
                    <span>Buying Power</span>
                    <span>{bp}</span>
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
          {isDemoMode() && <DemoPortfolioStats />}
        </div>
      </div>
      <div className='rightWrapper'>
        <div className='rightContainer'>
          <div className='stocksListContainer'>
            <div className='listContainer'>
              <header className='listTitle'>Stocks</header>
              {assetList.map(asset => (
                <Link className='stockContainer' key={asset.id} to={`/stocks/${asset.symbol}`}>
                  <div className='stockDetails'>
                    <span className='stockSymbol'>{asset.symbol}</span>
                    <span className='stockCount'>{`${asset.count} ${
                      asset.count === 1 ? 'Share' : 'Shares'
                    }`}</span>
                  </div>
                  <div className='miniGraph'></div>
                  <div className='stockQuote'>
                    <span className='stockPrice'>
                      {quotes[asset.symbol]?.current?.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </span>
                    <span
                      className={`stockChange ${
                        quotes[asset.symbol]?.change > 0 ? 'green' : 'red'
                      }`}
                    >
                      {`${quotes[asset.symbol]?.change > 0 ? '+' : ''}${
                        quotes[asset.symbol]?.change
                      }`}
                      %
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <Watchlists quotes={quotes} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

