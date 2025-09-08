# 🚀 Flash Loan Arbitrage Bot Simulator

An autonomous, secure, and profitable cryptocurrency arbitrage bot simulator that leverages flash loans to exploit temporary price discrepancies across decentralized exchanges (DEXs). This comprehensive dashboard provides real-time trading simulation, performance analytics, and AI-powered market insights.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Trading Strategies](#trading-strategies)
- [Configuration](#configuration)
- [Usage](#usage)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This simulator demonstrates sophisticated arbitrage trading strategies using flash loans to capitalize on price differences across multiple DEXs including:

- **Uniswap v3** - Concentrated liquidity and advanced AMM
- **SushiSwap** - Community-driven DEX with diverse pools
- **Curve Finance** - Specialized for stablecoin trading
- **Balancer** - Multi-token automated portfolio manager

### Key Concepts

**Flash Loans**: Uncollateralized loans that must be repaid within the same transaction block, enabling capital-efficient arbitrage strategies.

**Arbitrage Types**:
- **Spatial Arbitrage**: Exploiting price differences for the same token pair across different DEXs
- **Triangular Arbitrage**: Taking advantage of price inefficiencies across three different tokens in a cycle

## ✨ Features

### 🔄 Trading Simulation
- **Real-time Market Simulation**: Dynamic price movements and liquidity changes
- **Multiple Arbitrage Strategies**: Spatial and triangular arbitrage implementation
- **Gas Optimization**: Dynamic gas fee calculation based on network congestion
- **Front-running Protection**: Simulates MEV protection mechanisms
- **Slippage Handling**: Realistic price impact modeling

### 📊 Analytics & Monitoring
- **Live Performance Dashboard**: Real-time profit/loss tracking
- **Trade History**: Comprehensive transaction logs with detailed breakdowns
- **Market Analysis**: AI-powered insights using Google Gemini API
- **Risk Management**: Built-in kill switch and safety mechanisms
- **Production Readiness Checklist**: Automated validation of trading criteria

### 🛡️ Safety Features
- **Pre-flight Checks**: Comprehensive validation before starting live trading
- **Gas Tank Monitoring**: Tracks ETH balance for transaction fees
- **Failure Alerts**: Automated notifications for consecutive failed trades
- **Emergency Stop**: Immediate halt capability for risk management

## 🏗️ Architecture

```
Flash-Loan-Arbitrage-Bot/
├── src/
│   ├── components/          # React UI components
│   │   ├── DashboardPanel/  # Main control interface
│   │   ├── InfoTabs/        # Market data visualization
│   │   ├── LogTabs/         # Trading logs and history
│   │   └── ...
│   ├── services/            # External API integrations
│   │   └── geminiService.ts # AI market analysis
│   ├── types.ts             # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   └── index.tsx            # Application entry point
├── docs/                    # Comprehensive documentation
└── public/                  # Static assets
```

### Core Components

- **App.tsx**: Main application orchestrating trading simulation
- **DashboardPanel**: Control center for bot operations
- **InfoTabs**: Market data and liquidity pool information
- **LogTabs**: Real-time trading logs and transaction history
- **TransactionDetailModal**: Detailed trade breakdowns

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Google Gemini API Key** (for AI market analysis)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dmoore628/Flash-Loan-Arbitrage-Bot-.git
   cd Flash-Loan-Arbitrage-Bot-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🎯 Trading Strategies

### Spatial Arbitrage
Exploits price differences for the same token pair across different DEXs:

```
WETH/USDC Price Differences:
- Uniswap: 1 WETH = 2500 USDC
- SushiSwap: 1 WETH = 2505 USDC
- Profit Opportunity: 5 USDC per WETH
```

**Process**:
1. Flash loan USDC from AAVE
2. Buy WETH on the cheaper exchange (Uniswap)
3. Sell WETH on the expensive exchange (SushiSwap)
4. Repay flash loan with interest
5. Keep the profit difference

### Triangular Arbitrage
Capitalizes on price inefficiencies across three different tokens:

```
Arbitrage Cycle:
WETH → USDC → DAI → WETH
- Start: 1 WETH
- Convert to USDC, then DAI, then back to WETH
- End: 1.002 WETH (0.002 WETH profit)
```

## ⚙️ Configuration

### Trading Parameters
- **Minimum Profit Threshold**: $50 USD
- **Gas Fee Buffer**: Dynamic based on network congestion
- **Slippage Tolerance**: Configurable per strategy
- **Flash Loan Provider**: AAVE v3

### Risk Management
- **Max Gas per Trade**: Prevents excessive fee spending
- **Consecutive Failure Limit**: Auto-stop after 3 failed trades
- **Emergency Stop**: Manual override capability

## 📖 Usage

### Starting a Live Simulation

1. **Pre-flight Check**: Click "Start Live Trading" to open the pre-flight modal
2. **Review Checklist**: Ensure all safety checks pass
3. **Monitor Dashboard**: Track real-time performance and trades
4. **Emergency Controls**: Use kill switch if needed

### Understanding the Dashboard

- **Profit Tracking**: Real-time P&L with win rate statistics
- **Trade Log**: Detailed history of all executed trades
- **Market Data**: Live liquidity pool information
- **Gas Tank**: ETH balance monitoring for transaction fees
- **Network Status**: Current block and congestion levels

### Reading Trade Logs

Each trade entry shows:
- **Transaction ID**: Unique identifier
- **Token Pair**: Assets being arbitraged
- **DEX Routes**: Exchanges involved in the strategy
- **Profit/Loss**: Net result after fees
- **Gas Costs**: Network transaction fees
- **Status**: Success, Failed, or Pending

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

- [Getting Started Guide](./docs/getting-started.md)
- [Architecture Overview](./docs/architecture.md)
- [Trading Strategies](./docs/trading-strategies.md)
- [API Reference](./docs/api-reference.md)
- [Configuration Guide](./docs/configuration.md)
- [Deployment Guide](./docs/deployment.md)
- [Troubleshooting](./docs/troubleshooting.md)
- [Contributing Guidelines](./docs/contributing.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./docs/contributing.md) for details on:

- Code standards and style guide
- Pull request process
- Issue reporting
- Development setup

## ⚠️ Disclaimer

This is a **simulation tool** for educational purposes. Real flash loan arbitrage involves significant risks:

- **Smart contract vulnerabilities**
- **Impermanent loss**
- **MEV (Maximal Extractable Value) competition**
- **Gas fee volatility**
- **Market manipulation risks**

Always conduct thorough testing and risk assessment before deploying to mainnet.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **AAVE Protocol** for flash loan infrastructure
- **Uniswap, SushiSwap, Curve, Balancer** for DEX integration concepts
- **Google Gemini API** for AI-powered market analysis
- **React & TypeScript** communities for development tools

---

**Built with ❤️ for the DeFi community**
