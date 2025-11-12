// Stock API service
// Ready for new API implementation

// Helper function to delay execution (for rate limiting)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ========== ALPHA VANTAGE CODE (COMMENTED OUT) ==========
// const ALPHA_VANTAGE_API_KEY = "KLBCJC9PA3UWICLP";
// const ALPHA_VANTAGE_API = "https://www.alphavantage.co/query";

// export const fetchStockPrice = async (symbol) => {
//   try {
//     // Using Alpha Vantage Global Quote API
//     // Note: Alpha Vantage may have CORS restrictions, so we'll try direct fetch first
//     const url = `${ALPHA_VANTAGE_API}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
//     
//     let response;
//     try {
//       response = await fetch(url);
//     } catch (fetchError) {
//       // Check if it's a CORS error
//       if (fetchError.message.includes('CORS') || fetchError.message.includes('Failed to fetch') || fetchError.name === 'TypeError') {
//         console.error(`CORS or network error for ${symbol}:`, fetchError.message);
//         // Try with a CORS proxy as fallback
//         const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
//         try {
//           const proxyResponse = await fetch(proxyUrl);
//           if (!proxyResponse.ok) {
//             throw new Error(`Proxy request failed for ${symbol}`);
//           }
//           const proxyData = await proxyResponse.json();
//           const data = JSON.parse(proxyData.contents);
//           return processAlphaVantageResponse(data, symbol);
//         } catch (proxyError) {
//           console.error(`Proxy also failed for ${symbol}:`, proxyError);
//           return {
//             symbol,
//             currentPrice: null,
//             success: false,
//             error: `Network error: ${fetchError.message}. This may be a CORS issue.`,
//           };
//         }
//       }
//       throw fetchError;
//     }
//     
//     if (!response.ok) {
//       throw new Error(`HTTP ${response.status}: Failed to fetch data for ${symbol}`);
//     }
//     
//     const data = await response.json();
//     return processAlphaVantageResponse(data, symbol);
//   } catch (error) {
//     console.error(`Error fetching ${symbol}:`, error);
//     return {
//       symbol,
//       currentPrice: null,
//       success: false,
//       error: error.message,
//     };
//   }
// };

// // Helper function to process Alpha Vantage API response
// const processAlphaVantageResponse = (data, symbol) => {
//   // Check for API rate limit or error messages
//   if (data["Note"]) {
//     console.warn(`Rate limit hit for ${symbol}. Response:`, data["Note"]);
//     return {
//       symbol,
//       currentPrice: null,
//       success: false,
//       error: "API rate limit exceeded. Please wait before trying again.",
//     };
//   }
//   
//   if (data["Error Message"]) {
//     console.warn(`Error for ${symbol}:`, data["Error Message"]);
//     return {
//       symbol,
//       currentPrice: null,
//       success: false,
//       error: data["Error Message"],
//     };
//   }
//   
//   // Check if Global Quote exists and has data
//   if (data["Global Quote"]) {
//     const globalQuote = data["Global Quote"];
//     const priceStr = globalQuote["05. price"];
//     
//     // Check if Global Quote is empty (sometimes Alpha Vantage returns empty object for invalid symbols)
//     if (Object.keys(globalQuote).length === 0 || !priceStr) {
//       console.warn(`No price data found for ${symbol} - empty Global Quote`);
//       return {
//         symbol,
//         currentPrice: null,
//         success: false,
//         error: `No data found for ${symbol}`,
//       };
//     }
//     
//     const currentPrice = parseFloat(priceStr);
//     
//     if (isNaN(currentPrice)) {
//       console.warn(`Invalid price data for ${symbol}:`, priceStr);
//       return {
//         symbol,
//         currentPrice: null,
//         success: false,
//         error: `Invalid price data for ${symbol}`,
//       };
//     }
//     
//     return {
//       symbol,
//       currentPrice: currentPrice,
//       success: true,
//     };
//   }
//   
//   // If we get here, the response format is unexpected
//   console.warn(`Unexpected response format for ${symbol}:`, data);
//   return {
//     symbol,
//     currentPrice: null,
//     success: false,
//     error: `Unexpected response format for ${symbol}`,
//   };
// };
// ========== END OF ALPHA VANTAGE CODE ==========

// ========== TWELVE DATA CODE (COMMENTED OUT) ==========
// const TWELVE_DATA_API_KEY = "a11c1303796a4b54ac9f3533075bbd62";
// const TWELVE_DATA_API = "https://api.twelvedata.com";

