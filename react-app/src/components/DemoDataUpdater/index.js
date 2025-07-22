import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isDemoMode, getDemoConfig } from '../../config/demo';
import { generateMockQuote } from '../../services/mockData';
// We'll dispatch the SET_USER action directly since setUser is not exported

// This component runs in the background to update demo data
const DemoDataUpdater = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);

  useEffect(() => {
    if (!isDemoMode() || !user) return;

    const config = getDemoConfig();
    if (!config.FEATURES.REAL_TIME_UPDATES) return;

    // Update user's portfolio value periodically
    const updatePortfolio = () => {
      const currentUser = JSON.parse(localStorage.getItem('demoUser'));
      if (!currentUser || !currentUser.assets) return;

      let totalPortfolioValue = parseFloat(currentUser.buying_power) || 0;
      const updatedAssets = { ...currentUser.assets };

      // Update each asset's implied value based on current mock prices
      Object.keys(updatedAssets).forEach(symbol => {
        const quote = generateMockQuote(symbol);
        const asset = updatedAssets[symbol];
        totalPortfolioValue += asset.count * quote.current;
      });

      // Update user data with new portfolio metrics
      const updatedUser = {
        ...currentUser,
        assets: updatedAssets,
        totalPortfolioValue: totalPortfolioValue
      };

      localStorage.setItem('demoUser', JSON.stringify(updatedUser));
      
      // Update Redux store
      dispatch({ type: 'session/SET_USER', payload: updatedUser });
    };

    // Update portfolio every 10 seconds
    const portfolioInterval = setInterval(updatePortfolio, 10000);

    // Initial update
    updatePortfolio();

    return () => {
      clearInterval(portfolioInterval);
    };
  }, [dispatch, user]);

  // This component doesn't render anything
  return null;
};

export default DemoDataUpdater;