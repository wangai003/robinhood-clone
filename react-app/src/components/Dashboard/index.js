import { useState } from 'react';
import { Link } from 'react-router-dom';
import Watchlists from '../Watchlists';
import './Dashboard.css';

const Dashboard = () => {
  const [showMenu, setShowMenu] = useState(false);


  return (
    <div className='dashboardContainer'>
      <div className='leftContainer'>
        <div className='portfolioContainer'>
          <div className='portfolioValue'>$999,999,999</div>
          <div className='priceChange'>
            <span>+$500,000 (+20%)</span>
            <span className='timeFrame'>Today</span>
          </div>
          <div className='graphContainer'>Filler</div>
          <div className={'buyingPowerContainer' + `${showMenu ? ' selected' : ''}`}>
            <div className='bpHeader noSelect' onClick={() => setShowMenu(!showMenu)}>
              <span>Buying Power</span>
              {!showMenu && <span>$100,000,000</span>}
            </div>
            {showMenu && (
              <div className='bpBody'>
                <div className='bpDetails'>
                  <div className='cash'>
                    <span>Brokerage Cash</span>
                    <span>$100,000,000</span>
                  </div>
                  <div className='power'>
                    <span>Buying Power</span>
                    <span>$100,000,000</span>
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
      <div className='rightContainer'>
        <div className='stocksListContainer'></div>
      </div>
      <Watchlists />
    </div>
  );
};

export default Dashboard;