// // Twelve Data API implementation
// export const fetchStockPrice = async (symbol) => {
//   try {
//     // Using Twelve Data real-time price endpoint
//     // Try /price endpoint first, fallback to /time_series if needed
//     const url = `${TWELVE_DATA_API}/price?symbol=${symbol}&apikey=${TWELVE_DATA_API_KEY}`;
//     
//     let response;
//     try {
//       response = await fetch(url);
//     } catch (fetchError) {
//       // Check if it's a CORS or network error
//       if (fetchError.message.includes('CORS') || fetchError.message.includes('Failed to fetch') || fetchError.name === 'TypeError') {
//         console.error(`Network error for ${symbol}:`, fetchError.message);
//         return {
//           symbol,
//           currentPrice: null,
//           success: false,
//           error: `Network error: ${fetchError.message}. This may be a CORS issue.`,
//         };
//       }
//       throw fetchError;
//     }
//     
//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error(`HTTP ${response.status} for ${symbol}:`, errorText);
//       throw new Error(`HTTP ${response.status}: Failed to fetch data for ${symbol}`);
//     }
//     
//     const data = await response.json();
//     console.log(`Response for ${symbol}:`, data);
//     
//     // Check for API errors (Twelve Data error format)
//     if (data.status === "error" || data.code) {
//       const errorMsg = data.message || data.status || "Unknown error from API";
//       console.warn(`API error for ${symbol}:`, errorMsg);
//       return {
//         symbol,
//         currentPrice: null,
//         success: false,
//         error: errorMsg,
//       };
//     }
//     
//     // Check if price exists in response (direct price endpoint)
//     if (data.price !== undefined && data.price !== null) {
//       const currentPrice = parseFloat(data.price);
//       
//       if (isNaN(currentPrice)) {
//         console.warn(`Invalid price data for ${symbol}:`, data.price);
//         return {
//           symbol,
//           currentPrice: null,
//           success: false,
//           error: `Invalid price data for ${symbol}`,
//         };
//       }
//       
//       return {
//         symbol,
//         currentPrice: currentPrice,
//         success: true,
//       };
//     }
//     
//     // Try time_series endpoint as fallback
//     console.log(`Price not found in /price response for ${symbol}, trying /time_series endpoint...`);
//     return await fetchStockPriceFromTimeSeries(symbol);
//     
//   } catch (error) {
//     console.error(`Error fetching ${symbol}:`, error);
//     // Try time_series as fallback
//     try {
//       return await fetchStockPriceFromTimeSeries(symbol);
//     } catch (fallbackError) {
//       return {
//         symbol,
//         currentPrice: null,
//         success: false,
//         error: error.message,
//       };
//     }
//   }
// };

// // Fallback function using time_series endpoint
// const fetchStockPriceFromTimeSeries = async (symbol) => {
//   try {
//     const url = `${TWELVE_DATA_API}/time_series?symbol=${symbol}&interval=1min&apikey=${TWELVE_DATA_API_KEY}&outputsize=1`;
//     const response = await fetch(url);
//     
//     if (!response.ok) {
//       throw new Error(`HTTP ${response.status}: Failed to fetch time_series for ${symbol}`);
//     }
//     
//     const data = await response.json();
//     
//     // Check for API errors
//     if (data.status === "error" || data.code) {
//       const errorMsg = data.message || data.status || "Unknown error from API";
//       console.warn(`API error for ${symbol} (time_series):`, errorMsg);
//       return {
//         symbol,
//         currentPrice: null,
//         success: false,
//         error: errorMsg,
//       };
//     }
//     
//     // Extract price from time_series response
//     if (data.values && data.values.length > 0) {
//       const latest = data.values[0];
//       const currentPrice = parseFloat(latest.close);
//       
//       if (isNaN(currentPrice)) {
//         throw new Error(`Invalid price data for ${symbol}`);
//       }
//       
//       return {
//         symbol,
//         currentPrice: currentPrice,
//         success: true,
//       };
//     }
//     
//     throw new Error(`No price data found for ${symbol}`);
//   } catch (error) {
//     console.error(`Error fetching time_series for ${symbol}:`, error);
//     throw error;
//   }
// };

// export const fetchAllStockPrices = async (symbols) => {
//   // Twelve Data free tier allows 8 API calls per minute, 800 per day
//   // We'll fetch with delays to respect rate limits
//   const priceMap = {};
//   const BATCH_SIZE = 8; // Process 8 at a time (within per-minute limit)
//   const DELAY_MS = 8000; // Wait 8 seconds between batches (to stay under 8/min limit)
//   
//   console.log(`Fetching prices for ${symbols.length} stocks in batches of ${BATCH_SIZE}...`);
//   
//   for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
//     const batch = symbols.slice(i, i + BATCH_SIZE);
//     console.log(`Fetching batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(symbols.length / BATCH_SIZE)}: ${batch.join(', ')}`);
//     
//     // Fetch batch in parallel
//     const promises = batch.map(symbol => fetchStockPrice(symbol));
//     const results = await Promise.all(promises);
//     
//     // Add results to price map and log any errors
//     results.forEach(result => {
//       if (result.success) {
//         priceMap[result.symbol] = result.currentPrice;
//       } else {
//         console.warn(`Failed to fetch ${result.symbol}: ${result.error}`);
//         priceMap[result.symbol] = null; // Store null for failed fetches
//       }
//     });
//     
//     // Wait before next batch (except for the last batch)
//     if (i + BATCH_SIZE < symbols.length) {
//       console.log(`Waiting ${DELAY_MS / 1000} seconds before next batch...`);
//       await delay(DELAY_MS);
//     }
//   }
//   
//   const successCount = Object.values(priceMap).filter(price => price !== null).length;
//   console.log(`Completed: ${successCount}/${symbols.length} stocks fetched successfully`);
//   
//   return priceMap;
// };
// ========== END OF TWELVE DATA CODE ==========

