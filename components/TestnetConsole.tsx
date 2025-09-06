import React, { useEffect, useRef } from 'react';
import { ConsoleLog } from '../types';

interface TestnetConsoleProps {
  logs: ConsoleLog[];
  ethBalance: number;
  onGetFaucetEth: () => void;
}

const logTypeClasses = {
  info: 'text-gray-400',
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
};

const TestnetConsole: React.FC<TestnetConsoleProps> = ({ logs, ethBalance, onGetFaucetEth }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center p-4 border-b border-gray-600 bg-gray-900/50 rounded-t-lg">
        <h2 className="text-xl font-bold text-gray-100 mb-2 md:mb-0">Testnet Simulation Console</h2>
        <div className="flex items-center space-x-4 text-xs">
          <div className="text-center">
            <span className="text-gray-400 block">Network</span>
            <span className="font-mono text-yellow-400">Sepolia</span>
          </div>
          <div className="text-center">
            <span className="text-gray-400 block">Wallet</span>
            <span className="font-mono">0xSIM...dE4d</span>
          </div>
          <div className="text-center">
            <span className="text-gray-400 block">Balance</span>
            <span className="font-mono text-green-400">{ethBalance.toFixed(4)} ETH</span>
          </div>
          <button 
            onClick={onGetFaucetEth}
            className="bg-blue-accent/80 hover:bg-blue-accent text-white font-bold py-1 px-3 rounded text-xs"
          >
            Get Faucet ETH
          </button>
        </div>
      </div>
      <div ref={logContainerRef} className="h-72 overflow-y-auto p-4 font-mono text-xs">
        {logs.map(log => (
          <div key={log.id} className="flex">
            <span className="text-gray-500 mr-2">{log.timestamp}</span>
            <p className={`${logTypeClasses[log.type]} whitespace-pre-wrap`}>{log.message}</p>
          </div>
        ))}
         {logs.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            Console is idle. Start the bot to see simulation logs.
          </div>
        )}
      </div>
    </div>
  );
};

export default TestnetConsole;
