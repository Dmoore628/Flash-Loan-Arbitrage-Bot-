import React, { useState } from 'react';
import { BotStatus } from '../types';

type DashboardTab = 'controls' | 'connection' | 'checklist';

const TabButton: React.FC<{tabId: DashboardTab; activeTab: DashboardTab; onClick: (tabId: DashboardTab) => void; children: React.ReactNode}> = ({ tabId, activeTab, onClick, children }) => {
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

// --- Content Components for each tab ---

const ControlsContent: React.FC<{ status: BotStatus; onStartLive: () => void; onStopLive: () => void; onRunBacktest: () => void; }> = ({ status, onStartLive, onStopLive, onRunBacktest }) => {
  const isRunning = status !== BotStatus.STOPPED;
  const isLive = status === BotStatus.LIVE;
  const isBacktesting = status === BotStatus.BACKTESTING;

  return (
    <>
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
    </>
  );
};


const StatusItem: React.FC<{ label: string; value: React.ReactNode; }> = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm py-3 border-b border-border last:border-b-0">
    <span className="text-text-secondary">{label}</span>
    <span className="font-semibold font-mono">{value}</span>
  </div>
);

const ConnectionContent: React.FC<{ status: BotStatus; currentBlock: number; }> = ({ status, currentBlock }) => {
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
    <>
      <h2 className="text-lg font-bold mb-1 text-text-primary">Live Connection</h2>
      <p className="text-sm text-text-secondary mb-4">Simulates a live WebSocket subscription.</p>
      <div className="space-y-1">
        <StatusItem label="Node Provider" value={<span className="text-text-primary">Alchemy WebSocket</span>} />
        <StatusItem label="Connection Status" value={getStatusElement()} />
        <StatusItem label="Live Block Number" value={<span className="text-blue-accent">{currentBlock.toLocaleString()}</span>} />
      </div>
    </>
  );
};

const ChecklistItem: React.FC<{ children: React.ReactNode; }> = ({ children }) => (
  <li className="flex items-start space-x-3">
    <div className="flex-shrink-0 pt-1">
      <div className="w-4 h-4 border-2 border-border rounded bg-background" />
    </div>
    <span className="text-sm text-text-secondary">{children}</span>
  </li>
);

const ChecklistSection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
  <div className="mb-4">
    <h4 className="font-semibold text-text-primary mb-2">{title}</h4>
    <ul className="space-y-2">{children}</ul>
  </div>
);

const ExpertInsight: React.FC<{ children: React.ReactNode; }> = ({ children }) => (
  <div className="mt-4 p-3 bg-blue-accent/5 border border-blue-accent/20 rounded-md">
    <p className="text-xs text-blue-accent/80">
      <span className="font-bold">Expert Insight:</span> {children}
    </p>
  </div>
);

