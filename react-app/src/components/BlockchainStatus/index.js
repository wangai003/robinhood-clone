import React, { useState, useEffect } from 'react';
import { isDemoMode, getDemoConfig } from '../../config/demo';
import './BlockchainStatus.css';

const BlockchainStatus = () => {
  const [networkStats, setNetworkStats] = useState({
    blockHeight: 1234567,
    gasPrice: 0.001,
    tps: 2500,
    validators: 127,
    totalStaked: 15000000,
    networkHealth: 'Excellent'
  });

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isDemoMode()) return;

    // Update network stats every 3 seconds
    const interval = setInterval(() => {
      setNetworkStats(prev => ({
        ...prev,
        blockHeight: prev.blockHeight + Math.floor(Math.random() * 3) + 1,
        gasPrice: 0.001 + (Math.random() - 0.5) * 0.0005,
        tps: 2500 + Math.floor((Math.random() - 0.5) * 500),
        validators: 127 + Math.floor((Math.random() - 0.5) * 10)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!isDemoMode() || !isVisible) return null;

  const config = getDemoConfig();

  return (
    <div className="blockchain-status">
      <div className="status-header">
        <div className="network-info">
          <span className="network-name">{config.BLOCKCHAIN?.NETWORK || 'AZIX Chain'}</span>
          <div className="network-indicator">
            <span className="status-dot active"></span>
            <span className="status-text">Live</span>
          </div>
        </div>
        <button 
          className="status-toggle"
          onClick={() => setIsVisible(false)}
          title="Hide network status"
        >
          ×
        </button>
      </div>
      
      <div className="status-stats">
        <div className="stat-item">
          <span className="stat-label">Block</span>
          <span className="stat-value">#{networkStats.blockHeight.toLocaleString()}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Gas</span>
          <span className="stat-value">{networkStats.gasPrice.toFixed(4)} AZIX</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">TPS</span>
          <span className="stat-value">{networkStats.tps.toLocaleString()}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Validators</span>
          <span className="stat-value">{networkStats.validators}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Staked</span>
          <span className="stat-value">{(networkStats.totalStaked / 1000000).toFixed(1)}M AZIX</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Health</span>
          <span className="stat-value health excellent">{networkStats.networkHealth}</span>
        </div>
      </div>
    </div>
  );
};

export default BlockchainStatus;