# API Reference

## Overview

This document provides comprehensive API reference for the Flash Loan Arbitrage Bot Simulator, including internal APIs, external service integrations, and component interfaces.

## Internal APIs

### Core Types

#### BotStatus
```typescript
enum BotStatus {
  LIVE = 'LIVE',
  BACKTESTING = 'BACKTESTING', 
  STOPPED = 'STOPPED'
}
```

#### Trade Interface
```typescript
interface Trade {
  id: string;                    // Unique transaction identifier
  timestamp: Date;               // When the trade was executed
  tokenPair: string;             // Trading pair (e.g., 'WETH/USDC')
  dexs: string[];               // DEXs involved in the trade
  amount: number;               // Trade amount in base currency
  netProfit: number;            // Final profit after all fees
  status: 'Success' | 'Failed' | 'Pending';
  grossProfit: number;          // Profit before fees
  gasFee: number;               // Network transaction cost
  slippage: number;             // Price impact percentage
  loanProviderFee: number;      // Flash loan fee
  failureReason: string | null; // Error description if failed
  fromAddress: string;          // Source wallet address
  toAddress: string;            // Destination address
  tokenFlow: string[];          // Step-by-step trade execution
}
```

#### LiquidityPool Interface
```typescript
interface LiquidityPool {
  id: string;                   // Unique pool identifier
  dex: string;                  // DEX name (Uniswap, SushiSwap, etc.)
  tokenPair: string;            // Token pair identifier
  tokenA: string;               // First token symbol
  tokenB: string;               // Second token symbol
  reserveA: number;             // Reserve of token A
  reserveB: number;             // Reserve of token B
  priceHistory: number[];       // Historical price data
}
```

#### ConsoleLog Interface
```typescript
interface ConsoleLog {
  id: string;                   // Unique log entry ID
  timestamp: string;            // Human-readable timestamp
  message: string;              // Log message content
  type: 'info' | 'success' | 'error' | 'warning';
}
```

#### ChecklistState Interface
```typescript
interface ChecklistState {
  profitableTrade: boolean;     // Has executed profitable trade
  triangularArbitrage: boolean; // Has performed triangular arbitrage
  calculatesNetProfit: boolean; // Calculates net profit correctly
  revertsUnprofitable: boolean; // Reverts unprofitable trades
  handlesFrontRunning: boolean; // Handles front-running attacks
  handlesPriceSlippage: boolean; // Manages price slippage
  killSwitch: boolean;          // Emergency stop functionality
  sendsAlerts: boolean;         // Sends failure alerts
}
```

#### PendingTransaction Interface
```typescript
interface PendingTransaction {
  id: string;                   // Transaction hash
  resolveTime: number;          // When transaction resolves (timestamp)
  type: 'spatial' | 'triangular'; // Arbitrage strategy type
  route: any[];                 // Trading route (pools)
  amount: number;               // Trade amount
  gasFee: number;               // Estimated gas cost
  loanProviderFee: number;      // Flash loan fee
  initialNetProfit: number;     // Expected profit
}
```

### Trading Engine API

#### Arbitrage Detection
```typescript
// Detect spatial arbitrage opportunities
function detectSpatialArbitrage(pools: LiquidityPool[]): {
  fromPool: LiquidityPool;
  toPool: LiquidityPool;
  netProfit: number;
} | null

// Detect triangular arbitrage opportunities  
function detectTriangularArbitrage(pools: LiquidityPool[]): {
  route: LiquidityPool[];
  netProfit: number;
} | null

// Calculate optimal trade size
function calculateOptimalTradeSize(
  pools: LiquidityPool[],
  strategy: 'spatial' | 'triangular'
): number
```

#### Price Calculation
```typescript
// Get current price for a token pair
function getCurrentPrice(pool: LiquidityPool): number {
  return pool.reserveB / pool.reserveA;
}

// Calculate price impact for a trade
function calculatePriceImpact(
  pool: LiquidityPool,
  tradeAmount: number
): number {
  const currentPrice = getCurrentPrice(pool);
  const newReserveA = pool.reserveA + tradeAmount;
  const newReserveB = (pool.reserveA * pool.reserveB) / newReserveA;
  const newPrice = newReserveB / newReserveA;
  return Math.abs((newPrice - currentPrice) / currentPrice);
}

// Calculate slippage for AMM trade
function calculateSlippage(
  inputAmount: number,
  outputAmount: number,
  marketPrice: number
): number {
  const expectedOutput = inputAmount * marketPrice;
  return (expectedOutput - outputAmount) / expectedOutput;
}
```

