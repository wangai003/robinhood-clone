import { isDemoMode, getDemoConfig, KENYAN_STOCKS } from '../config/demo';

// Blockchain Service for AZIX Platform
// Handles wallet integration, tokenization, and DeFi features

// Mock blockchain transaction hash generator
const generateTxHash = () => {
  return '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
};

// Mock wallet address generator
const generateWalletAddress = () => {
  return '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
};

// Simulate blockchain delay
const blockchainDelay = () => {
  const config = getDemoConfig();
  return new Promise(resolve => setTimeout(resolve, config.API_DELAY));
};

export function getAvailableKenyanStocks() {
  if (!KENYAN_STOCKS) {
    console.error('KENYAN_STOCKS is undefined!');
    return [];
  }

  return Object.keys(KENYAN_STOCKS).map((symbol) => {
    const basePrice = Math.random() * 150 + 50; // e.g. random base
    const change = (Math.random() - 0.5) * 5; // random % change
    return {
      symbol,
      name: KENYAN_STOCKS[symbol]?.name || symbol,
      current: basePrice,
      change: change,
      change_percent: (change / (basePrice - change)) * 100,
      currency: 'KES',
      exchange: 'NSE',
      market_cap: Math.random() * 1_000_000_000 + 100_000_000,
      volume: Math.floor(Math.random() * 1_000_000) + 10_000,
      timestamp: Date.now(),
    };
  });
}

// Wallet Integration Service
export const walletService = {
  // Connect wallet (MetaMask simulation)
  connectWallet: async () => {
    await blockchainDelay();
    
    const walletData = {
      address: generateWalletAddress(),
      network: 'AZIX Chain',
      chainId: 'azix-mainnet-1',
      balance: {
        AZIX: Math.random() * 1000 + 100, // 100-1100 AZIX tokens
        ETH: Math.random() * 5 + 1, // 1-6 ETH
        USDC: Math.random() * 10000 + 5000 // 5000-15000 USDC
      },
      connected: true,
      provider: 'MetaMask'
    };
    
    localStorage.setItem('azixWallet', JSON.stringify(walletData));
    return walletData;
  },

  // Disconnect wallet
  disconnectWallet: async () => {
    await blockchainDelay();
    localStorage.removeItem('azixWallet');
    return { connected: false };
  },

  // Get wallet info
  getWalletInfo: () => {
    const walletData = localStorage.getItem('azixWallet');
    return walletData ? JSON.parse(walletData) : null;
  },

  // Sign transaction
  signTransaction: async (transaction) => {
    await blockchainDelay();
    return {
      ...transaction,
      signature: generateTxHash(),
      timestamp: Date.now(),
      status: 'signed'
    };
  }
};

// Tokenization Service
export const tokenizationService = {
  // Tokenize a stock
  tokenizeStock: async (stockSymbol, shares, price) => {
    await blockchainDelay();
    
    const tokenData = {
      tokenId: `${stockSymbol}-TOKEN-${Date.now()}`,
      symbol: `t${stockSymbol}`, // Tokenized symbol (e.g., tAAPL)
      name: `Tokenized ${stockSymbol}`,
      underlyingAsset: stockSymbol,
      shares: shares,
      pricePerToken: price,
      totalSupply: shares,
      contractAddress: generateWalletAddress(),
      txHash: generateTxHash(),
      blockNumber: Math.floor(Math.random() * 1000000) + 500000,
      timestamp: Date.now(),
      status: 'minted'
    };
    
    // Store tokenized asset
    const existingTokens = JSON.parse(localStorage.getItem('tokenizedAssets') || '{}');
    existingTokens[tokenData.tokenId] = tokenData;
    localStorage.setItem('tokenizedAssets', JSON.stringify(existingTokens));
    
    return tokenData;
  },

  // Get tokenized assets
  getTokenizedAssets: () => {
    return JSON.parse(localStorage.getItem('tokenizedAssets') || '{}');
  },

  // Trade tokenized stock
  tradeTokenizedStock: async (tokenId, amount, action) => {
    await blockchainDelay();
    
    const transaction = {
      txHash: generateTxHash(),
      tokenId,
      amount,
      action, // 'buy' or 'sell'
      gasUsed: Math.random() * 0.01 + 0.005, // 0.005-0.015 AZIX
      blockNumber: Math.floor(Math.random() * 1000000) + 500000,
      timestamp: Date.now(),
      status: 'confirmed'
    };
    
    return transaction;
  },

  // Burn tokens (redeem for underlying asset)
  burnTokens: async (tokenId, amount) => {
    await blockchainDelay();
    
    return {
      txHash: generateTxHash(),
      tokenId,
      amount,
      action: 'burn',
      underlyingReleased: true,
      timestamp: Date.now(),
      status: 'confirmed'
    };
  }
};

