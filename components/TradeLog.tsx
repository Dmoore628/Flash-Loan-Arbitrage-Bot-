import React from 'react';
import { Trade } from '../types';

interface TradeLogProps {
  trades: Trade[];
  onTradeClick: (trade: Trade) => void;
}

const TradeLogRow: React.FC<{ trade: Trade; onTradeClick: (trade: Trade) => void }> = ({ trade, onTradeClick }) => {
  const isProfit = trade.netProfit >= 0;
  const profitColor = isProfit ? 'text-green-accent' : 'text-red-accent';
  const statusColor = trade.status === 'Success' ? 'text-green-accent' : 'text-red-accent';

  return (
    <tr className="border-b border-border hover:bg-panel/50 text-xs">
      <td className="p-3 font-mono">
        <button onClick={() => onTradeClick(trade)} className="text-blue-accent hover:underline" title={trade.id}>
          {trade.id.substring(0, 10)}...
        </button>
      </td>
      <td className="p-3 hidden sm:table-cell text-text-secondary">{trade.timestamp.toLocaleTimeString()}</td>
      <td className="p-3 text-text-primary">{trade.tokenPair}</td>
      <td className="p-3 hidden md:table-cell text-text-secondary">{`${trade.dexs[0]} -> ${trade.dexs[1]}`}</td>
      <td className={`p-3 font-semibold font-mono ${profitColor}`}>{isProfit ? '+' : ''}{trade.netProfit.toFixed(2)}</td>
      <td className={`p-3 font-semibold ${statusColor}`}>{trade.status}</td>
    </tr>
  );
};

const TradeLog: React.FC<TradeLogProps> = ({ trades, onTradeClick }) => {
  return (
    <div className="h-full overflow-y-auto">
      <table className="w-full text-left">
        <thead className="sticky top-0 bg-panel z-10">
          <tr className="text-text-secondary uppercase text-xs border-b border-border">
            <th className="p-3 font-medium">Tx Hash</th>
            <th className="p-3 font-medium hidden sm:table-cell">Time</th>
            <th className="p-3 font-medium">Pair</th>
            <th className="p-3 font-medium hidden md:table-cell">Route</th>
            <th className="p-3 font-medium">Net Profit ($)</th>
            <th className="p-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {trades.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center p-8 text-text-secondary">
                No transactions logged yet.
              </td>
            </tr>
          ) : (
            trades.map((trade) => <TradeLogRow key={trade.id} trade={trade} onTradeClick={onTradeClick} />)
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TradeLog;