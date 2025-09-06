import React, { useState } from 'react';
import LiquidityPoolsPanel from './LiquidityPoolsPanel';
import SmartContractPanel from './SmartContractPanel';
import { LiquidityPool } from '../types';

interface InfoTabsProps {
    pools: LiquidityPool[];
}

type InfoPanelTab = 'pools' | 'contract';

const TabButton: React.FC<{tabId: InfoPanelTab; activeTab: InfoPanelTab; onClick: (tabId: InfoPanelTab) => void; children: React.ReactNode}> = ({ tabId, activeTab, onClick, children }) => {
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


const InfoTabs: React.FC<InfoTabsProps> = ({ pools }) => {
    const [activeTab, setActiveTab] = useState<InfoPanelTab>('pools');

    return (
        <div className="bg-panel border border-border rounded-lg flex flex-col">
            <div className="border-b border-border px-2 flex-shrink-0">
                <TabButton tabId="pools" activeTab={activeTab} onClick={setActiveTab}>Live Pools</TabButton>
                <TabButton tabId="contract" activeTab={activeTab} onClick={setActiveTab}>Contract</TabButton>
            </div>
            <div className="p-6 h-[28rem] overflow-y-auto">
                {activeTab === 'pools' && <LiquidityPoolsPanel pools={pools} />}
                {activeTab === 'contract' && <SmartContractPanel />}
            </div>
        </div>
    );
};

export default InfoTabs;