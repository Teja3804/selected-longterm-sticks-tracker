import React, { useState, useEffect, useCallback } from 'react';
import { stockData } from './stockData';
import { techStockData } from './techStockData';
import { preciousMetalsData } from './preciousMetalsData';
import { fetchAllStockPrices } from './api/stockApi';
import StockTable from './components/StockTable';
import SimpleStockTable from './components/SimpleStockTable';
import './App.css';

function App() {
  const [stocks, setStocks] = useState([]);
  const [techStocks, setTechStocks] = useState([]);
  const [preciousMetals, setPreciousMetals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const calculateGainLoss = (entryPrice, currentPrice) => {
    if (!currentPrice || !entryPrice) return null;
    return ((currentPrice - entryPrice) / entryPrice) * 100;
  };

  const updateStockPrices = useCallback(async () => {
    setIsLoading(true);
    try {
      // Collect all symbols from all three data sources
      const allSymbols = [
        ...stockData.map(stock => stock.symbol),
        ...techStockData.map(stock => stock.symbol),
        ...preciousMetalsData.map(stock => stock.symbol),
      ];
      
      const priceMap = await fetchAllStockPrices(allSymbols);
      
      // Update main stocks
      const updatedStocks = stockData.map(stock => {
        const symbolKey = stock.symbol.toUpperCase().trim();
        const currentPrice = priceMap[symbolKey] || null;
        
        return {
          ...stock,
          currentPrice: currentPrice,
          gainLoss: calculateGainLoss(stock.entryPrice, currentPrice),
        };
      });
      
      // Update tech stocks
      const updatedTechStocks = techStockData.map(stock => {
        const symbolKey = stock.symbol.toUpperCase().trim();
        const currentPrice = priceMap[symbolKey] || null;
        
        return {
          ...stock,
          currentPrice: currentPrice,
          gainLoss: calculateGainLoss(stock.entryPrice, currentPrice),
        };
      });
      
      // Update precious metals
      const updatedPreciousMetals = preciousMetalsData.map(stock => {
        const symbolKey = stock.symbol.toUpperCase().trim();
        const currentPrice = priceMap[symbolKey] || null;
        
        return {
          ...stock,
          currentPrice: currentPrice,
          gainLoss: calculateGainLoss(stock.entryPrice, currentPrice),
        };
      });
      
      setStocks(updatedStocks);
      setTechStocks(updatedTechStocks);
      setPreciousMetals(updatedPreciousMetals);
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
        
        <SimpleStockTable 
          stocks={techStocks} 
          isLoading={isLoading} 
          title="Tech Stocks"
        />
        
        <SimpleStockTable 
          stocks={preciousMetals} 
          isLoading={isLoading} 
          title="Precious Metals"
        />
      </div>
    </div>
  );
}

export default App;

