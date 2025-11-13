// Precious metals data
// Note: Using ETFs as proxies since Finnhub quote endpoint works best with stocks/ETFs
// GLD price is approximately 1/10th of gold spot price (e.g., GLD ~$200 when gold ~$2000)
// SLV price tracks silver spot price more closely
export const preciousMetalsData = [
  { name: "Gold", symbol: "GLD", entryPrice: 378.5 }, // SPDR Gold Shares ETF
  { name: "Silver", symbol: "SLV", entryPrice: 45.8 }, // iShares Silver Trust ETF
];