// ========== FINNHUB API IMPLEMENTATION ==========
const FINNHUB_API_KEY = "d4ab3s9r01qnehvtpfs0d4ab3s9r01qnehvtpfsg";
const FINNHUB_API = "https://finnhub.io/api/v1/quote";

export const fetchStockPrice = async (symbol) => {
  // Store original symbol for return value
  const originalSymbol = symbol;
  // Improvement 1: Automatic symbol uppercase and trim
  symbol = symbol.toUpperCase().trim();
  
  try {
    const url = `${FINNHUB_API}?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    console.log(`[DEBUG] Fetching: ${symbol} from Finnhub`);
    
    const response = await fetch(url);
    
    // Check HTTP status first
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP ${response.status} for ${symbol}:`, errorText);
      return {
        symbol,
        currentPrice: null,
        success: false,
        error: `HTTP ${response.status}: ${errorText || 'Request failed'}`,
      };
    }
    
    const data = await response.json();
    console.log(`[DEBUG] Response for ${symbol}:`, JSON.stringify(data));
    
    // Finnhub sometimes returns 200 OK with error in body, so check response content
    // Check for various error formats
    if (data.error || data.message) {
      const errorMsg = data.error || data.message;
      console.warn(`API error for ${symbol}:`, errorMsg);
      return {
        symbol,
        currentPrice: null,
        success: false,
        error: errorMsg,
      };
    }
    
    // Check if response is empty or invalid
    if (!data || typeof data !== 'object') {
      console.warn(`Invalid response for ${symbol}:`, data);
      return {
        symbol,
        currentPrice: null,
        success: false,
        error: "Invalid API response",
      };
    }
    
    // Check if price data is valid (c = current price)
    // Note: c can be 0 for some stocks, so we only check for undefined/null
    if (data.c === undefined || data.c === null) {
      // Sometimes Finnhub returns all zeros when market is closed or symbol unavailable
      // Check if all fields are zero/empty
      const allZero = data.c === 0 && data.h === 0 && data.l === 0 && data.o === 0 && data.pc === 0;
      if (allZero) {
        console.warn(`Symbol ${symbol} returned all zeros - may be unavailable or market closed`);
        return {
          symbol,
          currentPrice: null,
          success: false,
          error: "Symbol unavailable or market closed",
        };
      }
      
      console.warn(`No price data for ${symbol}. Response:`, data);
      return {
        symbol,
        currentPrice: null,
        success: false,
        error: "No price data available",
      };
    }
    
    // Validate that price is a number and greater than 0
    const price = parseFloat(data.c);
    
    // Improvement 2: Detect suspended/delisted stocks
    if (price === 0 && data.pc === 0) {
      console.warn(`Invalid or delisted stock symbol: ${symbol}`);
      return {
        symbol,
        currentPrice: null,
        success: false,
        error: "Invalid or delisted stock symbol",
      };
    }
    
    if (isNaN(price) || price <= 0) {
      console.warn(`Invalid price for ${symbol}:`, data.c);
      return {
        symbol,
        currentPrice: null,
        success: false,
        error: price <= 0 ? "Price is zero or negative" : "Invalid price data",
      };
    }
    
    return {
      symbol: symbol, // Return uppercase symbol for consistency
      currentPrice: price,
      success: true,
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return {
      symbol: symbol, // Return uppercase symbol for consistency
      currentPrice: null,
      success: false,
      error: error.message || "Network error",
    };
  }
};

// Improvement 4: Retry logic for failed requests
const retry = async (fn, retries = 3) => {
  let lastResult;
  while (retries--) {
    const result = await fn();
    if (result.success) return result;
    lastResult = result;
    if (retries > 0) {
      await delay(300); // wait 300ms before retry
    }
  }
  return lastResult;
};

export const fetchAllStockPrices = async (symbols) => {
  // Improvement 3: Simplified version - no batching needed
  // Finnhub allows 60 req/min, UI button presses will never exceed that
  const priceMap = {};
  
  console.log(`Fetching prices for ${symbols.length} stocks using Finnhub API...`);
  
  const promises = symbols.map(async (symbol) => {
    // Use retry logic for better reliability
    const result = await retry(() => fetchStockPrice(symbol));
    // Use uppercase symbol as key for consistency
    const symbolKey = symbol.toUpperCase().trim();
    priceMap[symbolKey] = result.success ? result.currentPrice : null;
    
    if (result.success) {
      console.log(`✓ ${result.symbol}: $${result.currentPrice.toFixed(2)}`);
    } else {
      console.warn(`✗ ${result.symbol}: ${result.error}`);
    }
  });
  
  await Promise.all(promises);
  
  const successCount = Object.values(priceMap).filter(price => price !== null).length;
  console.log(`\n=== Summary ===`);
  console.log(`Successfully fetched: ${successCount}/${symbols.length} stocks`);
  
  return priceMap;
};

