
export enum BotStatus {
  LIVE = 'LIVE',
  BACKTESTING = 'BACKTESTING',
  STOPPED = 'STOPPED',
}

export interface Trade {
  id: string;
  timestamp: Date;
  tokenPair: string;
  dexs: string[];
  amount: number;
  netProfit: number;
  status: 'Success' | 'Failed';
  grossProfit: number;
  gasFee: number;
  slippage: number;
  loanProviderFee: number;
  fromAddress: string;
  toAddress: string;
  tokenFlow: string[];
}

export interface ProfitData {
  name: string;
  profit: number;
}

export interface LiquidityPool {
    id: string;
    dex: string;
    tokenPair: string;
    tokenA: string;
    tokenB: string;
    reserveA: number;
    reserveB: number;
    priceHistory: number[];
}

export interface ConsoleLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

// FIX: Added the missing BacktestReport interface to resolve an import error in components/ProductionReadinessChecklist.tsx.
export interface BacktestReport {
  totalProfit: number;
  winRate: number;
  maxDrawdown: number;
  profitableTrades: number;
  trades: number;
}
