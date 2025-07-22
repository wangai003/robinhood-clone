# Robinhood Clone - Demo Mode Setup

## 🚀 Quick Start Guide

This demo mode allows you to run the Robinhood clone frontend with fully simulated data, showcasing all features without needing the backend server.

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Navigate to the React app directory:**
   ```bash
   cd react-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the demo:**
   ```bash
   npm start
   ```

4. **Access the demo:**
   - Open your browser to `http://localhost:3000`
   - You'll see a demo banner indicating you're in demo mode
   - Click "Demo Login" or use the credentials below

### Demo Features

#### 🎯 **Fully Functional Demo Features:**

1. **Authentication System**
   - Demo login with pre-loaded user data
   - Sign up with simulated account creation
   - Session management with localStorage

2. **Portfolio Dashboard**
   - Real-time portfolio value updates
   - Interactive performance charts (1D, 1W, 1M, 3M, 1Y)
   - Asset holdings display
   - Buying power management

3. **Stock Trading**
   - Search 20+ popular stocks (AAPL, GOOGL, TSLA, etc.)
   - Real-time stock quotes with price fluctuations
   - Interactive stock charts with multiple timeframes
   - Buy/sell functionality with portfolio updates
   - Stock financial metrics display

4. **Watchlists Management**
   - Create, edit, and delete custom watchlists
   - Add/remove stocks from watchlists
   - Pre-loaded demo watchlists (Tech Giants, Growth Stocks, etc.)

5. **Banking System**
   - Link virtual bank accounts
   - Transfer funds to increase buying power
   - Multiple bank options with realistic data

6. **Real-time Updates**
   - Stock prices update every 5 seconds
   - Portfolio values refresh every 10 seconds
   - Live notifications for market events

7. **Interactive Notifications**
   - Portfolio performance alerts
   - Market movement notifications
   - Trade execution confirmations

### Demo Credentials

**Quick Demo Login:**
- Email: `demo@robinsock.com`
- Password: `password`

**Or use any email/password combination** - the demo accepts all credentials!

### Pre-loaded Demo Data

#### **Starting Portfolio:**
- **Buying Power:** $25,000
- **Stock Holdings:**
  - 10 shares of AAPL
  - 5 shares of GOOGL
  - 8 shares of TSLA
  - 15 shares of MSFT

#### **Watchlists:**
1. **Tech Giants:** AAPL, GOOGL, MSFT, META
2. **Growth Stocks:** TSLA, NVDA, AMD
3. **Streaming & Entertainment:** NFLX, SPOT, ROKU

#### **Bank Accounts:**
- Chase Bank: $50,000 balance
- Wells Fargo: $75,000 balance

### Available Stocks for Demo

The demo includes 20 popular stocks with realistic price data:
- **Tech:** AAPL, GOOGL, MSFT, META, NVDA, AMD
- **Electric Vehicles:** TSLA
- **E-commerce:** AMZN, SHOP
- **Streaming:** NFLX, SPOT, ROKU
- **Social Media:** META, TWTR, SNAP, PINS
- **Fintech:** PYPL, SQ, COIN
- **Other:** UBER, ZM

### Demo Limitations

- All data is simulated and not connected to real markets
- No actual money or real trading involved
- Data resets when localStorage is cleared
- Limited to pre-defined stock symbols

### Customization

To modify demo behavior, edit `/src/config/demo.js`:

```javascript
export const DEMO_CONFIG = {
  API_DELAY: 300,                    // Simulated API response time
  QUOTE_REFRESH_INTERVAL: 5000,      // Stock price update frequency
  PORTFOLIO_REFRESH_INTERVAL: 10000, // Portfolio update frequency
  FEATURES: {
    REAL_TIME_UPDATES: true,         // Enable live updates
    NOTIFICATIONS: true,             // Show demo notifications
    ANIMATIONS: true                 // Enable UI animations
  }
};
```

### Troubleshooting

**If you encounter issues:**

1. **Clear browser cache and localStorage:**
   ```javascript
   // In browser console:
   localStorage.clear();
   location.reload();
   ```

2. **Restart the development server:**
   ```bash
   # Stop the server (Ctrl+C) then:
   npm start
   ```

3. **Check console for errors:**
   - Open browser DevTools (F12)
   - Look for any JavaScript errors in the Console tab

### Demo Showcase Tips

**For the best demo experience:**

1. **Start with the splash page** to show the demo instructions
2. **Use "Demo Login"** for instant access with pre-loaded data
3. **Navigate to different stocks** to show the search and chart functionality
4. **Try buying/selling stocks** to demonstrate the trading system
5. **Create new watchlists** to show the management features
6. **Add bank accounts** to demonstrate the banking integration
7. **Watch for real-time updates** in prices and notifications

### Technical Details

**Demo Architecture:**
- Frontend-only implementation
- Mock data services replace API calls
- localStorage for data persistence
- Real-time updates via intervals
- Responsive design for all devices

**File Structure:**
```
src/
├── config/demo.js              # Demo configuration
├── services/mockData.js        # Mock data generation
├── services/stockService.js    # Simulated API services
├── components/DemoBanner/      # Demo mode indicator
├── components/DemoInstructions/ # Feature showcase
├── components/DemoNotifications/ # Live notifications
└── hooks/useRealTimeUpdates.js # Real-time data hooks
```

This demo provides a complete, interactive experience of the Robinhood clone with all major features functional and visually appealing for demonstrations and prototyping purposes.