const ChecklistContent: React.FC = () => {
  return (
    <div className="max-h-[30rem] overflow-y-auto pr-2">
      <h2 className="text-lg font-bold mb-1 text-text-primary">Deployment Checklist</h2>
      <p className="text-sm text-text-secondary mb-6">A comprehensive checklist for production readiness.</p>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-md font-bold text-text-primary border-b border-border pb-2 mb-3">Phase 1: Code & Development Readiness</h3>
          <ChecklistSection title="Smart Contract Security">
            <ChecklistItem>All external contract calls use pull-over-push to prevent re-entrancy attacks.</ChecklistItem>
            <ChecklistItem>All functions have correct visibility (public, private, internal, external).</ChecklistItem>
            <ChecklistItem>All numerical operations are safe from integer overflows/underflows (use Solidity 0.8.0+).</ChecklistItem>
            <ChecklistItem>require() statements are used for all input validation and state transitions.</ChecklistItem>
          </ChecklistSection>
          <ChecklistSection title="Code Efficiency">
            <ChecklistItem>The smart contract is optimized to minimize gas consumption.</ChecklistItem>
            <ChecklistItem>All loops are bounded and a for loop is not used to iterate through an unknown number of items.</ChecklistItem>
          </ChecklistSection>
          <ChecklistSection title="Off-Chain Code">
            <ChecklistItem>The monitoring script includes robust error handling for API failures.</ChecklistItem>
            <ChecklistItem>The script correctly handles dropped and pending transactions.</ChecklistItem>
            <ChecklistItem>All private keys and API endpoints are stored in secure environment variables.</ChecklistItem>
          </ChecklistSection>
          <ExpertInsight>A single line of faulty code can be a multi-million-dollar vulnerability. A final, objective review of your code is non-negotiable.</ExpertInsight>
        </div>

        <div>
          <h3 className="text-md font-bold text-text-primary border-b border-border pb-2 mb-3">Phase 2: Simulation & Validation</h3>
           <ChecklistSection title="Functional Validation">
            <ChecklistItem>The bot can correctly identify and execute a profitable arbitrage trade.</ChecklistItem>
            <ChecklistItem>The bot can successfully execute a "triangular arbitrage" trade.</ChecklistItem>
            <ChecklistItem>The bot correctly calculates net profit, including all fees (DEX, loan, gas).</ChecklistItem>
          </ChecklistSection>
          <ChecklistSection title="Resilience Testing">
            <ChecklistItem>The bot's revert logic works perfectly when a trade is unprofitable.</ChecklistItem>
            <ChecklistItem>The bot can handle front-running scenarios and still correctly revert.</ChecklistItem>
            <ChecklistItem>The bot's logic holds up when a small price change occurs mid-transaction.</ChecklistItem>
          </ChecklistSection>
          <ExpertInsight>If a test case fails, it's a success. The simulator's purpose is to find failures so you can fix them in a risk-free environment.</ExpertInsight>
        </div>

        <div>
          <h3 className="text-md font-bold text-text-primary border-b border-border pb-2 mb-3">Phase 3: Deployment & Live Operations</h3>
          <ChecklistSection title="Pre-Launch Checks">
            <ChecklistItem>The smart contract is deployed to the mainnet.</ChecklistItem>
            <ChecklistItem>A small amount of capital is available in the wallet to cover initial gas fees.</ChecklistItem>
            <ChecklistItem>A secure 24/7 cloud server is set up to run the bot.</ChecklistItem>
          </ChecklistSection>
          <ChecklistSection title="Operational Safeguards">
            <ChecklistItem>A kill switch is implemented in the smart contract to disable trading in an emergency.</ChecklistItem>
            <ChecklistItem>The bot has a clear mechanism to send alerts for any critical events.</ChecklistItem>
          </ChecklistSection>
           <ChecklistSection title="Financial & Legal Compliance">
            <ChecklistItem>A system is in place to track every transaction for tax reporting purposes.</ChecklistItem>
            <ChecklistItem>You have defined a clear maximum daily/weekly loss limit for your bot.</ChecklistItem>
          </ChecklistSection>
        </div>
      </div>
    </div>
  );
};


// --- Main Dashboard Panel Component ---

interface DashboardPanelProps {
  status: BotStatus;
  onStartLive: () => void;
  onStopLive: () => void;
  onRunBacktest: () => void;
  currentBlock: number;
}

const DashboardPanel: React.FC<DashboardPanelProps> = (props) => {
    const [activeTab, setActiveTab] = useState<DashboardTab>('controls');

    const renderContent = () => {
        switch(activeTab) {
            case 'controls':
                return <ControlsContent {...props} />;
            case 'connection':
                return <ConnectionContent {...props} />;
            case 'checklist':
                return <ChecklistContent />;
            default:
                return null;
        }
    }

    return (
        <div className="bg-panel border border-border rounded-lg flex flex-col">
            <div className="border-b border-border px-2 flex-shrink-0">
                <TabButton tabId="controls" activeTab={activeTab} onClick={setActiveTab}>Controls</TabButton>
                <TabButton tabId="connection" activeTab={activeTab} onClick={setActiveTab}>Connection</TabButton>
                <TabButton tabId="checklist" activeTab={activeTab} onClick={setActiveTab}>Checklist</TabButton>
            </div>
            <div className="p-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default DashboardPanel;