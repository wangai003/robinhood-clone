import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isDemoMode } from '../../config/demo';
import { getStockQuote } from '../../services/stockService';
import './DemoPortfolioStats.css';

const DemoPortfolioStats = () => {
  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 0,
    totalGainLoss: 0,
    totalGainLossPercent: 0,
    topPerformer: null,
    worstPerformer: null,
    diversification: []
  });

  const user = useSelector(state => state.session.user);
  const assets = user?.assets || {};
  const buyingPower = user?.buying_power || 0;

  useEffect(() => {
    if (!isDemoMode() || !user || Object.keys(assets).length === 0) return;

    const calculatePortfolioStats = async () => {
      try {
        let totalCurrentValue = 0;
        let totalOriginalValue = 0;
        const assetPerformance = [];
        const sectorAllocation = {};

        // Calculate performance for each asset
        for (const [symbol, asset] of Object.entries(assets)) {
          const quote = await getStockQuote(symbol);
          const currentValue = quote.current * asset.count;
          const originalValue = quote.previous_close * asset.count; // Using previous close as "original" for demo
          const gainLoss = currentValue - originalValue;
          const gainLossPercent = (gainLoss / originalValue) * 100;

          totalCurrentValue += currentValue;
          totalOriginalValue += originalValue;

          assetPerformance.push({
            symbol,
            currentValue,
            gainLoss,
            gainLossPercent,
            shares: asset.count,
            currentPrice: quote.current
          });

          // Simple sector classification for demo
          const sector = getSectorForStock(symbol);
          sectorAllocation[sector] = (sectorAllocation[sector] || 0) + currentValue;
        }

        // Add buying power to total value
        const totalPortfolioValue = totalCurrentValue + buyingPower;
        const totalGainLoss = totalCurrentValue - totalOriginalValue;
        const totalGainLossPercent = totalOriginalValue > 0 ? (totalGainLoss / totalOriginalValue) * 100 : 0;

        // Find best and worst performers
        const sortedPerformance = assetPerformance.sort((a, b) => b.gainLossPercent - a.gainLossPercent);
        const topPerformer = sortedPerformance[0];
        const worstPerformer = sortedPerformance[sortedPerformance.length - 1];

        // Convert sector allocation to percentages
        const diversification = Object.entries(sectorAllocation).map(([sector, value]) => ({
          sector,
          value,
          percentage: (value / totalCurrentValue) * 100
        }));

        setPortfolioStats({
          totalValue: totalPortfolioValue,
          totalGainLoss,
          totalGainLossPercent,
          topPerformer,
          worstPerformer,
          diversification,
          assetPerformance
        });

      } catch (error) {
        console.error('Error calculating portfolio stats:', error);
      }
    };

    calculatePortfolioStats();
    
    // Update every 30 seconds
    const interval = setInterval(calculatePortfolioStats, 30000);
    return () => clearInterval(interval);
  }, [user, assets, buyingPower]);

  const getSectorForStock = (symbol) => {
    const sectors = {
      'AAPL': 'Technology',
      'GOOGL': 'Technology',
      'MSFT': 'Technology',
      'META': 'Technology',
      'NVDA': 'Technology',
      'AMD': 'Technology',
      'TSLA': 'Automotive',
      'AMZN': 'E-commerce',
      'NFLX': 'Entertainment',
      'SPOT': 'Entertainment',
      'ROKU': 'Entertainment',
      'UBER': 'Transportation',
      'PYPL': 'Fintech',
      'SQ': 'Fintech',
      'COIN': 'Fintech'
    };
    return sectors[symbol] || 'Other';
  };

  if (!isDemoMode() || !user) return null;

  return (
    <div className="demo-portfolio-stats">
      <div className="portfolio-stats-header">
        <h3>📊 Portfolio Analytics</h3>
        <span className="live-indicator">🔴 Live</span>
      </div>

      <div className="portfolio-stats-grid">
        <div className="stat-card total-value">
          <div className="stat-label">Total Portfolio Value</div>
          <div className="stat-value">
            {portfolioStats.totalValue.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD'
            })}
          </div>
        </div>

        <div className={`stat-card gain-loss ${portfolioStats.totalGainLoss >= 0 ? 'positive' : 'negative'}`}>
          <div className="stat-label">Today's Gain/Loss</div>
          <div className="stat-value">
            {portfolioStats.totalGainLoss >= 0 ? '+' : ''}
            {portfolioStats.totalGainLoss.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD'
            })}
            <span className="stat-percent">
              ({portfolioStats.totalGainLossPercent >= 0 ? '+' : ''}
              {portfolioStats.totalGainLossPercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {portfolioStats.topPerformer && (
          <div className="stat-card top-performer">
            <div className="stat-label">🏆 Top Performer</div>
            <div className="stat-value">
              {portfolioStats.topPerformer.symbol}
              <span className="stat-percent positive">
                +{portfolioStats.topPerformer.gainLossPercent.toFixed(2)}%
              </span>
            </div>
          </div>
        )}

        {portfolioStats.worstPerformer && (
          <div className="stat-card worst-performer">
            <div className="stat-label">📉 Needs Attention</div>
            <div className="stat-value">
              {portfolioStats.worstPerformer.symbol}
              <span className="stat-percent negative">
                {portfolioStats.worstPerformer.gainLossPercent.toFixed(2)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {portfolioStats.diversification.length > 0 && (
        <div className="diversification-section">
          <h4>Portfolio Diversification</h4>
          <div className="diversification-bars">
            {portfolioStats.diversification.map(item => (
              <div key={item.sector} className="diversification-item">
                <div className="diversification-label">
                  {item.sector}
                  <span className="diversification-percent">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="diversification-bar">
                  <div 
                    className="diversification-fill"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoPortfolioStats;