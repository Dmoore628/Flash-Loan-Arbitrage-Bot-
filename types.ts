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
  status: 'Success' | 'Failed' | 'Pending';
  grossProfit: number;
  gasFee: number;
  slippage: number;
  loanProviderFee: number;
  failureReason: string | null;
  fromAddress: string;
  toAddress: string;
  tokenFlow: string[];
}

export interface PendingTransaction {
    id: string;
    resolveTime: number; // timestamp when it should be processed
    type: 'spatial' | 'triangular';
    route: any[]; // The pools involved
    amount: number;
    gasFee: number;
    loanProviderFee: number;
    initialNetProfit: number;
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

// Tracks the state of checklist items that are dynamically
// proven by the simulation's execution.
export interface ChecklistState {
  profitableTrade: boolean;
  triangularArbitrage: boolean;
  calculatesNetProfit: boolean;
  revertsUnprofitable: boolean;
  handlesFrontRunning: boolean;
  handlesPriceSlippage: boolean;
  killSwitch: boolean;
  sendsAlerts: boolean;
}

// FIX: Added missing BacktestReport interface
export interface BacktestReport {
  totalProfit: number;
  winRate: number;
  maxDrawdown: number;
  profitableTrades: number;
  trades: number;
}