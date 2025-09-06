import React from 'react';
import { BacktestReport } from '../types';

interface BacktestingReportProps {
  report: BacktestReport | null;
}

const ReportItem: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color = 'text-text-primary' }) => (
  <div className="flex justify-between items-center bg-background/50 p-3 rounded-md border border-border">
    <span className="text-sm text-text-secondary">{label}</span>
    <span className={`text-base font-bold font-mono ${color}`}>{value}</span>
  </div>
);

const BacktestingReport: React.FC<BacktestingReportProps> = ({ report }) => {
  return (
    <div className="bg-panel border border-border rounded-lg p-6">
      <h2 className="text-lg font-bold mb-1 text-text-primary">Backtesting Report</h2>
      <p className="text-sm text-text-secondary mb-6">Performance metrics from historical data.</p>
      {report ? (
        <div className="space-y-3">
          <ReportItem 
            label="Total Net Profit" 
            value={`$${report.totalProfit.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} 
            color="text-green-accent" 
          />
          <ReportItem 
            label="Win Rate" 
            value={`${report.winRate.toFixed(1)}%`}
            color="text-blue-accent"
          />
           <ReportItem 
            label="Max Drawdown" 
            value={`${report.maxDrawdown.toFixed(1)}%`}
            color="text-red-accent"
          />
          <ReportItem 
            label="Total Trades" 
            value={`${report.profitableTrades} / ${report.trades}`}
          />
        </div>
      ) : (
        <div className="text-center py-12 text-text-secondary text-sm">
          Run a backtest to generate a performance report.
        </div>
      )}
    </div>
  );
};

export default BacktestingReport;