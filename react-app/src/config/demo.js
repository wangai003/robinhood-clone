// AZIX Blockchain Trading Platform Configuration
// Decentralized stock tokenization and trading platform
export const DEMO_MODE = true;

export const KENYAN_STOCKS = {
  SCOM: { name: 'Safaricom' },
  KCB: { name: 'KCB Group' },
  EQTY: { name: 'Equity Bank' },
  // Add more as needed
};

// AZIX Platform Settings
export const DEMO_CONFIG = {
  // Blockchain transaction simulation delays
  API_DELAY: 300,
  
  // Real-time updates (in milliseconds)
  QUOTE_REFRESH_INTERVAL: 5000, // Token price updates
  PORTFOLIO_REFRESH_INTERVAL: 10000, // Portfolio updates
  STAKING_REFRESH_INTERVAL: 15000, // Staking rewards updates
  
  // Blockchain Configuration
  BLOCKCHAIN: {
    NETWORK: 'AZIX Chain',
    CHAIN_ID: 'azix-mainnet-1',
    NATIVE_TOKEN: 'AZIX',
    NATIVE_SYMBOL: 'AZX',
    GAS_PRICE: 0.001,
    BLOCK_TIME: 3000, // 3 seconds per block
    CONFIRMATION_BLOCKS: 3
  },
  
  // Default wallet credentials
  DEMO_CREDENTIALS: {
    email: 'trader@azix.finance',
    password: 'blockchain123',
    wallet_address: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
    private_key: '0x...' // Hidden for security
  },
  
  // Platform Features
  FEATURES: {
    REAL_TIME_UPDATES: true,
    NOTIFICATIONS: true,
    SOUND_EFFECTS: false,
    ANIMATIONS: true,
    WALLET_INTEGRATION: true,
    STAKING: true,
    TOKENIZATION: true,
    DEFI_FEATURES: true,
    CROSS_CHAIN: true,
    NFT_CERTIFICATES: true
  }
};



// Helper function to check if we're in demo mode
export const isDemoMode = () => {
  return DEMO_MODE || process.env.REACT_APP_DEMO_MODE === 'true';
};

// Helper function to get demo config
export const getDemoConfig = () => {
  return DEMO_CONFIG;
};