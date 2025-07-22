import React, { useState, useEffect } from 'react';
import { stakingService } from '../../services/blockchainService';
import { isDemoMode } from '../../config/demo';
import './Staking.css';

const Staking = () => {
  const [stakingPositions, setStakingPositions] = useState([]);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakeDuration, setStakeDuration] = useState(30);
  const [isStaking, setIsStaking] = useState(false);
  const [totalStaked, setTotalStaked] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);

  useEffect(() => {
    if (!isDemoMode()) return;
    
    loadStakingData();
    
    // Update rewards every 30 seconds
    const interval = setInterval(loadStakingData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStakingData = () => {
    const positions = stakingService.getStakingPositions();
    setStakingPositions(positions);
    
    let totalStakedAmount = 0;
    let totalRewardsAmount = 0;
    
    positions.forEach(position => {
      if (position.status === 'active') {
        totalStakedAmount += position.amount;
        totalRewardsAmount += stakingService.calculateRewards(position);
      }
    });
    
    setTotalStaked(totalStakedAmount);
    setTotalRewards(totalRewardsAmount);
  };

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      alert('Please enter a valid stake amount');
      return;
    }
    
    setIsStaking(true);
    try {
      const result = await stakingService.stakeTokens(parseFloat(stakeAmount), stakeDuration);
      console.log('Staking successful:', result);
      
      setShowStakeModal(false);
      setStakeAmount('');
      loadStakingData();
      
      alert(`Successfully staked ${stakeAmount} AZIX tokens for ${stakeDuration} days at ${stakingService.calculateAPY(stakeDuration)}% APY!`);
    } catch (error) {
      console.error('Staking failed:', error);
      alert('Staking failed. Please try again.');
    } finally {
      setIsStaking(false);
    }
  };

  const handleUnstake = async (stakeId) => {
    try {
      const result = await stakingService.unstakeTokens(stakeId);
      console.log('Unstaking successful:', result);
      
      loadStakingData();
      
      alert(`Successfully unstaked! Received ${result.totalReturned.toFixed(4)} AZIX tokens (${result.rewardsEarned.toFixed(4)} rewards)`);
    } catch (error) {
      console.error('Unstaking failed:', error);
      alert('Unstaking failed. Please try again.');
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatDuration = (startTime, endTime) => {
    const duration = Math.ceil((endTime - startTime) / (24 * 60 * 60 * 1000));
    return `${duration} days`;
  };

  const getTimeRemaining = (endTime) => {
    const now = Date.now();
    const remaining = endTime - now;
    
    if (remaining <= 0) return 'Completed';
    
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  if (!isDemoMode()) return null;

  return (
    <div className="staking-container">
      <div className="staking-header">
        <div className="staking-title">
          <h2>🏦 AZIX Staking</h2>
          <p>Earn rewards by staking your AZIX tokens</p>
        </div>
        <button 
          className="stake-btn"
          onClick={() => setShowStakeModal(true)}
        >
          + Stake AZIX
        </button>
      </div>

      <div className="staking-stats">
        <div className="stat-card">
          <div className="stat-label">Total Staked</div>
          <div className="stat-value">{totalStaked.toFixed(4)} AZIX</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Rewards</div>
          <div className="stat-value rewards">{totalRewards.toFixed(4)} AZIX</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Positions</div>
          <div className="stat-value">{stakingPositions.filter(p => p.status === 'active').length}</div>
        </div>
      </div>

      <div className="staking-positions">
        <h3>Your Staking Positions</h3>
        
        {stakingPositions.length === 0 ? (
          <div className="no-positions">
            <div className="no-positions-icon">🌱</div>
            <h4>No staking positions yet</h4>
            <p>Start earning rewards by staking your AZIX tokens</p>
            <button 
              className="stake-btn"
              onClick={() => setShowStakeModal(true)}
            >
              Stake Now
            </button>
          </div>
        ) : (
          <div className="positions-list">
            {stakingPositions.map(position => (
              <div key={position.stakeId} className={`position-card ${position.status}`}>
                <div className="position-header">
                  <div className="position-amount">
                    {position.amount.toFixed(4)} AZIX
                  </div>
                  <div className={`position-status ${position.status}`}>
                    {position.status === 'active' ? '🟢 Active' : '✅ Completed'}
                  </div>
                </div>
                
                <div className="position-details">
                  <div className="detail-row">
                    <span>APY:</span>
                    <span className="apy">{position.apy}%</span>
                  </div>
                  <div className="detail-row">
                    <span>Duration:</span>
                    <span>{formatDuration(position.startTime, position.endTime)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Started:</span>
                    <span>{formatDate(position.startTime)}</span>
                  </div>
                  {position.status === 'active' && (
                    <div className="detail-row">
                      <span>Time Remaining:</span>
                      <span>{getTimeRemaining(position.endTime)}</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span>Current Rewards:</span>
                    <span className="rewards">
                      {position.status === 'active' 
                        ? stakingService.calculateRewards(position).toFixed(4)
                        : position.rewards.toFixed(4)
                      } AZIX
                    </span>
                  </div>
                </div>
                
                {position.status === 'active' && (
                  <button 
                    className="unstake-btn"
                    onClick={() => handleUnstake(position.stakeId)}
                  >
                    Unstake
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showStakeModal && (
        <div className="stake-modal-overlay" onClick={() => setShowStakeModal(false)}>
          <div className="stake-modal" onClick={e => e.stopPropagation()}>
            <div className="stake-modal-header">
              <h3>Stake AZIX Tokens</h3>
              <button 
                className="modal-close"
                onClick={() => setShowStakeModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="stake-modal-content">
              <div className="stake-input-group">
                <label>Amount to Stake</label>
                <div className="stake-input-wrapper">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="0.0"
                    min="0"
                    step="0.0001"
                  />
                  <span className="input-suffix">AZIX</span>
                </div>
              </div>
              
              <div className="stake-duration-group">
                <label>Staking Duration</label>
                <div className="duration-options">
                  {[30, 90, 180, 365].map(days => (
                    <button
                      key={days}
                      className={`duration-option ${stakeDuration === days ? 'selected' : ''}`}
                      onClick={() => setStakeDuration(days)}
                    >
                      <div className="duration-days">{days} Days</div>
                      <div className="duration-apy">{stakingService.calculateAPY(days)}% APY</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="stake-summary">
                <div className="summary-row">
                  <span>Amount:</span>
                  <span>{stakeAmount || '0'} AZIX</span>
                </div>
                <div className="summary-row">
                  <span>Duration:</span>
                  <span>{stakeDuration} days</span>
                </div>
                <div className="summary-row">
                  <span>APY:</span>
                  <span className="apy">{stakingService.calculateAPY(stakeDuration)}%</span>
                </div>
                <div className="summary-row total">
                  <span>Estimated Rewards:</span>
                  <span className="rewards">
                    {stakeAmount ? ((parseFloat(stakeAmount) * stakingService.calculateAPY(stakeDuration) / 100) * (stakeDuration / 365)).toFixed(4) : '0'} AZIX
                  </span>
                </div>
              </div>
            </div>
            
            <div className="stake-modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowStakeModal(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-stake-btn"
                onClick={handleStake}
                disabled={isStaking || !stakeAmount || parseFloat(stakeAmount) <= 0}
              >
                {isStaking ? (
                  <>
                    <div className="spinner"></div>
                    Staking...
                  </>
                ) : (
                  'Confirm Stake'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staking;