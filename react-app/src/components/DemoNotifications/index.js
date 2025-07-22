import React, { useState, useEffect } from 'react';
import { isDemoMode, getDemoConfig } from '../../config/demo';
import './DemoNotifications.css';

const DemoNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!isDemoMode() || !getDemoConfig().FEATURES.NOTIFICATIONS) return;

    // Blockchain notifications that appear periodically
    const demoNotifications = [
      {
        id: 1,
        type: 'success',
        title: 'Transaction Confirmed',
        message: 'Your AZIX staking transaction confirmed on block #1,234,567',
        icon: '⛓️'
      },
      {
        id: 2,
        type: 'info',
        title: 'Tokenization Complete',
        message: 'Successfully tokenized 25 SCOM shares → tSCOM tokens',
        icon: '🪙'
      },
      {
        id: 3,
        type: 'success',
        title: 'Staking Rewards',
        message: 'Earned 8.5 AZIX tokens from staking rewards',
        icon: '💰'
      },
      {
        id: 4,
        type: 'info',
        title: 'DeFi Pool Added',
        message: 'Added liquidity to AZIX/USDC pool - earning 45.5% APY',
        icon: '💎'
      },
      {
        id: 5,
        type: 'success',
        title: 'Cross-Chain Bridge',
        message: 'Bridged 100 AZIX tokens to Ethereum network',
        icon: '🌉'
      },
      {
        id: 6,
        type: 'warning',
        title: 'Gas Price Alert',
        message: 'Network congestion detected - consider waiting for lower fees',
        icon: '⛽'
      }
    ];

    let notificationIndex = 0;
    const interval = setInterval(() => {
      if (notificationIndex < demoNotifications.length) {
        const notification = {
          ...demoNotifications[notificationIndex],
          timestamp: Date.now()
        };
        
        setNotifications(prev => [...prev, notification]);
        notificationIndex++;

        // Auto-remove notification after 5 seconds
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 5000);
      }
    }, 8000); // Show new notification every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (!isDemoMode() || notifications.length === 0) return null;

  return (
    <div className="demo-notifications">
      {notifications.map(notification => (
        <div 
          key={`${notification.id}-${notification.timestamp}`}
          className={`demo-notification ${notification.type}`}
        >
          <div className="demo-notification-icon">
            {notification.icon}
          </div>
          <div className="demo-notification-content">
            <div className="demo-notification-title">
              {notification.title}
            </div>
            <div className="demo-notification-message">
              {notification.message}
            </div>
          </div>
          <button 
            className="demo-notification-close"
            onClick={() => removeNotification(notification.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default DemoNotifications;