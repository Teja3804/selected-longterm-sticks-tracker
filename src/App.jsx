import React, { useState, useEffect, useCallback } from 'react';
import { stockData } from './stockData';
import { fetchAllStockPrices } from './api/stockApi';
import StockTable from './components/StockTable';
import './App.css';

function App() {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const calculateGainLoss = (entryPrice, currentPrice) => {
    if (!currentPrice || !entryPrice) return null;
    return ((currentPrice - entryPrice) / entryPrice) * 100;
  };

  const updateStockPrices = useCallback(async () => {
    setIsLoading(true);
    try {
      const symbols = stockData.map(stock => stock.symbol);
      const priceMap = await fetchAllStockPrices(symbols);
      
      const updatedStocks = stockData.map(stock => {
        // Ensure symbol lookup uses uppercase to match priceMap keys
        const symbolKey = stock.symbol.toUpperCase().trim();
        const currentPrice = priceMap[symbolKey] || null;
        
        return {
          ...stock,
          currentPrice: currentPrice,
          gainLoss: calculateGainLoss(stock.entryPrice, currentPrice),
        };
      });
      
      setStocks(updatedStocks);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error updating stock prices:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = () => {
    updateStockPrices();
  };

  useEffect(() => {
    // Initial load
    updateStockPrices();
  }, [updateStockPrices]);

  const formatLastUpdated = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString();
  };

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1>📈 Stock Tracker</h1>
          <p className="subtitle">Track your portfolio performance in real-time</p>
        </header>

        <div className="controls">
          <button 
            className="refresh-button" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-small"></span>
                Refreshing...
              </>
            ) : (
              <>
                <span>🔄</span>
                Refresh Now
              </>
            )}
          </button>

          {lastUpdated && (
            <span className="last-updated">
              Last updated: {formatLastUpdated(lastUpdated)}
            </span>
          )}
        </div>

        <StockTable stocks={stocks} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default App;

