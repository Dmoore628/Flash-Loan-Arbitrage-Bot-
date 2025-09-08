# Configuration Guide

## Overview

This guide covers all configuration options for the Flash Loan Arbitrage Bot Simulator, from basic setup to advanced trading parameters and optimization settings.

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file in your project root:

```env
# Google Gemini AI API (Required for market analysis)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Application settings
VITE_APP_NAME=Flash-Loan-Arbitrage-Bot
NODE_ENV=development
```

### Environment Variable Details

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI market analysis | `AIzaSyC...` |
| `VITE_APP_NAME` | No | Application display name | `Flash-Loan-Arbitrage-Bot` |
| `NODE_ENV` | No | Environment mode | `development` or `production` |

### Getting API Keys

#### Google Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Create a new API key or use an existing one
5. Copy the key to your `.env.local` file

**Note**: Keep your API keys secure and never commit them to version control.

## Trading Parameters

### Core Trading Settings

The bot uses the following default parameters that can be customized:

```typescript
const TRADING_CONFIG = {
  // Profit thresholds
  MIN_PROFIT_THRESHOLD: 50,         // Minimum profit in USD
  MIN_PROFIT_PERCENTAGE: 0.5,       // Minimum profit as % of trade
  
  // Gas fee limits  
  MAX_GAS_FEE: 200,                 // Maximum gas fee in USD
  GAS_BUFFER_MULTIPLIER: 1.2,       // Safety buffer for gas estimation
  
  // Slippage tolerance
  MAX_SLIPPAGE: 0.02,               // Maximum slippage (2%)
  SLIPPAGE_BUFFER: 0.005,           // Additional slippage buffer (0.5%)
  
  // Trade sizing
  DEFAULT_TRADE_SIZE: 1000000,      // Default trade size ($1M)
  MAX_TRADE_SIZE: 5000000,          // Maximum trade size ($5M)
  MIN_TRADE_SIZE: 10000,            // Minimum trade size ($10K)
  
  // Risk management
  CONSECUTIVE_FAILURE_LIMIT: 3,     // Stop after N failed trades
  DAILY_LOSS_LIMIT: 1000,          // Daily loss limit in USD
  MAX_POSITION_SIZE: 0.1,           // Max position as % of liquidity
  
  // Flash loan settings
  FLASH_LOAN_FEE: 0.0009,          // AAVE flash loan fee (0.09%)
  PREFERRED_PROVIDER: 'AAVE_V3',    // Default flash loan provider
  
  // Network settings
  MAX_NETWORK_CONGESTION: 0.8,     // Don't trade if congestion > 80%
  BLOCK_CONFIRMATION_COUNT: 1,      // Required confirmations
  
  // Timing
  OPPORTUNITY_TIMEOUT: 3000,        // Max time to execute trade (ms)
  PRICE_STALENESS_LIMIT: 5000,     // Max price age (ms)
  EXECUTION_DEADLINE: 30,           // Transaction deadline (seconds)
};
```

### Customizing Trading Parameters

To modify trading parameters, update the constants in `App.tsx`:

```typescript
// Example: Increase minimum profit threshold
const MIN_PROFIT_THRESHOLD = 100; // Increase from $50 to $100

// Example: Reduce slippage tolerance for more conservative trading
const MAX_SLIPPAGE = 0.01; // Reduce from 2% to 1%

// Example: Adjust gas fee limits based on network conditions
const MAX_GAS_FEE = networkCongestion > 0.5 ? 300 : 150;
```

## DEX Configuration

### Supported DEXs

The simulator supports the following decentralized exchanges:

```typescript
const SUPPORTED_DEXS = {
  UNISWAP_V3: {
    name: 'Uniswap v3',
    type: 'concentrated_liquidity',
    fee_tiers: [0.0005, 0.003, 0.01], // 0.05%, 0.3%, 1%
    router: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    quoter: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
  },
  
  SUSHISWAP: {
    name: 'SushiSwap',
    type: 'constant_product',
    fee: 0.003, // 0.3%
    router: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
    factory: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac'
  },
  
  CURVE: {
    name: 'Curve Finance',
    type: 'stable_swap',
    fee: 0.0004, // 0.04%
    registry: '0x90E00ACe148ca3b23Ac1bC8C240C2a7Dd9c2d7f5',
    calculator: '0xc05cbc4ccad9e83f8c0aebf7efec29e69bb23df8'
  },
  
  BALANCER: {
    name: 'Balancer',
    type: 'weighted_pool',
    fee_range: [0.0001, 0.01], // 0.01% to 1%
    vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
    helpers: '0x5aDDCCa35b7A0D07C74063c48700C8590E87864E'
  }
};
```

### Pool Configuration

Default liquidity pools used in simulation:

