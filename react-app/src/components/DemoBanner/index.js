import React from 'react';
import { isDemoMode } from '../../config/demo';
import './DemoBanner.css';

const DemoBanner = () => {
  if (!isDemoMode()) return null;

  return (
    <div className="demo-banner">
      <div className="demo-banner-content">
        <span className="demo-banner-icon">🚀</span>
        <span className="demo-banner-text">
          <strong>AZIX BLOCKCHAIN PLATFORM</strong> - Decentralized stock tokenization and trading
        </span>
        <span className="demo-banner-features">
          🔗 Wallet Integration • 🪙 Stock Tokenization • 💰 DeFi Staking • 🇰🇪 Kenyan Stocks
        </span>
      </div>
    </div>
  );
};

export default DemoBanner;