// Staking Service
export const stakingService = {
  // Stake AZIX tokens
  stakeTokens: async (amount, duration) => {
    await blockchainDelay();
    
    const stakingData = {
      stakeId: `STAKE-${Date.now()}`,
      amount: amount,
      duration: duration, // in days
      apy: this.calculateAPY(duration),
      startTime: Date.now(),
      endTime: Date.now() + (duration * 24 * 60 * 60 * 1000),
      status: 'active',
      txHash: generateTxHash(),
      rewards: 0
    };
    
    // Store staking info
    const existingStakes = JSON.parse(localStorage.getItem('stakingPositions') || '[]');
    existingStakes.push(stakingData);
    localStorage.setItem('stakingPositions', JSON.stringify(existingStakes));
    
    return stakingData;
  },

  // Calculate APY based on duration
  calculateAPY: (duration) => {
    if (duration <= 30) return 8.5; // 30 days: 8.5% APY
    if (duration <= 90) return 12.0; // 90 days: 12% APY
    if (duration <= 180) return 15.5; // 180 days: 15.5% APY
    return 20.0; // 365+ days: 20% APY
  },

  // Get staking positions
  getStakingPositions: () => {
    return JSON.parse(localStorage.getItem('stakingPositions') || '[]');
  },

  // Calculate current rewards
  calculateRewards: (stakeData) => {
    const now = Date.now();
    const timeStaked = now - stakeData.startTime;
    const yearInMs = 365 * 24 * 60 * 60 * 1000;
    const timeRatio = timeStaked / yearInMs;
    
    return (stakeData.amount * stakeData.apy / 100) * timeRatio;
  },

  // Unstake tokens
  unstakeTokens: async (stakeId) => {
    await blockchainDelay();
    
    const stakes = JSON.parse(localStorage.getItem('stakingPositions') || '[]');
    const stakeIndex = stakes.findIndex(s => s.stakeId === stakeId);
    
    if (stakeIndex !== -1) {
      const stake = stakes[stakeIndex];
      const rewards = this.calculateRewards(stake);
      
      stakes[stakeIndex].status = 'completed';
      stakes[stakeIndex].rewards = rewards;
      stakes[stakeIndex].completedAt = Date.now();
      
      localStorage.setItem('stakingPositions', JSON.stringify(stakes));
      
      return {
        txHash: generateTxHash(),
        stakeId,
        principalReturned: stake.amount,
        rewardsEarned: rewards,
        totalReturned: stake.amount + rewards,
        status: 'completed'
      };
    }
    
    throw new Error('Stake not found');
  }
};

// DeFi Features Service
export const defiService = {
  // Provide liquidity to AZIX/USDC pool
  provideLiquidity: async (azixAmount, usdcAmount) => {
    await blockchainDelay();
    
    const lpTokens = Math.sqrt(azixAmount * usdcAmount); // Simplified LP calculation
    
    return {
      txHash: generateTxHash(),
      azixAmount,
      usdcAmount,
      lpTokensReceived: lpTokens,
      poolShare: Math.random() * 0.1, // 0-0.1% of pool
      timestamp: Date.now(),
      status: 'confirmed'
    };
  },

  // Remove liquidity
  removeLiquidity: async (lpTokenAmount) => {
    await blockchainDelay();
    
    return {
      txHash: generateTxHash(),
      lpTokensBurned: lpTokenAmount,
      azixReceived: lpTokenAmount * 0.6, // Simplified calculation
      usdcReceived: lpTokenAmount * 0.4,
      timestamp: Date.now(),
      status: 'confirmed'
    };
  },

  // Yield farming
  startYieldFarming: async (lpTokenAmount) => {
    await blockchainDelay();
    
    const farmData = {
      farmId: `FARM-${Date.now()}`,
      lpTokenAmount,
      apy: 45.5, // 45.5% APY for LP farming
      startTime: Date.now(),
      status: 'active',
      txHash: generateTxHash()
    };
    
    const existingFarms = JSON.parse(localStorage.getItem('yieldFarms') || '[]');
    existingFarms.push(farmData);
    localStorage.setItem('yieldFarms', JSON.stringify(existingFarms));
    
    return farmData;
  }
};

