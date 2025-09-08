# Getting Started Guide

## Overview

This guide will help you set up and run the Flash Loan Arbitrage Bot Simulator on your local machine. The simulator provides a risk-free environment to understand arbitrage trading strategies and test different scenarios.

## System Requirements

### Minimum Requirements
- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher (comes with Node.js)
- **Memory**: 4GB RAM minimum
- **Storage**: 1GB free disk space
- **Browser**: Modern browser (Chrome 90+, Firefox 88+, Safari 14+)

### Recommended Requirements
- **Node.js**: v18.0.0 or higher
- **Memory**: 8GB RAM
- **Storage**: 2GB free disk space

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Dmoore628/Flash-Loan-Arbitrage-Bot-.git
cd Flash-Loan-Arbitrage-Bot-
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 19.1.1
- TypeScript 5.8.2
- Vite 6.2.0
- Recharts for data visualization
- Google Gemini AI SDK

### 3. Environment Configuration

Create a `.env.local` file in the project root:

```bash
touch .env.local
```

Add your Google Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Getting a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Navigate to "Get API Key"
4. Create a new API key
5. Copy the key to your `.env.local` file

**Note**: The app will still function without an API key, but market analysis features will be limited.

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production (Optional)

```bash
npm run build
```

Built files will be in the `dist/` directory.

## First Run

### Understanding the Interface

When you first open the application, you'll see:

1. **Header**: Shows the bot status (STOPPED, LIVE, BACKTESTING)
2. **Statistics Cards**: Displays profit, trades, win rate, and current block
3. **Dashboard Panel**: Control center for bot operations
4. **Log Tabs**: Real-time trading activity and history
5. **Info Tabs**: Market data and liquidity pool information

### Running Your First Simulation

1. **Start with Backtest**: Click "Run Backtest" to validate the system
2. **Pre-flight Check**: Click "Start Live Trading" to open the pre-flight modal
3. **Review Checklist**: Ensure all criteria are met
4. **Start Simulation**: Click "Start Live Simulation"
5. **Monitor Activity**: Watch the logs and statistics update in real-time

### Understanding the Simulation

The simulator creates a realistic trading environment with:

- **Dynamic Market Prices**: Prices fluctuate based on simulated trading activity
- **Network Congestion**: Gas fees vary with simulated network load
- **Liquidity Changes**: Pool reserves update with each trade
- **MEV Competition**: Random front-running events
- **Slippage**: Price impact from large trades

## Common Issues and Solutions

### Port Already in Use
If port 5173 is busy:
```bash
npm run dev -- --port 3000
```

### Installation Fails
Clear npm cache and try again:
```bash
npm cache clean --force
npm install
```

### Build Errors
Ensure you're using the correct Node.js version:
```bash
node --version  # Should be v16+
npm --version   # Should be v7+
```

### Environment Variables Not Loading
Ensure your `.env.local` file is in the root directory and has the correct format:
```env
GEMINI_API_KEY=your_actual_key_here
```

## Next Steps

After successful setup:

1. Read the [Architecture Overview](./architecture.md) to understand the codebase
2. Learn about [Trading Strategies](./trading-strategies.md) implemented
3. Review [Configuration Options](./configuration.md) for customization
4. Check [API Reference](./api-reference.md) for integration details

## Development Mode vs Production

### Development Mode
- Hot reloading enabled
- Source maps for debugging
- Verbose console logging
- Access to development tools

### Production Mode
- Optimized bundle size
- Minified code
- Reduced logging
- Better performance

## Browser Compatibility

| Browser | Minimum Version | Recommended |
|---------|----------------|-------------|
| Chrome  | 90+           | 100+        |
| Firefox | 88+           | 95+         |
| Safari  | 14+           | 15+         |
| Edge    | 90+           | 100+        |

## Performance Tips

1. **Close Unused Tabs**: The simulator is resource-intensive
2. **Use Chrome DevTools**: Monitor performance and memory usage
3. **Limit Log History**: Logs are capped at 200 entries for performance
4. **Regular Restarts**: Restart the simulation periodically for optimal performance

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting Guide](./troubleshooting.md)
2. Review the console for error messages
3. Open an issue on GitHub with:
   - Operating system and version
   - Node.js and npm versions
   - Complete error messages
   - Steps to reproduce the issue

---

Ready to start exploring arbitrage trading? Head to the main application and begin your first simulation!