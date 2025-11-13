// Precious metals data
// Note: Using ETFs as proxies since Finnhub quote endpoint works best with stocks/ETFs
// GLD price is approximately 1/10th of gold spot price (e.g., GLD ~$200 when gold ~$2000)
// SLV price tracks silver spot price more closely
export const preciousMetalsData = [
  { name: "Gold", symbol: "GLD", entryPrice: 415 }, // SPDR Gold Shares ETF (entry price adjusted: GLD ~$415 when gold ~$4150)
  { name: "Silver", symbol: "SLV", entryPrice: 50.9 }, // iShares Silver Trust ETF (tracks silver price closely)
];