```typescript
const INITIAL_POOLS = [
  // WETH/USDC Pools - Primary arbitrage pairs
  {
    id: '1',
    dex: 'Uniswap v3',
    tokenPair: 'WETH/USDC',
    tokenA: 'WETH',
    tokenB: 'USDC',
    reserveA: 2000,      // 2000 WETH
    reserveB: 5000000,   // 5M USDC
    fee: 0.003,          // 0.3%
    priceHistory: Array(20).fill(2500)
  },
  
  // Additional pools for triangular arbitrage
  {
    id: '5',
    dex: 'Curve',
    tokenPair: 'USDC/DAI',
    tokenA: 'USDC',
    tokenB: 'DAI',
    reserveA: 2000000,   // 2M USDC
    reserveB: 1998000,   // 1.998M DAI (slight premium)
    fee: 0.0004,         // 0.04%
    priceHistory: Array(20).fill(0.999)
  }
];
```

### Adding New Pools

To add new trading pools:

```typescript
// Add to the initialPools array in App.tsx
const newPool = {
  id: 'unique_id',
  dex: 'DEX_Name',
  tokenPair: 'TOKEN1/TOKEN2',
  tokenA: 'TOKEN1',
  tokenB: 'TOKEN2',
  reserveA: 1000000,    // Adjust based on realistic liquidity
  reserveB: 2000000,    // Adjust based on token prices
  priceHistory: Array(20).fill(expected_price)
};
```

## Gas Configuration

### Gas Fee Strategy

The bot uses dynamic gas pricing based on network conditions:

```typescript
const calculateGasFee = (networkCongestion: number) => {
  const BASE_GAS = 30;  // Base gas cost in USD
  const CONGESTION_MULTIPLIER = 1 + (networkCongestion * 2);
  return BASE_GAS * CONGESTION_MULTIPLIER;
};

// Gas limits by transaction type
const GAS_LIMITS = {
  SPATIAL_ARBITRAGE: 300000,      // Simple two-pool arbitrage
  TRIANGULAR_ARBITRAGE: 500000,   // Three-pool arbitrage
  FLASH_LOAN_SIMPLE: 400000,      // Flash loan + simple swap
  FLASH_LOAN_COMPLEX: 600000,     // Flash loan + multiple swaps
};
```

### Gas Optimization Settings

```typescript
const GAS_OPTIMIZATION = {
  // Use fast gas price for time-sensitive trades
  PRIORITY_GAS_MULTIPLIER: 1.5,
  
  // Maximum gas price willing to pay (in gwei)
  MAX_GAS_PRICE: 300,
  
  // Gas price percentile to target (10th percentile = fast)
  TARGET_GAS_PERCENTILE: 10,
  
  // Minimum gas price to prevent stuck transactions
  MIN_GAS_PRICE: 20,
  
  // Gas estimation buffer
  GAS_ESTIMATION_BUFFER: 1.2,  // Add 20% buffer
};
```

## Risk Management Configuration

### Position Sizing

```typescript
const POSITION_SIZING = {
  // Kelly Criterion-based position sizing
  KELLY_MULTIPLIER: 0.25,        // Conservative Kelly fraction
  
  // Maximum position size as % of available liquidity
  MAX_POSITION_PERCENT: 0.05,    // 5% of pool liquidity
  
  // Minimum liquidity required for trading
  MIN_LIQUIDITY_USD: 100000,     // $100K minimum
  
  // Position size based on volatility
  LOW_VOLATILITY_SIZE: 0.8,      // 80% of max size
  HIGH_VOLATILITY_SIZE: 0.3,     // 30% of max size
};
```

### Risk Limits

```typescript
const RISK_LIMITS = {
  // Daily limits
  MAX_DAILY_TRADES: 100,
  MAX_DAILY_LOSS: 1000,          // $1000 per day
  MAX_DAILY_GAS_SPEND: 500,      // $500 gas per day
  
  // Per-trade limits
  MAX_TRADE_LOSS: 200,           // $200 per trade
  MAX_SLIPPAGE_LOSS: 50,         // $50 slippage per trade
  
  // Consecutive failure handling
  FAILURE_PAUSE_DURATION: 300000, // 5 minutes
  MAX_CONSECUTIVE_FAILURES: 3,
  
  // Drawdown protection
  MAX_DRAWDOWN_PERCENT: 0.1,     // 10% maximum drawdown
  STOP_LOSS_PERCENT: 0.05,       // 5% stop loss
};
```

## Network Configuration

### Ethereum Node Settings

```typescript
const NETWORK_CONFIG = {
  // Primary RPC endpoints
  PRIMARY_RPC: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
  BACKUP_RPC: 'https://eth-mainnet.alchemyapi.io/v2/YOUR_API_KEY',
  
  // WebSocket endpoints for real-time data
  WSS_ENDPOINT: 'wss://mainnet.infura.io/ws/v3/YOUR_PROJECT_ID',
  
  // Network parameters
  CHAIN_ID: 1,                   // Ethereum mainnet
  BLOCK_TIME: 12000,             // 12 seconds
  CONFIRMATION_BLOCKS: 1,        // Number of confirmations
  
  // Timeout settings
  RPC_TIMEOUT: 10000,            // 10 seconds
  WEBSOCKET_TIMEOUT: 30000,      // 30 seconds
  
  // Rate limiting
  MAX_REQUESTS_PER_SECOND: 10,
  MAX_CONCURRENT_REQUESTS: 5,
};
```

