import { isDemoMode, getDemoConfig } from '../config/demo';
import { 
  generateMockQuote, 
  generateMockFinancials, 
  searchStocks, 
  simulateApiDelay,
  generateMockPortfolioData 
} from './mockData';

// Stock quote service
export const getStockQuote = async (symbol) => {
  if (isDemoMode()) {
    await simulateApiDelay(getDemoConfig().API_DELAY);
    return generateMockQuote(symbol);
  }

  const response = await fetch(`/api/stocks/${symbol}/quote`);
  if (response.ok) {
    return await response.json();
  }
  throw new Error('Failed to fetch stock quote');
};

// Stock financials service
export const getStockFinancials = async (symbol) => {
  if (isDemoMode()) {
    await simulateApiDelay(getDemoConfig().API_DELAY);
    return generateMockFinancials(symbol);
  }

  const response = await fetch(`/api/stocks/${symbol}/financials`);
  if (response.ok) {
    return await response.json();
  }
  throw new Error('Failed to fetch stock financials');
};

// Stock search service
export const searchStockSymbols = async (query) => {
  if (isDemoMode()) {
    await simulateApiDelay(200); // Shorter delay for search
    return searchStocks(query);
  }

  const response = await fetch(`/api/stocks/search/${query}`);
  if (response.ok) {
    return await response.json();
  }
  throw new Error('Failed to search stocks');
};

// Portfolio performance service
export const getPortfolioPerformance = async (timeFrame) => {
  if (isDemoMode()) {
    await simulateApiDelay(getDemoConfig().API_DELAY);
    return generateMockPortfolioData(timeFrame);
  }

  const response = await fetch(`/api/portfolio/performance?time-frame=${timeFrame}`);
  if (response.ok) {
    return await response.json();
  }
  throw new Error('Failed to fetch portfolio performance');
};

// Buy stock service
export const buyStock = async (symbol, quantity, price) => {
  if (isDemoMode()) {
    await simulateApiDelay(getDemoConfig().API_DELAY);
    
    // Simulate successful purchase
    const totalCost = quantity * price;
    const currentUser = JSON.parse(localStorage.getItem('demoUser'));
    
    if (currentUser.buying_power < totalCost) {
      throw new Error('Insufficient buying power');
    }
    
    // Update user's assets and buying power
    if (currentUser.assets[symbol]) {
      currentUser.assets[symbol].count += quantity;
    } else {
      currentUser.assets[symbol] = {
        id: Date.now(),
        symbol: symbol,
        count: quantity
      };
    }
    
    currentUser.buying_power -= totalCost;
    localStorage.setItem('demoUser', JSON.stringify(currentUser));
    
    return {
      success: true,
      message: `Successfully purchased ${quantity} shares of ${symbol}`,
      asset: currentUser.assets[symbol],
      buying_power: currentUser.buying_power
    };
  }

  const response = await fetch('/api/portfolio/buy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ symbol, quantity, price }),
  });

  if (response.ok) {
    return await response.json();
  }
  throw new Error('Failed to buy stock');
};

// Sell stock service
export const sellStock = async (symbol, quantity, price) => {
  if (isDemoMode()) {
    await simulateApiDelay(getDemoConfig().API_DELAY);
    
    const currentUser = JSON.parse(localStorage.getItem('demoUser'));
    
    if (!currentUser.assets[symbol] || currentUser.assets[symbol].count < quantity) {
      throw new Error('Insufficient shares to sell');
    }
    
    // Update user's assets and buying power
    const totalValue = quantity * price;
    currentUser.assets[symbol].count -= quantity;
    
    if (currentUser.assets[symbol].count === 0) {
      delete currentUser.assets[symbol];
    }
    
    currentUser.buying_power += totalValue;
    localStorage.setItem('demoUser', JSON.stringify(currentUser));
    
    return {
      success: true,
      message: `Successfully sold ${quantity} shares of ${symbol}`,
      buying_power: currentUser.buying_power
    };
  }

  const response = await fetch('/api/portfolio/sell', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ symbol, quantity, price }),
  });

  if (response.ok) {
    return await response.json();
  }
  throw new Error('Failed to sell stock');
};

