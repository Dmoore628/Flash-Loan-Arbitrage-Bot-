import React from 'react';
import { BotStatus } from '../types';

interface ControlPanelProps {
  status: BotStatus;
  onStartLive: () => void;
  onStopLive: () => void;
  onRunBacktest: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ status, onStartLive, onStopLive, onRunBacktest }) => {
  const isRunning = status !== BotStatus.STOPPED;
  const isLive = status === BotStatus.LIVE;
  const isBacktesting = status === BotStatus.BACKTESTING;

  return (
    <div className="bg-panel border border-border rounded-lg p-6">
      <h2 className="text-lg font-bold mb-1 text-text-primary">Controls</h2>
      <p className="text-sm text-text-secondary mb-6">Manage the bot's simulation state.</p>
      <div className="space-y-4">
        {isLive ? (
          <button
            onClick={onStopLive}
            className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-semibold rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background bg-red-accent hover:bg-red-accent/90 text-white focus:ring-red-accent/80"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
            </svg>
            Stop Live Simulation
          </button>
        ) : (
          <button
            onClick={onStartLive}
            disabled={isRunning}
            className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-semibold rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background bg-green-accent hover:bg-green-accent/90 text-white focus:ring-green-accent/80 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
            Start Live Simulation
          </button>
        )}
        <p className="text-xs text-center text-text-secondary px-4">
          Starts a real-time simulation against a live-updating mainnet fork.
        </p>

        <div className="relative flex pt-2 items-center">
          <div className="flex-grow border-t border-border"></div>
        </div>

        <button
          onClick={onRunBacktest}
          disabled={isRunning}
          className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-semibold rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background bg-transparent hover:bg-blue-accent/10 text-blue-accent border border-blue-accent/50 hover:border-blue-accent disabled:bg-transparent disabled:text-text-secondary disabled:border-border disabled:cursor-not-allowed"
        >
          {isBacktesting ? 'Backtesting...' : 'Run Backtest'}
        </button>
        <p className="text-xs text-center text-text-secondary px-4">
          Tests the bot's strategy against one month of historical data.
        </p>
      </div>
    </div>
  );
};

export default ControlPanel;