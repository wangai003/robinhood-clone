import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tokenizationService, stakingService, defiService } from '../../services/blockchainService';
import { isDemoMode } from '../../config/demo';
import './BlockchainPortfolio.css';

const BlockchainPortfolio = () => {
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 0,
    tokenizedAssets: {},
    stakingPositions: [],
    defiPositions: [],
    azixBalance: 1250.75,
    pendingRewards: 45.32
  });

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isDemoMode()) return;
    
    loadPortfolioData();
  }, []);

  const loadPortfolioData = () => {
    // Load tokenized assets
    const tokenizedAssets = tokenizationService.getTokenizedAssets();
    
    // Load staking positions
    const stakingPositions = JSON.parse(localStorage.getItem('stakingPositions') || '[]');
    
    // Load DeFi positions
    const defiPositions = JSON.parse(localStorage.getItem('yieldFarms') || '[]');
    
    // Calculate total portfolio value
    const tokenizedValue = Object.values(tokenizedAssets).reduce((sum, asset) => 
      sum + (asset.shares * asset.pricePerToken), 0
    );
    
    const stakingValue = stakingPositions.reduce((sum, position) => 
      sum + position.amount, 0
    );
    
    const totalValue = tokenizedValue + stakingValue + portfolioData.azixBalance;
    
    setPortfolioData({
      ...portfolioData,
      totalValue,
      tokenizedAssets,
      stakingPositions,
      defiPositions
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatTokenAmount = (amount, symbol) => {
    return `${amount.toFixed(4)} ${symbol}`;
  };

  const getAssetIcon = (symbol) => {
    const icons = {
      'AZIX': '🔷',
      'tSCOM': '📱',
      'tEQTY': '🏦',
      'tKCB': '🏛️',
      'tCOOP': '🤝',
      'tBAMB': '🏗️',
      'tEABL': '🍺',
      'tAAPL': '🍎',
      'tGOOGL': '🔍',
      'tMSFT': '💻',
      'tTSLA': '🚗'
    };
    return icons[symbol] || '🪙';
  };

  if (!isDemoMode()) return null;

  return (
    <div className="blockchain-portfolio">
      <div className="portfolio-header">
        <div className="portfolio-overview">
          <div className="total-value">
            <h2>{formatCurrency(portfolioData.totalValue)}</h2>
            <div className="value-change positive">
              <span>+$2,847.32 (+12.4%)</span>
              <span className="timeframe">Today</span>
            </div>
          </div>
          
          <div className="quick-stats">
            <div className="stat-item">
              <div className="stat-value">{formatTokenAmount(portfolioData.azixBalance, 'AZIX')}</div>
              <div className="stat-label">AZIX Balance</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{formatTokenAmount(portfolioData.pendingRewards, 'AZIX')}</div>
              <div className="stat-label">Pending Rewards</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{Object.keys(portfolioData.tokenizedAssets).length}</div>
              <div className="stat-label">Tokenized Assets</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{portfolioData.stakingPositions.length}</div>
              <div className="stat-label">Staking Positions</div>
            </div>
          </div>
        </div>
        
        <div className="portfolio-actions">
          <Link to="/staking" className="action-btn primary">
            💰 Stake AZIX
          </Link>
          <Link to="/kenyan-stocks" className="action-btn secondary">
            🪙 Tokenize
          </Link>
          <Link to="/defi" className="action-btn secondary">
            💎 DeFi
          </Link>
        </div>
      </div>

      <div className="portfolio-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab ${activeTab === 'tokenized' ? 'active' : ''}`}
          onClick={() => setActiveTab('tokenized')}
        >
          🪙 Tokenized Assets
        </button>
        <button 
          className={`tab ${activeTab === 'staking' ? 'active' : ''}`}
          onClick={() => setActiveTab('staking')}
        >
          💰 Staking
        </button>
        <button 
          className={`tab ${activeTab === 'defi' ? 'active' : ''}`}
          onClick={() => setActiveTab('defi')}
        >
          💎 DeFi
        </button>
      </div>

      <div className="portfolio-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="portfolio-breakdown">
              <h3>Portfolio Breakdown</h3>
              <div className="breakdown-chart">
                <div className="breakdown-item">
                  <div className="breakdown-color" style={{backgroundColor: '#667eea'}}></div>
                  <span>Tokenized Stocks (45%)</span>
                  <span>{formatCurrency(portfolioData.totalValue * 0.45)}</span>
                </div>
                <div className="breakdown-item">
                  <div className="breakdown-color" style={{backgroundColor: '#10b981'}}></div>
                  <span>AZIX Staking (30%)</span>
                  <span>{formatCurrency(portfolioData.totalValue * 0.30)}</span>
                </div>
                <div className="breakdown-item">
                  <div className="breakdown-color" style={{backgroundColor: '#f59e0b'}}></div>
                  <span>DeFi Positions (15%)</span>
                  <span>{formatCurrency(portfolioData.totalValue * 0.15)}</span>
                </div>
                <div className="breakdown-item">
                  <div className="breakdown-color" style={{backgroundColor: '#8b5cf6'}}></div>
                  <span>AZIX Balance (10%)</span>
                  <span>{formatCurrency(portfolioData.totalValue * 0.10)}</span>
                </div>
              </div>
            </div>
            
            <div className="recent-activity">
              <h3>Recent Blockchain Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">🪙</div>
                  <div className="activity-details">
                    <div className="activity-title">Tokenized 25 SCOM shares</div>
                    <div className="activity-time">2 hours ago</div>
                  </div>
                  <div className="activity-amount">+25 tSCOM</div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">💰</div>
                  <div className="activity-details">
                    <div className="activity-title">Staking rewards claimed</div>
                    <div className="activity-time">5 hours ago</div>
                  </div>
                  <div className="activity-amount">+12.5 AZIX</div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">💎</div>
                  <div className="activity-details">
                    <div className="activity-title">Added liquidity to AZIX/USDC</div>
                    <div className="activity-time">1 day ago</div>
                  </div>
                  <div className="activity-amount">+45.2 LP</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tokenized' && (
          <div className="tokenized-tab">
            <div className="assets-grid">
              {Object.values(portfolioData.tokenizedAssets).map(asset => (
                <div key={asset.tokenId} className="asset-card">
                  <div className="asset-header">
                    <div className="asset-icon">{getAssetIcon(`t${asset.underlyingAsset}`)}</div>
                    <div className="asset-info">
                      <div className="asset-symbol">t{asset.underlyingAsset}</div>
                      <div className="asset-name">{asset.underlyingAsset} Tokenized Shares</div>
                    </div>
                    <div className="asset-status">🟢 Active</div>
                  </div>
                  
                  <div className="asset-metrics">
                    <div className="metric">
                      <span className="metric-label">Shares</span>
                      <span className="metric-value">{asset.shares}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Token Price</span>
                      <span className="metric-value">{formatCurrency(asset.pricePerToken)}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Total Value</span>
                      <span className="metric-value">{formatCurrency(asset.shares * asset.pricePerToken)}</span>
                    </div>
                  </div>
                  
                  <div className="asset-actions">
                    <button className="trade-btn">Trade</button>
                    <button className="redeem-btn">Redeem</button>
                  </div>
                </div>
              ))}
            </div>
            
            {Object.keys(portfolioData.tokenizedAssets).length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🪙</div>
                <h3>No Tokenized Assets</h3>
                <p>Start tokenizing stocks to see them here</p>
                <Link to="/kenyan-stocks" className="cta-btn">
                  Tokenize Kenyan Stocks
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'staking' && (
          <div className="staking-tab">
            <div className="staking-summary">
              <div className="summary-card">
                <h4>Total Staked</h4>
                <div className="summary-value">
                  {formatTokenAmount(
                    portfolioData.stakingPositions.reduce((sum, pos) => sum + pos.amount, 0), 
                    'AZIX'
                  )}
                </div>
              </div>
              <div className="summary-card">
                <h4>Pending Rewards</h4>
                <div className="summary-value rewards">
                  {formatTokenAmount(portfolioData.pendingRewards, 'AZIX')}
                </div>
              </div>
              <div className="summary-card">
                <h4>Average APY</h4>
                <div className="summary-value apy">15.2%</div>
              </div>
            </div>
            
            <div className="staking-positions">
              {portfolioData.stakingPositions.map(position => (
                <div key={position.positionId} className="staking-position-card">
                  <div className="position-header">
                    <div className="position-amount">
                      {formatTokenAmount(position.amount, 'AZIX')}
                    </div>
                    <div className="position-apy">{position.apy}% APY</div>
                  </div>
                  
                  <div className="position-details">
                    <div className="detail-row">
                      <span>Duration:</span>
                      <span>{position.duration} days</span>
                    </div>
                    <div className="detail-row">
                      <span>Started:</span>
                      <span>{new Date(position.startTime).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-row">
                      <span>Ends:</span>
                      <span>{new Date(position.endTime).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <button className="claim-rewards-btn">
                    Claim Rewards
                  </button>
                </div>
              ))}
            </div>
            
            {portfolioData.stakingPositions.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">💰</div>
                <h3>No Staking Positions</h3>
                <p>Start staking AZIX tokens to earn rewards</p>
                <Link to="/staking" className="cta-btn">
                  Start Staking
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'defi' && (
          <div className="defi-tab">
            <div className="defi-positions">
              {portfolioData.defiPositions.map(position => (
                <div key={position.farmId} className="defi-position-card">
                  <div className="position-header">
                    <div className="position-name">LP Farm #{position.farmId.slice(-4)}</div>
                    <div className="position-apy">{position.apy}% APY</div>
                  </div>
                  
                  <div className="position-details">
                    <div className="detail-row">
                      <span>LP Tokens:</span>
                      <span>{position.lpTokenAmount.toFixed(4)}</span>
                    </div>
                    <div className="detail-row">
                      <span>Started:</span>
                      <span>{new Date(position.startTime).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <button className="harvest-btn">
                    🌾 Harvest
                  </button>
                </div>
              ))}
            </div>
            
            {portfolioData.defiPositions.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">💎</div>
                <h3>No DeFi Positions</h3>
                <p>Provide liquidity to earn DeFi rewards</p>
                <Link to="/defi" className="cta-btn">
                  Explore DeFi
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainPortfolio;