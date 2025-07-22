import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isDemoMode, getDemoConfig } from '../../config/demo';
import { generateMockQuote, MOCK_STOCKS } from '../../services/mockData';
import './DemoStockTicker.css';

const DemoStockTicker = () => {
  const [tickerData, setTickerData] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isDemoMode()) return;

    // Select popular stocks for ticker
    const tickerSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'META', 'NVDA', 'AMZN', 'NFLX'];
    
    const updateTicker = () => {
      const newTickerData = tickerSymbols.map(symbol => {
        const quote = generateMockQuote(symbol);
        return {
          symbol,
          name: MOCK_STOCKS[symbol]?.name || symbol,
          price: quote.current,
          change: quote.change,
          changePercent: quote.change_percent
        };
      });
      setTickerData(newTickerData);
    };

    // Initial load
    updateTicker();

    // Update every 3 seconds for ticker effect
    const interval = setInterval(updateTicker, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!isDemoMode() || !isVisible) return null;

  return (
    <div className="demo-stock-ticker">
      <div className="ticker-header">
        <span className="ticker-title">⛓️ Live Blockchain Trading</span>
        <button 
          className="ticker-close"
          onClick={() => setIsVisible(false)}
          title="Hide ticker"
        >
          ×
        </button>
      </div>
      <div className="ticker-scroll">
        <div className="ticker-content">
          {tickerData.concat(tickerData).map((stock, index) => (
            <Link 
              key={`${stock.symbol}-${index}`}
              to={`/stocks/${stock.symbol}`}
              className="ticker-item"
            >
              <span className="ticker-symbol">{stock.symbol}</span>
              <span className="ticker-price">
                ${stock.price.toFixed(2)}
              </span>
              <span className={`ticker-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                {stock.change >= 0 ? '+' : ''}
                {stock.changePercent.toFixed(2)}%
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoStockTicker;