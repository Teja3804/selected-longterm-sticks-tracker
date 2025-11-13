import React from 'react';
import './StockTable.css';

const StockTable = ({ stocks, isLoading }) => {
  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A';
    return `$${price.toFixed(2)}`;
  };

  const formatPercentage = (percentage) => {
    if (percentage === null || percentage === undefined) return 'N/A';
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

  const getGainLossClass = (percentage) => {
    if (percentage === null || percentage === undefined) return '';
    return percentage >= 0 ? 'gain' : 'loss';
  };

  const formatDividend = (dividend) => {
    if (dividend === null || dividend === undefined) return 'N/A';
    return `${dividend.toFixed(1)}%`;
  };

  const formatIndex = (index) => {
    if (index === null || index === undefined) return '-';
    return index.toFixed(1);
  };

  const getBuyIndexClass = (index) => {
    if (index === null || index === undefined) return '';
    if (index >= 8) return 'buy-high';
    if (index >= 6) return 'buy-medium';
    return 'buy-low';
  };

  const getRiskIndexClass = (index) => {
    if (index === null || index === undefined) return '';
    if (index <= 5) return 'risk-low';
    if (index <= 7) return 'risk-medium';
    return 'risk-high';
  };

  // Calculate y values for each stock
  const calculateY = (stock) => {
    if (stock.buyIndex === null || stock.buyIndex === undefined || 
        stock.riskIndex === null || stock.riskIndex === undefined || 
        stock.riskIndex === 0) {
      return null;
    }
    
    const x = (stock.buyIndex * 10) / stock.riskIndex;
    
    if (stock.gainLoss === null || stock.gainLoss === undefined) {
      return null;
    }
    
    const profitMultiplier = 1 + (stock.gainLoss / 100);
    const y = x * profitMultiplier;
    
    return y;
  };

  // Calculate net (sum of all y values)
  const calculateNet = () => {
    const yValues = stocks
      .map(calculateY)
      .filter(y => y !== null);
    
    if (yValues.length === 0) return null;
    
    return yValues.reduce((sum, y) => sum + y, 0);
  };

  const net = calculateNet();

  // Calculate percentage if invested in all
  const calculateInvestmentPercentage = (y) => {
    if (y === null || y === undefined) return null;
    return (y * 100) / 350;
  };

  return (
    <div className="stock-table-container">
      <table className="stock-table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Entry Price</th>
            <th>Current Price</th>
            <th>Gain/Loss %</th>
            <th>Dividend %</th>
            <th>Buy Index</th>
            <th>Risk Index</th>
            <th>Net</th>
            <th>% if Invested in All</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="9" className="loading-cell">
                <div className="loading-spinner"></div>
                Loading stock data...
              </td>
            </tr>
          ) : stocks.length === 0 ? (
            <tr>
              <td colSpan="9" className="empty-cell">
                No stock data available
              </td>
            </tr>
          ) : (
            <>
              {stocks.map((stock, index) => {
                const y = calculateY(stock);
                const investmentPercent = calculateInvestmentPercentage(y);
                
                return (
                  <tr key={index}>
                    <td className="company-name">{stock.name}</td>
                    <td className="entry-price">{formatPrice(stock.entryPrice)}</td>
                    <td className="current-price">
                      {stock.currentPrice !== null 
                        ? formatPrice(stock.currentPrice) 
                        : <span className="error-text">Error loading</span>
                      }
                    </td>
                    <td className={`gain-loss ${getGainLossClass(stock.gainLoss)}`}>
                      {stock.currentPrice !== null 
                        ? formatPercentage(stock.gainLoss)
                        : 'N/A'
                      }
                    </td>
                    <td className="dividend">{formatDividend(stock.dividendPercent)}</td>
                    <td className={`buy-index ${getBuyIndexClass(stock.buyIndex)}`}>
                      {formatIndex(stock.buyIndex)}
                    </td>
                    <td className={`risk-index ${getRiskIndexClass(stock.riskIndex)}`}>
                      {formatIndex(stock.riskIndex)}
                    </td>
                    <td className="net-value">
                      {y !== null ? y.toFixed(2) : 'N/A'}
                    </td>
                    <td className="investment-percent">
                      {investmentPercent !== null ? `${investmentPercent.toFixed(2)}%` : 'N/A'}
                    </td>
                  </tr>
                );
              })}
              {/* Summary row with total net */}
              <tr className="summary-row">
                <td colSpan="7" className="summary-label">
                  <strong>Total Net (Σy):</strong>
                </td>
                <td className="net-value summary-net">
                  <strong>{net !== null ? net.toFixed(2) : 'N/A'}</strong>
                </td>
                <td className="investment-percent"></td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;