// Add to watchlist service
export const addToWatchlist = async (watchlistId, stockSymbol) => {
  if (isDemoMode()) {
    await simulateApiDelay(getDemoConfig().API_DELAY);
    
    const currentUser = JSON.parse(localStorage.getItem('demoUser'));
    const stockId = Date.now();
    
    if (currentUser.watchlists[watchlistId]) {
      currentUser.watchlists[watchlistId].stocks[stockId] = {
        id: stockId,
        symbol: stockSymbol,
        name: `${stockSymbol} Company` // In real app, this would come from stock data
      };
      localStorage.setItem('demoUser', JSON.stringify(currentUser));
    }
    
    return {
      success: true,
      message: `Added ${stockSymbol} to watchlist`
    };
  }

  const response = await fetch('/api/watchlist/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ watchlist_id: watchlistId, symbol: stockSymbol }),
  });

  if (response.ok) {
    return await response.json();
  }
  throw new Error('Failed to add stock to watchlist');
};

// Create watchlist service
export const createWatchlist = async (name) => {
  if (isDemoMode()) {
    await simulateApiDelay(getDemoConfig().API_DELAY);
    
    const currentUser = JSON.parse(localStorage.getItem('demoUser'));
    const newWatchlistId = Date.now();
    
    currentUser.watchlists[newWatchlistId] = {
      id: newWatchlistId,
      name: name,
      stocks: {}
    };
    
    localStorage.setItem('demoUser', JSON.stringify(currentUser));
    
    return {
      success: true,
      watchlist: currentUser.watchlists[newWatchlistId]
    };
  }

  const response = await fetch('/api/watchlist/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (response.ok) {
    return await response.json();
  }
  throw new Error('Failed to create watchlist');
};

// Add bank account service
export const addBankAccount = async (bankId, accountNumber, routingNumber) => {
  if (isDemoMode()) {
    await simulateApiDelay(getDemoConfig().API_DELAY);
    
    const currentUser = JSON.parse(localStorage.getItem('demoUser'));
    const newAccountId = Date.now();
    
    currentUser.bank_accounts[newAccountId] = {
      id: newAccountId,
      bank_id: bankId,
      account_number: `****${accountNumber.slice(-4)}`,
      routing_number: routingNumber,
      balance: Math.floor(Math.random() * 100000) + 10000, // Random balance
      bank: { id: bankId, name: 'Demo Bank', image_url: '/static/demo-bank.png' }
    };
    
    localStorage.setItem('demoUser', JSON.stringify(currentUser));
    
    return {
      success: true,
      account: currentUser.bank_accounts[newAccountId]
    };
  }

  const response = await fetch('/api/bank-accounts/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bank_id: bankId, account_number: accountNumber, routing_number: routingNumber }),
  });

  if (response.ok) {
    return await response.json();
  }
  throw new Error('Failed to add bank account');
};

// Transfer funds service
export const transferFunds = async (accountId, amount) => {
  if (isDemoMode()) {
    await simulateApiDelay(getDemoConfig().API_DELAY);
    
    const currentUser = JSON.parse(localStorage.getItem('demoUser'));
    
    if (currentUser.bank_accounts[accountId] && currentUser.bank_accounts[accountId].balance >= amount) {
      currentUser.bank_accounts[accountId].balance -= amount;
      currentUser.buying_power += amount;
      localStorage.setItem('demoUser', JSON.stringify(currentUser));
      
      return {
        success: true,
        message: `Successfully transferred $${amount}`,
        buying_power: currentUser.buying_power
      };
    } else {
      throw new Error('Insufficient funds in bank account');
    }
  }

  const response = await fetch('/api/bank-accounts/transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ account_id: accountId, amount }),
  });

  if (response.ok) {
    return await response.json();
  }
  throw new Error('Failed to transfer funds');
};