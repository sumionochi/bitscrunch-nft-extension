# BitsCrunch NFT Analytics Extension 🚀

A powerful browser extension that provides comprehensive NFT analytics, price estimation, and market insights directly from your browser. Built with React, TypeScript, and Tailwind CSS, this extension helps you make informed decisions in the NFT market.

## 🌟 Features

### NFT Analytics Dashboard
- Real-time trading volume, assets, sales, and transaction metrics
- Historical performance trends and market activity analysis
- Detailed transfer tracking and volume changes

### Washtrade Detection
- Advanced washtrade detection metrics
- Suspect sales and transaction monitoring
- Washtrade volume tracking and wallet analysis
- Real-time washtrade status indicators

### Holder Analytics
- Current and historical holder statistics
- Hold duration analysis
- Past owners tracking
- New wallet holder monitoring

### Price Analysis
- Current and historical price tracking
- Price range analysis (All-time high/low)
- Rarity score and ranking
- Price estimates and ceiling predictions

### Market Insights
- Trader activity monitoring
- Buyer/seller ratio analysis
- Market trend visualization
- Collection-wide price estimations

## 🛠️ Technical Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom UI components
- **Data Visualization**: Custom charting components
- **API Integration**: Axios for data fetching
- **State Management**: React Hooks and Context
- **Build Tool**: Vite

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bitscrunch-nft-extension.git
```

2. Install dependencies:
```bash
cd bitscrunch-nft-extension
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder from your build

## 🚀 Usage

1. Click on the extension icon in your browser
2. Enter your API key in the settings
3. Navigate to any NFT on OpenSea
4. Click "Extract NFT Details" to analyze the NFT
5. Explore different analytics tabs:
   - NFT Details
   - NFT Transactions
   - NFT Traders
   - NFT Analytics
   - Broad Market Analysis

## 🎨 UI Features

- Modern, clean interface with a playful design
- Responsive cards with hover effects and shadow animations
- Color-coded metrics for better visualization
- Interactive charts and graphs with time range selection
- Real-time data updates with loading states
- Intuitive tab-based navigation between different analytics views:
  - NFT Details with price estimates
  - Transaction history and patterns
  - Trader activity analysis
  - Market analytics and trends
  - Collection-wide insights
- Customizable filters for blockchain networks and metrics
- Time range selection (24h, 7d, 30d, etc.)
- API key management with secure storage

## 🔑 API Integration

This extension integrates with the UnleashNFTs API to provide comprehensive NFT analytics. You'll need an API key to access the following endpoints:

- `/api/v2/nft/blockchains` - Get supported blockchain networks
- `/api/v2/nft/market-trend` - Fetch market trend data
- `/api/v2/nft/traders` - Get trader activity metrics
- `/api/v2/nft/washtrade` - Analyze washtrade patterns
- `/api/v2/nft/price-estimate` - Get NFT price estimations
- `/api/v2/nft/collection-price-estimate` - Get collection-wide price analysis
- `/api/v2/nft/transactions` - View NFT transaction history

and more...
- `/api/v2/nft/analytics`
- `/api/v2/nft/holders`
- `/api/v2/nft/scores`
- `/api/v2/nft/traders`

The API key can be configured in the extension settings and is securely stored in local storage.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [BitsCrunch](https://www.bitscrunch.com/) API
- UI components powered by shadcn/ui
- Charts and visualizations using custom React components