#### Gas Fee Estimation
```typescript
// Calculate dynamic gas fees
function calculateGasFee(
  networkCongestion: number,
  tradeComplexity: 'simple' | 'complex'
): number {
  const baseGas = tradeComplexity === 'simple' ? 30 : 75;
  const congestionMultiplier = 1 + (networkCongestion * 2);
  return baseGas * congestionMultiplier;
}

// Estimate total transaction cost
function estimateTransactionCost(
  tradeAmount: number,
  strategy: 'spatial' | 'triangular',
  networkCongestion: number
): {
  gasFee: number;
  loanProviderFee: number;
  totalCost: number;
}
```

### Component APIs

#### DashboardPanel Props
```typescript
interface DashboardPanelProps {
  status: BotStatus;
  onStartLive: () => void;
  onStopLive: () => void;
  onRunBacktest: () => void;
  onKillSwitch: () => void;
  currentBlock: number;
  checklistState: ChecklistState;
  gasTankBalance: number;
  onGetFaucetEth: () => void;
}
```

#### LogTabs Props  
```typescript
interface LogTabsProps {
  consoleLogs: ConsoleLog[];
  trades: Trade[];
  onTradeClick: (trade: Trade) => void;
}
```

#### InfoTabs Props
```typescript
interface InfoTabsProps {
  pools: LiquidityPool[];
}
```

#### TransactionDetailModal Props
```typescript
interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  trade: Trade | null;
}
```

## External APIs

### Google Gemini AI Integration

#### Service Configuration
```typescript
// Initialize Gemini AI client
const ai = new GoogleGenAI({ 
  apiKey: process.env.API_KEY! 
});
```

#### Market Analysis API
```typescript
/**
 * Get AI-powered market analysis
 * @returns Promise<string> Market analysis text
 */
async function getMarketAnalysis(): Promise<string>

// Example usage
const analysis = await getMarketAnalysis();
console.log(analysis);
```

#### API Response Format
```typescript
// Market analysis response structure
interface MarketAnalysisResponse {
  volatility: string;           // Market volatility assessment
  opportunities: string[];      // Identified opportunities
  networkStatus: string;        // Blockchain network status
  recommendations: string;      // Trading recommendations
}
```

#### Error Handling
```typescript
try {
  const analysis = await getMarketAnalysis();
  // Process analysis
} catch (error) {
  if (error instanceof Error) {
    console.error(`API Error: ${error.message}`);
  }
  // Fallback to cached analysis or default message
}
```

### DEX Data APIs (Simulated)

#### Pool Data Structure
```typescript
// Simulated DEX pool data
const initialPools: LiquidityPool[] = [
  {
    id: '1',
    dex: 'Uniswap v3',
    tokenPair: 'WETH/USDC',
    tokenA: 'WETH',
    tokenB: 'USDC',
    reserveA: 2000,
    reserveB: 5000000,
    priceHistory: Array(20).fill(2500)
  },
  // ... more pools
];
```

#### Price Feed Simulation
```typescript
// Simulate real-time price updates
function simulateMarketData(pools: LiquidityPool[]): LiquidityPool[] {
  return pools.map(pool => {
    // Apply random price drift
    const price = pool.reserveB / pool.reserveA;
    const newPrice = price * (1 + (Math.random() - 0.5) * 0.001);
    
    // Simulate trading volume
    const volume = pool.reserveA * (Math.random() * 0.01);
    const direction = Math.random() > 0.5 ? 1 : -1;
    
    const newReserveA = pool.reserveA + volume * direction;
    const newReserveB = (pool.reserveA * pool.reserveB) / newReserveA;
    
    return {
      ...pool,
      reserveA: newReserveA,
      reserveB: newReserveB,
      priceHistory: [...pool.priceHistory.slice(1), newReserveB / newReserveA]
    };
  });
}
```

## Configuration API

### Environment Variables
```typescript
interface EnvironmentConfig {
  GEMINI_API_KEY: string;       // Google Gemini API key
  NODE_ENV: 'development' | 'production';
  VITE_APP_NAME: string;        // Application name
}

// Access environment variables
const config = {
  apiKey: process.env.GEMINI_API_KEY,
  environment: process.env.NODE_ENV,
  appName: process.env.VITE_APP_NAME
};
```

### Trading Parameters
```typescript
interface TradingConfig {
  MIN_PROFIT_THRESHOLD: number;     // Minimum profit ($50)
  MAX_GAS_FEE: number;             // Maximum gas fee
  SLIPPAGE_TOLERANCE: number;       // Maximum acceptable slippage
  FLASH_LOAN_FEE: number;          // Flash loan fee percentage (0.09%)
  MAX_TRADE_SIZE: number;          // Maximum trade amount
  CONSECUTIVE_FAILURE_LIMIT: number; // Stop after N failures
}

const tradingConfig: TradingConfig = {
  MIN_PROFIT_THRESHOLD: 50,
  MAX_GAS_FEE: 200,
  SLIPPAGE_TOLERANCE: 0.02,        // 2%
  FLASH_LOAN_FEE: 0.0009,          // 0.09%
  MAX_TRADE_SIZE: 1000000,         // $1M
  CONSECUTIVE_FAILURE_LIMIT: 3
};
```

