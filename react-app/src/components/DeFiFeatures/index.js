import React, { useState, useEffect } from 'react';
import { defiService } from '../../services/blockchainService';
import { isDemoMode } from '../../config/demo';
import './DeFiFeatures.css';

const DeFiFeatures = () => {
  const [liquidityPools, setLiquidityPools] = useState([]);
  const [yieldFarms, setYieldFarms] = useState([]);
  const [showLiquidityModal, setShowLiquidityModal] = useState(false);
  const [selectedPool, setSelectedPool] = useState(null);
  const [azixAmount, setAzixAmount] = useState('');
  const [usdcAmount, setUsdcAmount] = useState('');
  const [isProvidingLiquidity, setIsProvidingLiquidity] = useState(false);

  useEffect(() => {
    if (!isDemoMode()) return;
    
    loadDeFiData();
  }, []);

  const loadDeFiData = () => {
    // Mock liquidity pools data
    const pools = [
      {
        id: 'azix-usdc',
        name: 'AZIX/USDC',
        token0: 'AZIX',
        token1: 'USDC',
        tvl: 2500000,
        apy: 45.5,
        volume24h: 125000,
        fees24h: 375,
        userLiquidity: 0,
        userShare: 0
      },
      {
        id: 'azix-eth',
        name: 'AZIX/ETH',
        token0: 'AZIX',
        token1: 'ETH',
        tvl: 1800000,
        apy: 38.2,
        volume24h: 89000,
        fees24h: 267,
        userLiquidity: 0,
        userShare: 0
      },
      {
        id: 'tscom-usdc',
        name: 'tSCOM/USDC',
        token0: 'tSCOM',
        token1: 'USDC',
        tvl: 450000,
        apy: 28.7,
        volume24h: 32000,
        fees24h: 96,
        userLiquidity: 0,
        userShare: 0
      }
    ];
    
    setLiquidityPools(pools);
    
    // Mock yield farms data
    const farms = JSON.parse(localStorage.getItem('yieldFarms') || '[]');
    setYieldFarms(farms);
  };

  const handleProvideLiquidity = async () => {
    if (!azixAmount || !usdcAmount || parseFloat(azixAmount) <= 0 || parseFloat(usdcAmount) <= 0) {
      alert('Please enter valid amounts for both tokens');
      return;
    }
    
    setIsProvidingLiquidity(true);
    try {
      const result = await defiService.provideLiquidity(parseFloat(azixAmount), parseFloat(usdcAmount));
      console.log('Liquidity provided:', result);
      
      setShowLiquidityModal(false);
      setAzixAmount('');
      setUsdcAmount('');
      loadDeFiData();
      
      alert(`Successfully provided liquidity!\nLP Tokens Received: ${result.lpTokensReceived.toFixed(4)}\nPool Share: ${(result.poolShare * 100).toFixed(4)}%\nTransaction Hash: ${result.txHash}`);
    } catch (error) {
      console.error('Liquidity provision failed:', error);
      alert('Failed to provide liquidity. Please try again.');
    } finally {
      setIsProvidingLiquidity(false);
    }
  };

  const handleStartYieldFarming = async (poolId, lpAmount) => {
    try {
      const result = await defiService.startYieldFarming(lpAmount);
      console.log('Yield farming started:', result);
      
      loadDeFiData();
      alert(`Yield farming started!\nLP Tokens Staked: ${lpAmount}\nAPY: ${result.apy}%\nTransaction Hash: ${result.txHash}`);
    } catch (error) {
      console.error('Yield farming failed:', error);
      alert('Failed to start yield farming. Please try again.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toFixed(2);
  };

  if (!isDemoMode()) return null;

  return (
    <div className="defi-features-container">
      <div className="defi-header">
        <div className="defi-title">
          <h2>💎 DeFi Features</h2>
          <p>Provide liquidity, earn fees, and maximize your yields</p>
        </div>
        <div className="defi-stats">
          <div className="stat-card">
            <div className="stat-value">{formatCurrency(liquidityPools.reduce((sum, pool) => sum + pool.tvl, 0))}</div>
            <div className="stat-label">Total Value Locked</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{formatCurrency(liquidityPools.reduce((sum, pool) => sum + pool.volume24h, 0))}</div>
            <div className="stat-label">24h Volume</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{yieldFarms.length}</div>
            <div className="stat-label">Active Farms</div>
          </div>
        </div>
      </div>

      <div className="liquidity-pools-section">
        <h3>💧 Liquidity Pools</h3>
        <div className="pools-grid">
          {liquidityPools.map(pool => (
            <div key={pool.id} className="pool-card">
              <div className="pool-header">
                <div className="pool-name">
                  <div className="pool-tokens">
                    <span className="token">{pool.token0}</span>
                    <span className="separator">/</span>
                    <span className="token">{pool.token1}</span>
                  </div>
                  <div className="pool-apy">{pool.apy}% APY</div>
                </div>
              </div>
              
              <div className="pool-stats">
                <div className="stat-row">
                  <span>TVL:</span>
                  <span>{formatCurrency(pool.tvl)}</span>
                </div>
                <div className="stat-row">
                  <span>24h Volume:</span>
                  <span>{formatCurrency(pool.volume24h)}</span>
                </div>
                <div className="stat-row">
                  <span>24h Fees:</span>
                  <span className="fees">{formatCurrency(pool.fees24h)}</span>
                </div>
                {pool.userLiquidity > 0 && (
                  <div className="stat-row">
                    <span>Your Liquidity:</span>
                    <span className="user-liquidity">{formatCurrency(pool.userLiquidity)}</span>
                  </div>
                )}
              </div>
              
              <div className="pool-actions">
                <button 
                  className="provide-liquidity-btn"
                  onClick={() => {
                    setSelectedPool(pool);
                    setShowLiquidityModal(true);
                  }}
                >
                  + Add Liquidity
                </button>
                {pool.userLiquidity > 0 && (
                  <button 
                    className="farm-btn"
                    onClick={() => handleStartYieldFarming(pool.id, pool.userLiquidity * 0.1)}
                  >
                    🚜 Farm
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {yieldFarms.length > 0 && (
        <div className="yield-farms-section">
          <h3>🚜 Your Yield Farms</h3>
          <div className="farms-grid">
            {yieldFarms.map(farm => (
              <div key={farm.farmId} className="farm-card">
                <div className="farm-header">
                  <div className="farm-name">LP Farm #{farm.farmId.slice(-4)}</div>
                  <div className="farm-status active">🟢 Active</div>
                </div>
                
                <div className="farm-details">
                  <div className="detail-row">
                    <span>LP Tokens Staked:</span>
                    <span>{farm.lpTokenAmount.toFixed(4)}</span>
                  </div>
                  <div className="detail-row">
                    <span>APY:</span>
                    <span className="apy">{farm.apy}%</span>
                  </div>
                  <div className="detail-row">
                    <span>Started:</span>
                    <span>{new Date(farm.startTime).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <button className="harvest-btn">
                  🌾 Harvest Rewards
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showLiquidityModal && selectedPool && (
        <div className="liquidity-modal-overlay" onClick={() => setShowLiquidityModal(false)}>
          <div className="liquidity-modal" onClick={e => e.stopPropagation()}>
            <div className="liquidity-modal-header">
              <h3>Add Liquidity to {selectedPool.name}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowLiquidityModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="liquidity-modal-content">
              <div className="pool-info">
                <div className="info-row">
                  <span>Pool:</span>
                  <span>{selectedPool.name}</span>
                </div>
                <div className="info-row">
                  <span>Current APY:</span>
                  <span className="apy">{selectedPool.apy}%</span>
                </div>
                <div className="info-row">
                  <span>TVL:</span>
                  <span>{formatCurrency(selectedPool.tvl)}</span>
                </div>
              </div>
              
              <div className="liquidity-inputs">
                <div className="input-group">
                  <label>{selectedPool.token0} Amount</label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      value={azixAmount}
                      onChange={(e) => setAzixAmount(e.target.value)}
                      placeholder="0.0"
                      min="0"
                      step="0.0001"
                    />
                    <span className="input-suffix">{selectedPool.token0}</span>
                  </div>
                </div>
                
                <div className="input-group">
                  <label>{selectedPool.token1} Amount</label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      value={usdcAmount}
                      onChange={(e) => setUsdcAmount(e.target.value)}
                      placeholder="0.0"
                      min="0"
                      step="0.0001"
                    />
                    <span className="input-suffix">{selectedPool.token1}</span>
                  </div>
                </div>
              </div>
              
              {azixAmount && usdcAmount && (
                <div className="liquidity-summary">
                  <div className="summary-row">
                    <span>Estimated LP Tokens:</span>
                    <span>{Math.sqrt(parseFloat(azixAmount) * parseFloat(usdcAmount)).toFixed(4)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Pool Share:</span>
                    <span>{((Math.sqrt(parseFloat(azixAmount) * parseFloat(usdcAmount)) / selectedPool.tvl) * 100).toFixed(6)}%</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="liquidity-modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowLiquidityModal(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-liquidity-btn"
                onClick={handleProvideLiquidity}
                disabled={isProvidingLiquidity || !azixAmount || !usdcAmount}
              >
                {isProvidingLiquidity ? (
                  <>
                    <div className="spinner"></div>
                    Adding Liquidity...
                  </>
                ) : (
                  'Add Liquidity'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeFiFeatures;