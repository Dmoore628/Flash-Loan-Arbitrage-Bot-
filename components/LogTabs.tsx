import React, { useState, useRef, useEffect } from 'react';
import { ConsoleLog, Trade } from '../types';
import TradeLog from './TradeLog';

interface LogTabsProps {
    consoleLogs: ConsoleLog[];
    trades: Trade[];
    onTradeClick: (trade: Trade) => void;
}

type LogPanelTab = 'console' | 'trades';

const TabButton: React.FC<{tabId: LogPanelTab; activeTab: LogPanelTab; onClick: (tabId: LogPanelTab) => void; children: React.ReactNode}> = ({ tabId, activeTab, onClick, children }) => {
    const isActive = activeTab === tabId;
    return (
        <button 
            onClick={() => onClick(tabId)} 
            className={`px-4 py-3 text-sm font-semibold transition-colors focus:outline-none border-b-2 ${isActive ? 'border-blue-accent text-text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
        >
            {children}
        </button>
    );
};

const logTypeClasses = {
  info: 'text-text-secondary',
  success: 'text-green-accent',
  error: 'text-red-accent',
  warning: 'text-yellow-400',
};

const LiveActivityConsole: React.FC<{ logs: ConsoleLog[] }> = ({ logs }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div ref={logContainerRef} className="h-full overflow-y-auto p-4 font-mono text-xs">
        {logs.map(log => (
          <div key={log.id} className="flex">
            <span className="text-gray-500 mr-4 flex-shrink-0">{log.timestamp}</span>
            <p className={`${logTypeClasses[log.type]} whitespace-pre-wrap break-words`}>{log.message}</p>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="flex items-center justify-center h-full text-text-secondary">
            Console is idle. Start the live simulation or run a backtest.
          </div>
        )}
      </div>
  );
};


const LogTabs: React.FC<LogTabsProps> = ({ consoleLogs, trades, onTradeClick }) => {
    const [activeTab, setActiveTab] = useState<LogPanelTab>('console');

    return (
        <div className="bg-panel border border-border rounded-lg flex flex-col h-[32rem]">
            <div className="border-b border-border px-2 flex-shrink-0">
                <TabButton tabId="console" activeTab={activeTab} onClick={setActiveTab}>Activity Console</TabButton>
                <TabButton tabId="trades" activeTab={activeTab} onClick={setActiveTab}>Transaction Log</TabButton>
            </div>
            <div className="flex-grow overflow-hidden">
                {activeTab === 'console' && <LiveActivityConsole logs={consoleLogs} />}
                {activeTab === 'trades' && <TradeLog trades={trades} onTradeClick={onTradeClick} />}
            </div>
        </div>
    );
};

export default LogTabs;