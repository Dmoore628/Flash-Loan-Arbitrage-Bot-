import React from 'react';
import { Trade } from '../types';

interface TradeLogProps {
  trades: Trade[];
  onTradeClick: (trade: Trade) => void;
}

const TradeLogRow: React.FC<{ trade: Trade; onTradeClick: (trade: Trade) => void }> = ({ trade, onTradeClick }) => {
  const isProfit = trade.netProfit >= 0;
  
  const getStatusInfo = () => {
    switch (trade.status) {
      case 'Success':
        return { color: 'text-green-accent', text: 'Success' };
      case 'Failed':
        return { color: 'text-red-accent', text: 'Failed' };
      case 'Pending':
        return { color: 'text-yellow-400', text: 'Pending' };
      default:
        return { color: 'text-text-secondary', text: 'Unknown' };
    }
  };

  const statusInfo = getStatusInfo();
  const profitColor = trade.status === 'Success' ? (isProfit ? 'text-green-accent' : 'text-red-accent') : 'text-text-secondary';
  const profitPrefix = trade.status === 'Success' && isProfit ? '+' : '';

  return (
    <tr 
      className="border-b border-border hover:bg-panel/50 text-xs"
      title={trade.failureReason ?? ''}
    >
      <td className="p-3 font-mono">
        <button onClick={() => onTradeClick(trade)} className="text-blue-accent hover:underline" title={trade.id}>
          {trade.id.substring(0, 10)}...
        </button>
      </td>
      <td className="p-3 hidden sm:table-cell text-text-secondary">{trade.timestamp.toLocaleTimeString()}</td>
      <td className="p-3 text-text-primary">{trade.tokenPair}</td>
      <td className="p-3 hidden md:table-cell text-text-secondary">{trade.dexs.join(' -> ')}</td>
      <td className={`p-3 font-semibold font-mono ${profitColor}`}>
        {trade.status === 'Pending' ? '...' : `${profitPrefix}${trade.netProfit.toFixed(2)}`}
      </td>
      <td className={`p-3 font-semibold ${statusInfo.color}`}>
        <div className="flex items-center">
            {trade.status === 'Pending' && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {statusInfo.text}
        </div>
      </td>
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
            <th className="p-3 font-medium">Pair/Route</th>
            <th className="p-3 font-medium hidden md:table-cell">DEX Route</th>
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