import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { walletService } from '../../services/blockchainService';
import { isDemoMode } from '../../config/demo';
import './WalletConnect.css';

const WalletConnect = () => {
  const [wallet, setWallet] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if wallet is already connected
    const savedWallet = walletService.getWalletInfo();
    if (savedWallet && savedWallet.connected) {
      setWallet(savedWallet);
    }
  }, []);

  const connectWallet = async (walletType) => {
    setIsConnecting(true);
    try {
      const walletData = await walletService.connectWallet();
      setWallet(walletData);
      setShowWalletModal(false);
      
      // Update user session with wallet info
      const currentUser = JSON.parse(localStorage.getItem('demoUser') || '{}');
      currentUser.wallet = walletData;
      localStorage.setItem('demoUser', JSON.stringify(currentUser));
      dispatch({ type: 'session/SET_USER', payload: currentUser });
      
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await walletService.disconnectWallet();
      setWallet(null);
      
      // Update user session
      const currentUser = JSON.parse(localStorage.getItem('demoUser') || '{}');
      delete currentUser.wallet;
      localStorage.setItem('demoUser', JSON.stringify(currentUser));
      dispatch({ type: 'session/SET_USER', payload: currentUser });
      
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance) => {
    return parseFloat(balance).toFixed(4);
  };

  if (!isDemoMode()) return null;

  return (
    <div className="wallet-connect">
      {!wallet?.connected ? (
        <button 
          className="wallet-connect-btn"
          onClick={() => setShowWalletModal(true)}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <div className="spinner"></div>
              Connecting...
            </>
          ) : (
            <>
              <span className="wallet-icon">👛</span>
              Connect Wallet
            </>
          )}
        </button>
      ) : (
        <div className="wallet-connected">
          <div className="wallet-info">
            <div className="wallet-address">
              <span className="wallet-icon">🔗</span>
              {formatAddress(wallet.address)}
            </div>
            <div className="wallet-network">
              <span className="network-dot"></span>
              {wallet.network}
            </div>
          </div>
          
          <div className="wallet-balances">
            <div className="balance-item">
              <span className="balance-symbol">AZIX</span>
              <span className="balance-amount">{formatBalance(wallet.balance.AZIX)}</span>
            </div>
            <div className="balance-item">
              <span className="balance-symbol">ETH</span>
              <span className="balance-amount">{formatBalance(wallet.balance.ETH)}</span>
            </div>
            <div className="balance-item">
              <span className="balance-symbol">USDC</span>
              <span className="balance-amount">{formatBalance(wallet.balance.USDC)}</span>
            </div>
          </div>
          
          <button 
            className="wallet-disconnect-btn"
            onClick={disconnectWallet}
            title="Disconnect Wallet"
          >
            ⚡
          </button>
        </div>
      )}

      {showWalletModal && (
        <div className="wallet-modal-overlay" onClick={() => setShowWalletModal(false)}>
          <div className="wallet-modal" onClick={e => e.stopPropagation()}>
            <div className="wallet-modal-header">
              <h3>Connect Your Wallet</h3>
              <button 
                className="wallet-modal-close"
                onClick={() => setShowWalletModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="wallet-options">
              <button 
                className="wallet-option"
                onClick={() => connectWallet('metamask')}
                disabled={isConnecting}
              >
                <img src="/static/metamask-logo.png" alt="MetaMask" className="wallet-logo" />
                <div className="wallet-option-info">
                  <div className="wallet-option-name">MetaMask</div>
                  <div className="wallet-option-desc">Connect using browser wallet</div>
                </div>
              </button>
              
              <button 
                className="wallet-option"
                onClick={() => connectWallet('walletconnect')}
                disabled={isConnecting}
              >
                <div className="wallet-logo wallet-connect-logo">🔗</div>
                <div className="wallet-option-info">
                  <div className="wallet-option-name">WalletConnect</div>
                  <div className="wallet-option-desc">Connect using mobile wallet</div>
                </div>
              </button>
              
              <button 
                className="wallet-option"
                onClick={() => connectWallet('coinbase')}
                disabled={isConnecting}
              >
                <div className="wallet-logo coinbase-logo">🔵</div>
                <div className="wallet-option-info">
                  <div className="wallet-option-name">Coinbase Wallet</div>
                  <div className="wallet-option-desc">Connect using Coinbase Wallet</div>
                </div>
              </button>
            </div>
            
            <div className="wallet-modal-footer">
              <p>By connecting a wallet, you agree to AZIX's Terms of Service and Privacy Policy.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;