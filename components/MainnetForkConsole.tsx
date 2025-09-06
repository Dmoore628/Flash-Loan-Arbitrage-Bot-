import React from 'react';
import { BotStatus } from '../types';

const StatusItem: React.FC<{ label: string; value: React.ReactNode; }> = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm py-3 border-b border-border last:border-b-0">
    <span className="text-text-secondary">{label}</span>
    <span className="font-semibold font-mono">{value}</span>
  </div>
);

interface LiveConnectionConsoleProps {
  status: BotStatus;
  currentBlock: number;
}

const LiveConnectionConsole: React.FC<LiveConnectionConsoleProps> = ({ status, currentBlock }) => {
    const getStatusElement = () => {
        switch (status) {
            case BotStatus.LIVE:
                return <span className="text-green-accent">Connected (Listening...)</span>;
            case BotStatus.BACKTESTING:
                return <span className="text-yellow-400">Disconnected (Backtesting)</span>;
            case BotStatus.STOPPED:
                return <span className="text-red-accent">Disconnected</span>;
            default:
                return <span className="text-text-secondary">Unknown</span>
        }
    };

  return (
    <div className="bg-panel border border-border rounded-lg p-6">
      <h2 className="text-lg font-bold mb-1 text-text-primary">Live Connection</h2>
      <p className="text-sm text-text-secondary mb-4">Simulates a live WebSocket subscription.</p>
      <div className="space-y-1 mb-4">
        <StatusItem label="Node Provider" value={<span className="text-text-primary">Alchemy WebSocket</span>} />
        <StatusItem label="Connection Status" value={getStatusElement()} />
        <StatusItem label="Live Block Number" value={<span className="text-blue-accent">{currentBlock.toLocaleString()}</span>} />
      </div>
    </div>
  );
};

export default LiveConnectionConsole;