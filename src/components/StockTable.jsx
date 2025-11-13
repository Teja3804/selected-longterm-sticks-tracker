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

  // Calculate k = buyIndex / riskIndex for each stock
  const calculateK = (stock) => {
    if (stock.buyIndex === null || stock.buyIndex === undefined || 
        stock.riskIndex === null || stock.riskIndex === undefined || 
        stock.riskIndex === 0) {
      return null;
    }
    return stock.buyIndex / stock.riskIndex;
  };

  // Calculate y = (1 + gainLoss/100) * (buyIndex / riskIndex)
  const calculateY = (stock) => {
    const k = calculateK(stock);
    if (k === null) return null;
    
    if (stock.gainLoss === null || stock.gainLoss === undefined) {
      return null;
    }
    
    const profitMultiplier = 1 + (stock.gainLoss / 100);
    const y = profitMultiplier * k;
    
    return y;
  };

  // Calculate d = dividendPercent * (buyIndex / riskIndex) for each stock
  const calculateD = (stock) => {
    const k = calculateK(stock);
    if (k === null) return null;
    
    if (stock.dividendPercent === null || stock.dividendPercent === undefined) {
      return null;
    }
    
    return stock.dividendPercent * k;
  };

  // Calculate cumulative profit/loss: Σy / Σk
  const calculateCumulativeProfitLoss = () => {
    const validStocks = stocks.filter(stock => {
      const y = calculateY(stock);
      const k = calculateK(stock);
      return y !== null && k !== null;
    });
    
    if (validStocks.length === 0) return null;
    
    const sumY = validStocks.reduce((sum, stock) => sum + calculateY(stock), 0);
    const sumK = validStocks.reduce((sum, stock) => sum + calculateK(stock), 0);
    
    if (sumK === 0) return null;
    
    // Return as percentage: (Σy / Σk - 1) * 100
    return ((sumY / sumK) - 1) * 100;
  };

  // Calculate cumulative dividend interest: Σd / Σk
  const calculateCumulativeDividend = () => {
    const validStocks = stocks.filter(stock => {
      const d = calculateD(stock);
      const k = calculateK(stock);
      return d !== null && k !== null;
    });
    
    if (validStocks.length === 0) return null;
    
    const sumD = validStocks.reduce((sum, stock) => sum + calculateD(stock), 0);
    const sumK = validStocks.reduce((sum, stock) => sum + calculateK(stock), 0);
    
    if (sumK === 0) return null;
    
    return (sumD / sumK);
  };

  const cumulativeProfitLoss = calculateCumulativeProfitLoss();
  const cumulativeDividend = calculateCumulativeDividend();

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
            <th>If Invested in All (y)</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="8" className="loading-cell">
                <div className="loading-spinner"></div>
                Loading stock data...
              </td>
            </tr>
          ) : stocks.length === 0 ? (
            <tr>
              <td colSpan="8" className="empty-cell">
                No stock data available
              </td>
            </tr>
          ) : (
            <>
              {stocks.map((stock, index) => {
                const y = calculateY(stock);
                
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
                      {y !== null ? y.toFixed(4) : 'N/A'}
                    </td>
                  </tr>
                );
              })}
              {/* Summary rows with cumulative profit/loss and dividend */}
              <tr className="summary-row">
                <td colSpan="7" className="summary-label">
                  <strong>Accumulated Profit/Loss %:</strong>
                </td>
                <td className={`gain-loss summary-avg ${getGainLossClass(cumulativeProfitLoss)}`}>
                  <strong>{cumulativeProfitLoss !== null ? formatPercentage(cumulativeProfitLoss) : 'N/A'}</strong>
                </td>
              </tr>
              <tr className="summary-row">
                <td colSpan="7" className="summary-label">
                  <strong>Cumulative Dividend Interest %:</strong>
                </td>
                <td className="dividend summary-avg">
                  <strong>{cumulativeDividend !== null ? `${cumulativeDividend.toFixed(2)}%` : 'N/A'}</strong>
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;

