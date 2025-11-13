import React from 'react';
import './StockTable.css';

const SimpleStockTable = ({ stocks, isLoading, title }) => {
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

  // Calculate average gain/loss %
  const calculateAverageGainLoss = () => {
    const validGainLoss = stocks
      .map(stock => stock.gainLoss)
      .filter(gainLoss => gainLoss !== null && gainLoss !== undefined);
    
    if (validGainLoss.length === 0) return null;
    
    const sum = validGainLoss.reduce((acc, val) => acc + val, 0);
    return sum / validGainLoss.length;
  };

  const averageGainLoss = calculateAverageGainLoss();

  return (
    <div className="stock-table-container">
      {title && <h2 className="table-title">{title}</h2>}
      <table className="stock-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Entry Price</th>
            <th>Current Price</th>
            <th>Gain/Loss %</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="4" className="loading-cell">
                <div className="loading-spinner"></div>
                Loading stock data...
              </td>
            </tr>
          ) : stocks.length === 0 ? (
            <tr>
              <td colSpan="4" className="empty-cell">
                No stock data available
              </td>
            </tr>
          ) : (
            <>
              {stocks.map((stock, index) => (
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
                </tr>
              ))}
              {/* Summary row with average gain/loss */}
              <tr className="summary-row">
                <td colSpan="3" className="summary-label">
                  <strong>Average Gain/Loss %:</strong>
                </td>
                <td className={`gain-loss summary-avg ${getGainLossClass(averageGainLoss)}`}>
                  <strong>{averageGainLoss !== null ? formatPercentage(averageGainLoss) : 'N/A'}</strong>
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleStockTable;