## WebSocket API (Simulated)

### Block Header Subscription
```typescript
// Simulate new block headers
interface BlockHeader {
  blockNumber: number;
  timestamp: number;
  gasUsed: number;
  gasLimit: number;
  baseFeePerGas: number;
}

// Subscribe to new blocks
function subscribeToBlocks(callback: (block: BlockHeader) => void): void {
  const interval = setInterval(() => {
    const newBlock: BlockHeader = {
      blockNumber: getCurrentBlock(),
      timestamp: Date.now(),
      gasUsed: Math.random() * 15000000,
      gasLimit: 15000000,
      baseFeePerGas: 20 + Math.random() * 100
    };
    callback(newBlock);
  }, 12000); // Every 12 seconds (Ethereum block time)
}
```

### Mempool Monitoring
```typescript
// Monitor pending transactions
interface PendingTx {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasLimit: string;
}

function monitorMempool(callback: (tx: PendingTx) => void): void {
  // Simulate mempool activity
  setInterval(() => {
    if (Math.random() > 0.7) { // 30% chance of relevant tx
      const pendingTx: PendingTx = {
        hash: `0x${Math.random().toString(16).slice(2)}`,
        from: `0x${Math.random().toString(16).slice(2, 42)}`,
        to: `0x${Math.random().toString(16).slice(2, 42)}`,
        value: (Math.random() * 1000000).toString(),
        gasPrice: (20 + Math.random() * 100).toString(),
        gasLimit: '300000'
      };
      callback(pendingTx);
    }
  }, 1000); // Check every second
}
```

## Event System

### Event Types
```typescript
type BotEvent = 
  | { type: 'TRADE_EXECUTED'; payload: Trade }
  | { type: 'OPPORTUNITY_DETECTED'; payload: ArbitrageOpportunity }
  | { type: 'ERROR_OCCURRED'; payload: { message: string; severity: string } }
  | { type: 'STATUS_CHANGED'; payload: { oldStatus: BotStatus; newStatus: BotStatus } }
  | { type: 'MARKET_DATA_UPDATED'; payload: LiquidityPool[] };
```

### Event Handlers
```typescript
// Event handler interface
interface EventHandler<T = any> {
  (event: T): void;
}

// Event system implementation
class EventEmitter {
  private handlers: Map<string, EventHandler[]> = new Map();
  
  on<T>(eventType: string, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(eventType) || [];
    handlers.push(handler);
    this.handlers.set(eventType, handlers);
  }
  
  emit<T>(eventType: string, payload: T): void {
    const handlers = this.handlers.get(eventType) || [];
    handlers.forEach(handler => handler(payload));
  }
  
  off<T>(eventType: string, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(eventType) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }
}
```

## Error Handling

### Error Types
```typescript
interface BotError {
  code: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  context?: any;
}

// Common error codes
const ErrorCodes = {
  INSUFFICIENT_GAS: 'INSUFFICIENT_GAS',
  TRADE_FAILED: 'TRADE_FAILED',
  API_ERROR: 'API_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SLIPPAGE_TOO_HIGH: 'SLIPPAGE_TOO_HIGH',
  FRONT_RUN: 'FRONT_RUN',
  LIQUIDITY_LOW: 'LIQUIDITY_LOW'
} as const;
```

### Error Handler
```typescript
function handleError(error: BotError): void {
  console.error(`[${error.severity}] ${error.code}: ${error.message}`);
  
  // Log to external service in production
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service
  }
  
  // Take action based on severity
  switch (error.severity) {
    case 'critical':
      // Stop all trading immediately
      stopAllTrading();
      break;
    case 'high':
      // Pause trading temporarily
      pauseTrading(300000); // 5 minutes
      break;
    case 'medium':
      // Log warning and continue
      addLog(error.message, 'warning');
      break;
    case 'low':
      // Just log for monitoring
      addLog(error.message, 'info');
      break;
  }
}
```

## Performance Monitoring

### Metrics Collection
```typescript
interface PerformanceMetrics {
  totalTrades: number;
  successfulTrades: number;
  totalProfit: number;
  averageExecutionTime: number;
  gasEfficiency: number;
  uptime: number;
}

function collectMetrics(): PerformanceMetrics {
  // Implementation for metrics collection
  return {
    totalTrades: getTotalTrades(),
    successfulTrades: getSuccessfulTrades(),
    totalProfit: getTotalProfit(),
    averageExecutionTime: getAverageExecutionTime(),
    gasEfficiency: getGasEfficiency(),
    uptime: getUptime()
  };
}
```

---

This API reference provides comprehensive documentation for integrating with and extending the Flash Loan Arbitrage Bot Simulator. For implementation examples, see the source code in the repository.