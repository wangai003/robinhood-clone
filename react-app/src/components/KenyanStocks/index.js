import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { kenyanStocksService, tokenizationService, getAvailableKenyanStocks } from '../../services/blockchainService';
import { isDemoMode } from '../../config/demo';
import './KenyanStocks.css';

const KenyanStocks = () => {
  const [kenyanStocks, setKenyanStocks] = useState([]);
  const [stockQuotes, setStockQuotes] = useState({});
  const [tokenizedAssets, setTokenizedAssets] = useState({});
  const [isTokenizing, setIsTokenizing] = useState(false); // safe initialization
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [tokenizeAmount, setTokenizeAmount] = useState('');

  useEffect(() => {
    if (!isDemoMode()) return;
    const stocks = getAvailableKenyanStocks();
    setKenyanStocks(stocks);
    // Pre-populate quotes
    const quotes = {};
    stocks.forEach(s => { quotes[s.symbol] = s; });
    setStockQuotes(quotes);
  }, []);

  const handleTokenize = async () => {
    if (!selectedStock || !tokenizeAmount) return;
    setIsTokenizing(true);
    // your tokenize logic here
    await new Promise(r => setTimeout(r, 500)); // mock delay
    setTokenizedAssets(prev => ({
      ...prev,
      [selectedStock.symbol]: (prev[selectedStock.symbol] || 0) + Number(tokenizeAmount),
    }));
    setIsTokenizing(false);
  };

  if (isDemoMode()) return null;

  return (
    <div className="kenyanStocksContainer">
      <input
        type="text"
        placeholder="Search Kenyan stocks..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <div className="stocksList">
        {kenyanStocks
          .filter(s => s.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(stock => (
            <div
              key={stock.symbol}
              className="stockRow"
              onClick={() => setSelectedStock(stock)}
            >
              <span>{stock.symbol}</span>
              <span>{stock.name}</span>
              <span>{stock.current.toLocaleString('en-US', { style: 'currency', currency: 'KES' })}</span>
            </div>
          ))}
      </div>

      {selectedStock && (
        <div className="tokenizeSection">
          <h3>Tokenize {selectedStock.symbol}</h3>
          <input
            type="number"
            placeholder="Amount"
            value={tokenizeAmount}
            onChange={e => setTokenizeAmount(e.target.value)}
            disabled={isTokenizing}
          />
          <button onClick={handleTokenize} disabled={isTokenizing}>
            {isTokenizing ? 'Tokenizing…' : 'Tokenize'}
          </button>
          <div>
            You own: {tokenizedAssets[selectedStock.symbol] || 0} {selectedStock.symbol}
          </div>
        </div>
      )}
    </div>
  );
};

export default KenyanStocks;