### Mempool Monitoring

```typescript
const MEMPOOL_CONFIG = {
  // Monitor mempool for competing transactions
  ENABLE_MEMPOOL_MONITORING: true,
  
  // Gas price sources
  GAS_PRICE_SOURCES: [
    'ethgasstation',
    'gasnow',
    'blocknative'
  ],
  
  // MEV protection settings
  PRIVATE_MEMPOOL: false,        // Use Flashbots if true
  MEV_PROTECTION_THRESHOLD: 100, // Use protection for trades > $100
  
  // Transaction replacement
  ENABLE_TX_REPLACEMENT: true,
  REPLACEMENT_GAS_BUMP: 1.1,     // 10% gas increase for replacement
};
```

## Performance Configuration

### Optimization Settings

```typescript
const PERFORMANCE_CONFIG = {
  // Update intervals
  MARKET_UPDATE_INTERVAL: 1500,  // 1.5 seconds
  PRICE_UPDATE_INTERVAL: 500,    // 0.5 seconds
  UI_UPDATE_INTERVAL: 1000,      // 1 second
  
  // Data management
  MAX_TRADE_HISTORY: 100,        // Keep last 100 trades
  MAX_LOG_ENTRIES: 200,          // Keep last 200 log entries
  MAX_PRICE_HISTORY: 20,         // Keep last 20 price points
  
  // Cache settings
  CACHE_DURATION: 30000,         // 30 seconds
  ENABLE_BROWSER_CACHE: true,
  
  // Parallel processing
  MAX_PARALLEL_OPPORTUNITIES: 3,
  ENABLE_WORKER_THREADS: false,  // Not applicable in browser
};
```

### Memory Management

```typescript
const MEMORY_CONFIG = {
  // Garbage collection hints
  FORCE_GC_INTERVAL: 300000,     // 5 minutes
  
  // Object pooling
  ENABLE_OBJECT_POOLING: true,
  POOL_SIZE: 1000,
  
  // Memory monitoring
  MEMORY_USAGE_THRESHOLD: 0.8,   // 80% of available memory
  ENABLE_MEMORY_MONITORING: true,
};
```

## Development vs Production

### Development Configuration

```typescript
const DEVELOPMENT_CONFIG = {
  // Logging
  VERBOSE_LOGGING: true,
  LOG_LEVEL: 'debug',
  ENABLE_CONSOLE_LOGS: true,
  
  // Development features
  ENABLE_HOT_RELOAD: true,
  SHOW_DEBUG_INFO: true,
  MOCK_API_RESPONSES: false,
  
  // Relaxed limits for testing
  MIN_PROFIT_THRESHOLD: 10,      // Lower threshold for testing
  ENABLE_SIMULATION_SPEED: 2,    // 2x speed
};
```

### Production Configuration

```typescript
const PRODUCTION_CONFIG = {
  // Logging
  VERBOSE_LOGGING: false,
  LOG_LEVEL: 'error',
  ENABLE_CONSOLE_LOGS: false,
  
  // Security
  ENABLE_RATE_LIMITING: true,
  ENABLE_API_KEY_ROTATION: true,
  SECURE_HEADERS: true,
  
  // Performance
  ENABLE_COMPRESSION: true,
  ENABLE_CACHING: true,
  MINIFY_RESPONSES: true,
  
  // Monitoring
  ENABLE_METRICS: true,
  ENABLE_ALERTS: true,
  HEALTH_CHECK_INTERVAL: 60000,  // 1 minute
};
```

## Configuration Validation

### Environment Validation

```typescript
function validateConfiguration(): boolean {
  const required = [
    'GEMINI_API_KEY'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    return false;
  }
  
  return true;
}

// Validate on startup
if (!validateConfiguration()) {
  throw new Error('Configuration validation failed');
}
```

### Parameter Validation

```typescript
function validateTradingParameters(): void {
  if (MIN_PROFIT_THRESHOLD < 0) {
    throw new Error('MIN_PROFIT_THRESHOLD must be positive');
  }
  
  if (MAX_SLIPPAGE > 0.1) {
    console.warn('MAX_SLIPPAGE is very high (>10%)');
  }
  
  if (MAX_TRADE_SIZE < MIN_TRADE_SIZE) {
    throw new Error('MAX_TRADE_SIZE must be greater than MIN_TRADE_SIZE');
  }
}
```

## Configuration Management

### Environment-specific Configs

Create separate configuration files for different environments:

```
configs/
├── development.json
├── production.json
├── testing.json
└── staging.json
```

### Dynamic Configuration

```typescript
// Load configuration based on environment
function loadConfig() {
  const env = process.env.NODE_ENV || 'development';
  const configPath = `./configs/${env}.json`;
  
  try {
    return require(configPath);
  } catch (error) {
    console.warn(`Could not load config for ${env}, using defaults`);
    return DEFAULT_CONFIG;
  }
}

const config = loadConfig();
```

---

This configuration guide provides comprehensive coverage of all configurable aspects of the Flash Loan Arbitrage Bot Simulator. Adjust these settings based on your specific requirements and risk tolerance.