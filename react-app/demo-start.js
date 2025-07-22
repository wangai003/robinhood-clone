#!/usr/bin/env node

// Demo startup script to ensure demo mode is enabled
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Robinhood Clone in Demo Mode...\n');

// Check if demo config exists and is enabled
const demoConfigPath = path.join(__dirname, 'src', 'config', 'demo.js');

if (fs.existsSync(demoConfigPath)) {
  const demoConfig = fs.readFileSync(demoConfigPath, 'utf8');
  
  if (demoConfig.includes('DEMO_MODE = true')) {
    console.log('✅ Demo mode is enabled');
  } else {
    console.log('⚠️  Demo mode might not be enabled. Check src/config/demo.js');
  }
} else {
  console.log('❌ Demo configuration file not found');
  process.exit(1);
}

console.log('\n📋 Demo Features Available:');
console.log('   • Real-time stock quotes and charts');
console.log('   • Portfolio management with $25,000 virtual money');
console.log('   • Watchlist creation and management');
console.log('   • Virtual bank account linking');
console.log('   • Buy/sell stock simulation');
console.log('   • Live notifications and updates');

console.log('\n🔑 Demo Login Credentials:');
console.log('   Email: demo@robinsock.com');
console.log('   Password: password');
console.log('   (Or use any email/password combination)');

console.log('\n🌐 Starting development server...');
console.log('   Open http://localhost:3000 in your browser');
console.log('   Look for the demo banner at the top of the page');

console.log('\n💡 Tips:');
console.log('   • Click "Demo Login" on the splash page for instant access');
console.log('   • Try searching for stocks like "AAPL", "TESLA", or "GOOGLE"');
console.log('   • Watch for real-time price updates every 5 seconds');
console.log('   • Create watchlists and try virtual trading');

console.log('\n' + '='.repeat(60));
console.log('Demo mode ready! Starting React development server...');
console.log('='.repeat(60) + '\n');

// Start the React development server
const { spawn } = require('child_process');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const server = spawn(npm, ['start'], { stdio: 'inherit' });

server.on('close', (code) => {
  console.log(`\nDemo server stopped with code ${code}`);
});