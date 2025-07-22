import React, { useState } from 'react';
import { isDemoMode } from '../../config/demo';
import './DemoInstructions.css';

const DemoInstructions = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isDemoMode()) return null;

  return (
    <div className="demo-instructions">
      <div className="demo-instructions-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>🚀 AZIX Blockchain Platform Features</h3>
        <span className={`demo-instructions-toggle ${isExpanded ? 'expanded' : ''}`}>
          ▼
        </span>
      </div>
      
      {isExpanded && (
        <div className="demo-instructions-content">
          <div className="demo-features-grid">
            <div className="demo-feature">
              <div className="demo-feature-icon">🔗</div>
              <h4>Wallet Integration</h4>
              <p>Connect MetaMask, WalletConnect, or Coinbase Wallet to access the AZIX blockchain</p>
            </div>
            
            <div className="demo-feature">
              <div className="demo-feature-icon">🪙</div>
              <h4>Stock Tokenization</h4>
              <p>Convert real-world stocks into blockchain tokens for 24/7 trading and fractional ownership</p>
            </div>
            
            <div className="demo-feature">
              <div className="demo-feature-icon">🇰🇪</div>
              <h4>Kenyan Stocks</h4>
              <p>Tokenize NSE-listed companies like Safaricom (SCOM), Equity Bank (EQTY), and KCB Group</p>
            </div>
            
            <div className="demo-feature">
              <div className="demo-feature-icon">💰</div>
              <h4>AZIX Staking</h4>
              <p>Stake AZIX tokens and earn up to 20% APY with flexible lock-up periods</p>
            </div>
            
            <div className="demo-feature">
              <div className="demo-feature-icon">💎</div>
              <h4>DeFi Features</h4>
              <p>Provide liquidity to pools, earn farming rewards, and participate in yield optimization</p>
            </div>
            
            <div className="demo-feature">
              <div className="demo-feature-icon">⛓️</div>
              <h4>Blockchain Trading</h4>
              <p>Execute trades directly on-chain with smart contract automation and transparent settlement</p>
            </div>
          </div>
          
          <div className="demo-instructions-actions">
            <div className="demo-quick-start">
              <h4>Getting Started:</h4>
              <ol>
                <li>Click "🔗 Connect Wallet" to access the AZIX platform</li>
                <li>Explore your blockchain portfolio dashboard</li>
                <li>Visit "🇰🇪 Tokenize" to convert Kenyan stocks to tokens</li>
                <li>Try "Staking" to earn AZIX token rewards</li>
                <li>Use "💎 DeFi" for liquidity mining and yield farming</li>
              </ol>
            </div>
            
            <div className="demo-credentials">
              <h4>Platform Features:</h4>
              <p><strong>Network:</strong> AZIX Chain (Testnet)</p>
              <p><strong>Native Token:</strong> AZIX</p>
              <p><strong>Supported Assets:</strong> Kenyan Stocks, Global Equities</p>
              <small>All blockchain interactions are simulated for demonstration</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoInstructions;