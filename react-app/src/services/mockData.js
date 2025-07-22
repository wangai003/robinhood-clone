// Mock data service for demo/prototype mode
// This replaces backend API calls with simulated data

// Popular stocks with realistic data
export const MOCK_STOCKS = {
  'AAPL': { symbol: 'AAPL', name: 'Apple Inc.' },
  'GOOGL': { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  'MSFT': { symbol: 'MSFT', name: 'Microsoft Corporation' },
  'AMZN': { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  'TSLA': { symbol: 'TSLA', name: 'Tesla Inc.' },
  'META': { symbol: 'META', name: 'Meta Platforms Inc.' },
  'NVDA': { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  'NFLX': { symbol: 'NFLX', name: 'Netflix Inc.' },
  'AMD': { symbol: 'AMD', name: 'Advanced Micro Devices Inc.' },
  'UBER': { symbol: 'UBER', name: 'Uber Technologies Inc.' },
  'SPOT': { symbol: 'SPOT', name: 'Spotify Technology S.A.' },
  'PYPL': { symbol: 'PYPL', name: 'PayPal Holdings Inc.' },
  'SQ': { symbol: 'SQ', name: 'Block Inc.' },
  'COIN': { symbol: 'COIN', name: 'Coinbase Global Inc.' },
  'ROKU': { symbol: 'ROKU', name: 'Roku Inc.' },
  'ZM': { symbol: 'ZM', name: 'Zoom Video Communications Inc.' },
  'SHOP': { symbol: 'SHOP', name: 'Shopify Inc.' },
  'TWTR': { symbol: 'TWTR', name: 'Twitter Inc.' },
  'SNAP': { symbol: 'SNAP', name: 'Snap Inc.' },
  'PINS': { symbol: 'PINS', name: 'Pinterest Inc.' }
};

// Mock user data
export const MOCK_USER = {
  id: 1,
  first_name: 'Demo',
  last_name: 'User',
  email: 'demo@robinsock.com',
  buying_power: 25000.00,
  assets: {
    'AAPL': { id: 1, symbol: 'AAPL', count: 10 },
    'GOOGL': { id: 2, symbol: 'GOOGL', count: 5 },
    'TSLA': { id: 3, symbol: 'TSLA', count: 8 },
    'MSFT': { id: 4, symbol: 'MSFT', count: 15 }
  },
  watchlists: {
    1: {
      id: 1,
      name: 'Tech Giants',
      stocks: {
        1: { id: 1, symbol: 'AAPL', name: 'Apple Inc.' },
        2: { id: 2, symbol: 'GOOGL', name: 'Alphabet Inc.' },
        3: { id: 3, symbol: 'MSFT', name: 'Microsoft Corporation' },
        4: { id: 4, symbol: 'META', name: 'Meta Platforms Inc.' }
      }
    },
    2: {
      id: 2,
      name: 'Growth Stocks',
      stocks: {
        5: { id: 5, symbol: 'TSLA', name: 'Tesla Inc.' },
        6: { id: 6, symbol: 'NVDA', name: 'NVIDIA Corporation' },
        7: { id: 7, symbol: 'AMD', name: 'Advanced Micro Devices Inc.' }
      }
    },
    3: {
      id: 3,
      name: 'Streaming & Entertainment',
      stocks: {
        8: { id: 8, symbol: 'NFLX', name: 'Netflix Inc.' },
        9: { id: 9, symbol: 'SPOT', name: 'Spotify Technology S.A.' },
        10: { id: 10, symbol: 'ROKU', name: 'Roku Inc.' }
      }
    }
  },
  bank_accounts: {
    1: {
      id: 1,
      bank_id: 1,
      account_number: '****1234',
      routing_number: '021000021',
      balance: 50000.00,
      bank: { id: 1, name: 'Chase Bank', image_url: '/static/chase.png' }
    },
    2: {
      id: 2,
      bank_id: 2,
      account_number: '****5678',
      routing_number: '011401533',
      balance: 75000.00,
      bank: { id: 2, name: 'Wells Fargo', image_url: '/static/wells-fargo.png' }
    }
  }
};

// Mock banks data
export const MOCK_BANKS = {
  1: { id: 1, name: 'Chase Bank', image_url: '/static/chase.png' },
  2: { id: 2, name: 'Wells Fargo', image_url: '/static/wells-fargo.png' },
  3: { id: 3, name: 'Bank of America', image_url: '/static/boa.png' },
  4: { id: 4, name: 'Citibank', image_url: '/static/citi.png' },
  5: { id: 5, name: 'Capital One', image_url: '/static/capital-one.png' }
};

// Generate realistic stock quotes
export const generateMockQuote = (symbol) => {
  const basePrice = {
    'AAPL': 175.00,
    'GOOGL': 2800.00,
    'MSFT': 330.00,
    'AMZN': 3200.00,
    'TSLA': 250.00,
    'META': 320.00,
    'NVDA': 450.00,
    'NFLX': 380.00,
    'AMD': 95.00,
    'UBER': 45.00,
    'SPOT': 120.00,
    'PYPL': 85.00,
    'SQ': 75.00,
    'COIN': 180.00,
    'ROKU': 65.00,
    'ZM': 70.00,
    'SHOP': 55.00,
    'TWTR': 40.00,
    'SNAP': 12.00,
    'PINS': 25.00
  }[symbol] || 100.00;

  const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
  const current = basePrice * (1 + variation);
  const previousClose = basePrice * (1 + (Math.random() - 0.5) * 0.05);
  const change = current - previousClose;
  const changePercent = (change / previousClose) * 100;

  return {
    current: parseFloat(current.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    change_percent: parseFloat(changePercent.toFixed(2)),
    open: parseFloat((current * (1 + (Math.random() - 0.5) * 0.02)).toFixed(2)),
    previous_close: parseFloat(previousClose.toFixed(2)),
    high: parseFloat((current * (1 + Math.random() * 0.03)).toFixed(2)),
    low: parseFloat((current * (1 - Math.random() * 0.03)).toFixed(2))
  };
};

// Generate mock candle data for charts
export const generateMockCandles = (symbol, timeFrame) => {
  const quote = generateMockQuote(symbol);
  const basePrice = quote.current;
  const dataPoints = {
    '1D': 78, // 6.5 hours * 12 (5-min intervals)
    '1W': 35, // 5 days * 7 points per day
    '1M': 22, // ~22 trading days
    '3M': 65, // ~65 trading days
    '1Y': 252 // ~252 trading days
  }[timeFrame] || 78;

  const data = [];
  let currentPrice = basePrice;
  const now = Date.now();
  const intervals = {
    '1D': 5 * 60 * 1000, // 5 minutes
    '1W': 60 * 60 * 1000, // 1 hour
    '1M': 24 * 60 * 60 * 1000, // 1 day
    '3M': 24 * 60 * 60 * 1000, // 1 day
    '1Y': 24 * 60 * 60 * 1000 // 1 day
  }[timeFrame];

  for (let i = dataPoints - 1; i >= 0; i--) {
    const time = Math.floor((now - (i * intervals)) / 1000);
    const variation = (Math.random() - 0.5) * 0.02; // ±1% variation per point
    currentPrice = currentPrice * (1 + variation);
    
    data.push({
      time: time,
      price: parseFloat(currentPrice.toFixed(2))
    });
  }

  return data;
};

// Generate mock financial data
export const generateMockFinancials = (symbol) => {
  const quote = generateMockQuote(symbol);
  const price = quote.current;
  
  return {
    market_cap: Math.floor((price * Math.random() * 10000000000) / 1000000) * 1000000,
    '52_week_high': parseFloat((price * (1 + Math.random() * 0.5)).toFixed(2)),
    '52_week_low': parseFloat((price * (1 - Math.random() * 0.3)).toFixed(2)),
    pe_ratio: parseFloat((15 + Math.random() * 20).toFixed(2)),
    dividend_yield: parseFloat((Math.random() * 3).toFixed(2))
  };
};

// Mock portfolio performance data
export const generateMockPortfolioData = (timeFrame) => {
  const dataPoints = {
    '1D': 78,
    '1W': 35,
    '1M': 22,
    '3M': 65,
    '1Y': 252
  }[timeFrame] || 78;

  const data = [];
  let currentValue = 45000; // Starting portfolio value
  const now = Date.now();
  const intervals = {
    '1D': 5 * 60 * 1000,
    '1W': 60 * 60 * 1000,
    '1M': 24 * 60 * 60 * 1000,
    '3M': 24 * 60 * 60 * 1000,
    '1Y': 24 * 60 * 60 * 1000
  }[timeFrame];

  for (let i = dataPoints - 1; i >= 0; i--) {
    const time = Math.floor((now - (i * intervals)) / 1000);
    const variation = (Math.random() - 0.5) * 0.015; // ±0.75% variation
    currentValue = currentValue * (1 + variation);
    
    data.push({
      time: time,
      price: parseFloat(currentValue.toFixed(2))
    });
  }

  return data;
};

// Simulate API delay
export const simulateApiDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Mock search functionality
export const searchStocks = (query) => {
  const results = [];
  const lowerQuery = query.toLowerCase();
  
  Object.values(MOCK_STOCKS).forEach(stock => {
    if (stock.symbol.toLowerCase().includes(lowerQuery) || 
        stock.name.toLowerCase().includes(lowerQuery)) {
      results.push(stock);
    }
  });
  
  return results.slice(0, 10); // Limit to 10 results
};

// Generate random news headlines for stocks
export const generateMockNews = (symbol) => {
  const newsTemplates = [
    `${symbol} reports strong quarterly earnings`,
    `Analysts upgrade ${symbol} price target`,
    `${symbol} announces new product launch`,
    `${symbol} stock hits new 52-week high`,
    `Institutional investors increase ${symbol} holdings`,
    `${symbol} CEO discusses future growth plans`,
    `${symbol} beats revenue expectations`,
    `Market volatility affects ${symbol} trading`
  ];
  
  return newsTemplates
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((headline, index) => ({
      id: index,
      headline,
      timestamp: Date.now() - (index * 3600000) // Hours ago
    }));
};