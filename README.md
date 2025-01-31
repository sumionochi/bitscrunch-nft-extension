# BitsCrunch NFT Analytics Extension 🚀

A Chrome extension that provides comprehensive NFT analysis and market insights using the BitScrunch API. This extension helps users make informed decisions while purchasing NFTs on OpenSea by providing real-time analytics, price estimates, and market trends, this extension helps you make informed decisions in the NFT market.

<img width="1374" alt="Screenshot 2025-01-31 at 7 36 24 PM" src="https://github.com/user-attachments/assets/0bc63621-3803-4fec-b89c-90a670c6ec21" />

## 🌟 Features

## 1. NFT Information Analysis
- Automatic data extraction from OpenSea listings
- Blockchain details and verification
- Smart contract address validation
- Token ID verification and metadata
- Rarity score and ranking

<img width="1368" alt="Screenshot 2025-01-31 at 7 36 38 PM" src="https://github.com/user-attachments/assets/879de8ff-d538-4248-9adb-273af1481e78" />

## 2. Price Analytics
- Real-time price tracking
- Price estimation metrics:
  - Current market price
  - Lower and upper bound estimates
  - Price confidence indicators
  - Price ceiling predictions
- Historical price analysis
- All-time high/low tracking
- Collection-wide price comparisons

<img width="1374" alt="Screenshot 2025-01-31 at 7 36 59 PM" src="https://github.com/user-attachments/assets/7417499b-bda8-48ec-b513-1f3d1aae5ea2" />


## 3. Market Intelligence
- Trading volume analytics
- Real-time market activity monitoring
- Transaction history analysis
- Customizable time ranges:
  - 24 hours
  - 7 days
  - 30 days
  - 90 days
  - All time
- Asset performance tracking
- Market trend visualizationz

<img width="1371" alt="Screenshot 2025-01-31 at 7 37 33 PM" src="https://github.com/user-attachments/assets/26696252-5644-4573-a0a7-3f505a29550e" />

<img width="1372" alt="Screenshot 2025-01-31 at 7 38 24 PM" src="https://github.com/user-attachments/assets/e926fd67-93ba-4c5e-8c18-36fa112b87e8" />

## 4. Trader Analytics
- Comprehensive buyer/seller behavior analysis
- Interactive visualization:
  - Bar charts for trader activities
  - Trend line graphs
- Buyer to seller ratio analysis
- Historical transaction details
- New wallet monitoring

## 5. Wash Trade Detection System
- Advanced wash trade identification
- Real-time status indicators
- Suspect transaction monitoring
- Wash trade volume tracking
- Suspicious wallet pattern analysis
- Clean/Suspicious status classification

## 6. Holder Analytics
- Current holder statistics
- Historical ownership data
- Hold duration analysis
- Wallet tracking:
  - Current owners
  - Past owners
  - New holders
- Transfer history monitoring

## 7. Collection Analytics
- Collection-wide metrics
- Volume period analysis
- Market performance indicators
- Asset distribution statistics
- Collection price estimations

<img width="1377" alt="Screenshot 2025-01-31 at 7 38 47 PM" src="https://github.com/user-attachments/assets/23f955cc-5897-453d-a4ab-73767edc3377" />


## 8. Data Visualization
- Interactive charts and graphs
- Real-time metric updates
- Historical trend visualization
- Comparative analysis tools
- Custom time range filters

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

## Project Structure

```plaintext
bitscrunch-nft-extension/
├── src/
│   ├── components/
│   │   └── NFTAnalytics/
│   ├── App.tsx
│   └── ...
├── dist/
├── package.json
└── ...
```

The API key can be configured in the extension settings and is securely stored in local storage.

<img width="1373" alt="Screenshot 2025-01-31 at 7 39 26 PM" src="https://github.com/user-attachments/assets/fc78255e-bc17-4e39-8076-0e5609ac22dc" />


## Environment Setup

Create a `.env` file in the root directory:
```properties
'x-api-key': 'your-bitscrunch-api-key'
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- BitScrunch API for providing comprehensive NFT analytics
- OpenSea for NFT marketplace integration

## 🙏 Acknowledgments

- Built with [BitsCrunch](https://www.bitscrunch.com/) API
- UI components powered by shadcn/ui
- Charts and visualizations using custom React components
