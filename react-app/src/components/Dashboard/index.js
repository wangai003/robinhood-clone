import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Watchlists from '../Watchlists';
import { convertTimes, getInterval, handleClick } from '../utils/graphUtils';
import GraphBar from '../Graph/GraphBar';
import Graph from '../Graph';
import './Dashboard.css';

const Dashboard = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [interval, setInterval] = useState('1D');
  const [intervalLong, setIntervalLong] = useState('Today');
  const [resolution, setResolution] = useState('5');
  const [prices, setPrices] = useState([]);
  const [times, setTimes] = useState([]);
  const [color, setColor] = useState('green');
  const [change, setChange] = useState(0);
  const [changePercent, setChangePercent] = useState(0);
  const [currValue, setCurrValue] = useState(0);
  const [activeValue, setActiveValue] = useState(0);
  const [dailyCandles, setDailyCandles] = useState([]);

  const assetList = useSelector(state => Object.values(state.portfolio.assets));
  const bp = useSelector(state => state.portfolio.buying_power).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  useEffect(() => {
    (async () => {
      let i = 0;
      const values = [];
      const times = [];
      for (const asset of assetList) {
        const fromTo = getInterval(interval);
        const response = await fetch(
          `/api/stocks/${asset.symbol}/candles?from=${fromTo[0]}&to=${fromTo[1]}&resolution=${resolution}`
        );
        const data = await response.json();
        if (i === 0) {
          for (const obj of data) {
            let price = obj.price * asset.count;
            values.push(price);
            times.push(convertTimes(obj.time, interval));
          }
        } else {
          let j = 0;
          const count = asset.count;
          for (const obj of data) {
            values[j] += obj.price * count;
            j++;
          }
        }
        i++;
      }
      if (Object.keys(assetList).length) {
        const change = (values[values.length - 1] - values[0]).toFixed(2);
        const changePercent = ((100 * change) / values[0]).toFixed(2);
        const color = change > 0 ? 'green' : 'red';

        setTimes(times);
        setCurrValue(values[values.length - 1].toFixed(2));
        setActiveValue(values[values.length - 1].toFixed(2));
        setChange(change);
        setChangePercent(changePercent);
        setPrices(values);
      }
      setIsLoaded(true);
    })();
  }, [isLoaded, interval]);

  const setFunctions = { setInterval, setIntervalLong, setResolution };

  return (
    <div className='dashboardContainer'>
      <div className='leftContainer'>
        <div className='portfolioContainer'>
          <div className='portfolioValue'>{`$${activeValue}`}</div>
          <div className='priceChange'>
            <span>
              {change > 0
                ? `$${change} (${changePercent}%)`
                : `-$${change * -1} (${changePercent}%)`}
            </span>
            <span className='timeFrame'>Today</span>
          </div>
          <div className='graphContainer'>
            {isLoaded && prices.length && (
              <Graph
                color={color}
                times={times}
                prices={prices}
                current={currValue}
                setActivePrice={setActiveValue}
              />
            )}
            <GraphBar color={color} interval={interval} setFunctions={setFunctions} />
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
                    <span className='stockPrice'>$100</span>
                    <span className='stockChange'>-10%</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <Watchlists />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
