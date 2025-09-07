
import React, { useState } from 'react';
import { BotStatus, ChecklistState } from '../types';

type DashboardTab = 'checklist' | 'controls' | 'connection';

// FIX: Renamed TabButton to Tab to resolve "Cannot find name 'Tab'" errors.
const Tab: React.FC<{tabId: DashboardTab; activeTab: DashboardTab; onClick: (tabId: DashboardTab) => void; children: React.ReactNode}> = ({ tabId, activeTab, onClick, children }) => {
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

const ControlsContent: React.FC<{ status: BotStatus; onStartLive: () => void; onStopLive: () => void; onKillSwitch: () => void; }> = ({ status, onStartLive, onStopLive, onKillSwitch }) => {
  const isRunning = status !== BotStatus.STOPPED;
  const isLive = status === BotStatus.LIVE;

  return (
    <>
      <h2 className="text-lg font-bold mb-1 text-text-primary">Controls</h2>
      <p className="text-sm text-text-secondary mb-6">Manage the bot's simulation state.</p>
      <div className="space-y-4">
        {isLive ? (
          <button
            onClick={onStopLive}
            className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-semibold rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background bg-yellow-500 hover:bg-yellow-500/90 text-white focus:ring-yellow-500/80"
          >
             <svg xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
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
        
        <div className="relative flex pt-2 items-center">
          <div className="flex-grow border-t border-border"></div>
        </div>

        <button
          onClick={onKillSwitch}
          disabled={!isLive}
          className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-semibold rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background bg-red-accent/80 hover:bg-red-accent text-white focus:ring-red-accent disabled:bg-red-accent/20 disabled:text-text-secondary disabled:border-border disabled:cursor-not-allowed"
        >
          Engage Kill Switch
        </button>
        <p className="text-xs text-center text-text-secondary px-4">
          Emergency stop. Halts all bot activity immediately.
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

const ConnectionContent: React.FC<{ status: BotStatus; currentBlock: number; gasTankBalance: number; onGetFaucetEth: () => void; }> = ({ status, currentBlock, gasTankBalance, onGetFaucetEth }) => {
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
        <StatusItem label="Gas Tank (Simulated)" value={<span className={gasTankBalance < 0.1 ? 'text-red-accent' : 'text-text-primary'}>{gasTankBalance.toFixed(4)} ETH</span>} />
      </div>
       <button 
        onClick={onGetFaucetEth}
        disabled={status === BotStatus.LIVE}
        className="w-full mt-4 py-2 px-4 text-sm font-semibold rounded-md transition-all bg-blue-accent/10 hover:bg-blue-accent/20 text-blue-accent border border-blue-accent/50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Get 0.5 Faucet ETH
      </button>
    </>
  );
};

const ChecklistItem: React.FC<{ isChecked: boolean; children: React.ReactNode; isStatic?: boolean }> = ({ isChecked, children, isStatic = false }) => (
  <li className="flex items-start space-x-3">
    <div className="flex-shrink-0 pt-1">
      <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all duration-300 ${isStatic ? 'bg-panel border-border' : isChecked ? 'bg-green-accent border-green-accent' : 'bg-background border-border'}`}>
        {isChecked && !isStatic && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
        {isStatic && <div className="w-1.5 h-1.5 bg-text-secondary rounded-full"></div>}
      </div>
    </div>
    <span className={`text-sm transition-colors ${isChecked ? 'text-text-primary' : 'text-text-secondary'}`}>{children}</span>
  </li>
);

const ChecklistSection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
  <div className="mb-4">
    <h4 className="font-semibold text-text-primary mb-2 text-sm">{title}</h4>
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

const ChecklistContent: React.FC<{ state: ChecklistState }> = ({ state }) => {
  return (
    <div className="max-h-[34rem] overflow-y-auto pr-2">
      <h2 className="text-lg font-bold mb-1 text-text-primary">Deployment Checklist</h2>
      <p className="text-sm text-text-secondary mb-6">An expert-level guide for production readiness. The simulation will prove the validation criteria below.</p>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-md font-bold text-text-primary border-b border-border pb-2 mb-3">Phase 1: Code & Development Readiness</h3>
           <ChecklistSection title="Smart Contract Security">
            <ChecklistItem isChecked={true} isStatic>All external calls use pull-over-push to prevent re-entrancy.</ChecklistItem>
            <ChecklistItem isChecked={true} isStatic>All functions have correct visibility (public, private, etc.).</ChecklistItem>
            <ChecklistItem isChecked={true} isStatic>Numerical operations are safe from overflows (Solidity 0.8.0+).</ChecklistItem>
            <ChecklistItem isChecked={true} isStatic>require() statements are used for all input validation.</ChecklistItem>
          </ChecklistSection>
          <ExpertInsight>A single line of faulty code can be a multi-million-dollar vulnerability. A final, objective review of your code is non-negotiable.</ExpertInsight>
        </div>
        
        <div>
          <h3 className="text-md font-bold text-text-primary border-b border-border pb-2 mb-3">Phase 2: Simulation & Validation</h3>
           <ChecklistSection title="Functional Validation">
            <ChecklistItem isChecked={state.profitableTrade}>The bot correctly executes a profitable arbitrage trade.</ChecklistItem>
            <ChecklistItem isChecked={state.triangularArbitrage}>The bot can execute a "triangular arbitrage" trade.</ChecklistItem>
            <ChecklistItem isChecked={state.calculatesNetProfit}>The bot correctly calculates net profit, including all fees.</ChecklistItem>
          </ChecklistSection>
          <ChecklistSection title="Resilience Testing">
            <ChecklistItem isChecked={state.revertsUnprofitable}>The bot's revert logic works when a trade is unprofitable.</ChecklistItem>
            <ChecklistItem isChecked={state.handlesFrontRunning}>The bot can handle front-running scenarios and still revert.</ChecklistItem>
            <ChecklistItem isChecked={state.handlesPriceSlippage}>The bot's logic holds up when price changes mid-transaction.</ChecklistItem>
          </ChecklistSection>
          <ExpertInsight>If a test case fails, it's a success. The simulator's purpose is to find failures so you can fix them in a risk-free environment.</ExpertInsight>
        </div>

        <div>
          <h3 className="text-md font-bold text-text-primary border-b border-border pb-2 mb-3">Phase 3: Deployment & Live Operations</h3>
          <ChecklistSection title="Operational Safeguards">
            <ChecklistItem isChecked={state.killSwitch}>A kill switch is implemented to disable trading in an emergency.</ChecklistItem>
            <ChecklistItem isChecked={state.sendsAlerts}>The bot sends alerts for critical events (e.g., multiple failures).</ChecklistItem>
          </ChecklistSection>
           <ChecklistSection title="Financial & Legal Compliance">
            <ChecklistItem isChecked={true} isStatic>A system is in place to track every transaction for tax reporting.</ChecklistItem>
            <ChecklistItem isChecked={true} isStatic>A clear maximum daily/weekly loss limit is defined.</ChecklistItem>
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
  onKillSwitch: () => void;
  currentBlock: number;
  checklistState: ChecklistState;
  gasTankBalance: number;
  onGetFaucetEth: () => void;
}

const DashboardPanel: React.FC<DashboardPanelProps> = (props) => {
    const [activeTab, setActiveTab] = useState<DashboardTab>('checklist');

    const renderContent = () => {
        switch(activeTab) {
            case 'controls':
                return <ControlsContent {...props} />;
            case 'connection':
                return <ConnectionContent {...props} />;
            case 'checklist':
                return <ChecklistContent state={props.checklistState}/>;
            default:
                return null;
        }
    }

    return (
        <div className="bg-panel border border-border rounded-lg flex flex-col">
            <div className="border-b border-border px-2 flex-shrink-0">
                {/* FIX: Renamed TabButton to Tab to resolve "Cannot find name 'Tab'" errors. */}
                <Tab tabId="checklist" activeTab={activeTab} onClick={setActiveTab}>Checklist</Tab>
                <Tab tabId="controls" activeTab={activeTab} onClick={setActiveTab}>Controls</Tab>
                <Tab tabId="connection" activeTab={activeTab} onClick={setActiveTab}>Connection</Tab>
            </div>
            <div className="p-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default DashboardPanel;
