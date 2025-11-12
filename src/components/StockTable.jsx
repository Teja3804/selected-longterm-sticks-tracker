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
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="7" className="loading-cell">
                <div className="loading-spinner"></div>
                Loading stock data...
              </td>
            </tr>
          ) : stocks.length === 0 ? (
            <tr>
              <td colSpan="7" className="empty-cell">
                No stock data available
              </td>
            </tr>
          ) : (
            stocks.map((stock, index) => (
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;

