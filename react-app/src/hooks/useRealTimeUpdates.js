import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { isDemoMode, getDemoConfig } from '../config/demo';
import { generateMockQuote } from '../services/mockData';

// Custom hook for real-time updates in demo mode
export const useRealTimeUpdates = (symbol, onUpdate) => {
  const intervalRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isDemoMode() || !symbol) return;

    const config = getDemoConfig();
    if (!config.FEATURES.REAL_TIME_UPDATES) return;

    // Start real-time updates
    intervalRef.current = setInterval(() => {
      const newQuote = generateMockQuote(symbol);
      if (onUpdate) {
        onUpdate(newQuote);
      }
    }, config.QUOTE_REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [symbol, onUpdate, dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
};

// Hook for portfolio real-time updates
export const usePortfolioRealTimeUpdates = (onUpdate) => {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isDemoMode()) return;

    const config = getDemoConfig();
    if (!config.FEATURES.REAL_TIME_UPDATES) return;

    // Update portfolio value based on current holdings
    intervalRef.current = setInterval(() => {
      const currentUser = JSON.parse(localStorage.getItem('demoUser') || '{}');
      if (currentUser.assets) {
        let totalValue = parseFloat(currentUser.buying_power) || 0;
        
        // Calculate total portfolio value
        Object.keys(currentUser.assets).forEach(symbol => {
          const asset = currentUser.assets[symbol];
          const quote = generateMockQuote(symbol);
          totalValue += asset.count * quote.current;
        });

        if (onUpdate) {
          onUpdate({
            totalValue,
            buyingPower: currentUser.buying_power,
            assets: currentUser.assets
          });
        }
      }
    }, config.PORTFOLIO_REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onUpdate]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
};