// Kenyan Stocks Tokenization
export const kenyanStocksService = {
  // Available Kenyan stocks for tokenization
  KENYAN_STOCKS: {
    'SCOM': { name: 'Safaricom PLC', sector: 'Telecommunications', exchange: 'NSE' },
    'EQTY': { name: 'Equity Group Holdings', sector: 'Banking', exchange: 'NSE' },
    'KCB': { name: 'KCB Group', sector: 'Banking', exchange: 'NSE' },
    'COOP': { name: 'Co-operative Bank', sector: 'Banking', exchange: 'NSE' },
    'BAMB': { name: 'Bamburi Cement', sector: 'Manufacturing', exchange: 'NSE' },
    'EABL': { name: 'East African Breweries', sector: 'Consumer Goods', exchange: 'NSE' },
    'BRIT': { name: 'British American Tobacco', sector: 'Consumer Goods', exchange: 'NSE' },
    'TOTL': { name: 'Total Kenya', sector: 'Energy', exchange: 'NSE' },
    'KENO': { name: 'Kenya Orchards', sector: 'Agriculture', exchange: 'NSE' },
    'WAMU': { name: 'Wamco Holdings', sector: 'Manufacturing', exchange: 'NSE' }
  },

  // Get Kenyan stock quote
  getKenyanStockQuote: async (symbol) => {
    await blockchainDelay();
    
    const basePrice = Math.random() * 100 + 10; // 10-110 KES
    const change = (Math.random() - 0.5) * 10; // -5 to +5 KES
    
    return {
      symbol,
      name: this.KENYAN_STOCKS[symbol]?.name || symbol,
      current: basePrice,
      previous_close: basePrice - change,
      change: change,
      change_percent: (change / (basePrice - change)) * 100,
      currency: 'KES',
      exchange: 'NSE',
      market_cap: Math.random() * 1000000000 + 100000000, // 100M - 1.1B KES
      volume: Math.floor(Math.random() * 1000000) + 10000,
      timestamp: Date.now()
    };
  },

  // Tokenize Kenyan stock
  tokenizeKenyanStock: async (symbol, shares) => {
    const quote = await this.getKenyanStockQuote(symbol);
    
    return await tokenizationService.tokenizeStock(
      symbol,
      shares,
      quote.current
    );
  },

  // Get all available Kenyan stocks
  getAvailableKenyanStocks: () => {
    return this.KENYAN_STOCKS;
  }
};

// Cross-chain bridge service
export const bridgeService = {
  // Bridge tokens to another chain
  bridgeTokens: async (tokenSymbol, amount, targetChain) => {
    await blockchainDelay();
    
    return {
      bridgeId: `BRIDGE-${Date.now()}`,
      sourceChain: 'AZIX Chain',
      targetChain,
      tokenSymbol,
      amount,
      fee: amount * 0.001, // 0.1% bridge fee
      txHash: generateTxHash(),
      status: 'pending',
      estimatedTime: '5-10 minutes',
      timestamp: Date.now()
    };
  },

  // Get bridge status
  getBridgeStatus: async (bridgeId) => {
    await blockchainDelay();
    
    return {
      bridgeId,
      status: 'completed',
      targetTxHash: generateTxHash(),
      completedAt: Date.now()
    };
  }
};

export default {
  walletService,
  tokenizationService,
  stakingService,
  defiService,
  kenyanStocksService,
  bridgeService
};