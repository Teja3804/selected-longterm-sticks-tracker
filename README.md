# Stock Tracker

A modern web application to track your stock portfolio with real-time price updates.

## Features

- 📊 Table view showing company name, entry price, current price, and gain/loss percentage
- 🔄 Manual refresh button
- ⏱️ Auto-refresh every 30 seconds (can be toggled on/off)
- 📈 Real-time stock price updates from Yahoo Finance API
- 🎨 Modern, responsive UI design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Stock Data

The application tracks the following stocks with their entry prices:
- Conagra Brands, Nestle, Kraft Heinz, General Mills, Kellanova
- JM Smucker Company, B&G Foods Inc, Hormel Food Corporation
- Bunge Limited, Hershey Co, Mondelez International Inc
- Campbell Soup, McCormick, Walt Disney Company
- Conoco Phillips, Pfizer Inc, Exxon Mobil Corp
- Ford Motor Company, Altria Group, General Motors Company
- Toyota Motor Corporation ADR, Honda Motor, Stellantis
- Bank of America, JP Morgan and Chase, Wells Fargo & Company
- Citigroup Inc, Prudential Finance, Metlife
- American International Group, Principal Financial Group Inc
- Verizon, AT&T Inc, T Mobile, Comcast

## API

The application uses Yahoo Finance API (free, no API key required) to fetch real-time stock prices.

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

