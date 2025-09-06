import React from 'react';
import { Trade } from '../types';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  trade: Trade | null;
}

const DetailRow: React.FC<{ label: string; children: React.ReactNode; isMono?: boolean; }> = ({ label, children, isMono = false }) => (
    <div className="flex flex-col sm:flex-row justify-between py-3 border-b border-border">
        <span className="text-sm text-text-secondary w-full sm:w-1/3 mb-1 sm:mb-0">{label}</span>
        <div className={`text-sm text-text-primary w-full sm:w-2/3 break-words ${isMono ? 'font-mono' : ''}`}>
            {children}
        </div>
    </div>
);

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ isOpen, onClose, trade }) => {
  if (!isOpen || !trade) return null;

  const isSuccess = trade.status === 'Success';
  const profitColor = trade.netProfit >= 0 ? 'text-green-accent' : 'text-red-accent';

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-panel border border-border rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-border">
            <h2 className="text-lg font-bold text-text-primary">Transaction Details</h2>
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-2xl">&times;</button>
        </header>

        <main className="p-6 overflow-y-auto">
            <DetailRow label="Transaction Hash" isMono>
                {trade.id}
            </DetailRow>
            <DetailRow label="Status">
                <span className={`px-2 py-1 text-xs font-bold rounded ${isSuccess ? 'bg-green-accent/10 text-green-accent' : 'bg-red-accent/10 text-red-accent'}`}>
                    {trade.status}
                </span>
            </DetailRow>
            <DetailRow label="Timestamp">
                {trade.timestamp.toLocaleString()}
            </DetailRow>
            <DetailRow label="From" isMono>{trade.fromAddress}</DetailRow>
            <DetailRow label="To (Contract)" isMono>{trade.toAddress}</DetailRow>

            <div className="mt-6">
                <h3 className="text-md font-bold text-text-primary mb-2">Token Flow</h3>
                <div className="bg-background rounded-md p-4 space-y-2 text-xs font-mono border border-border">
                    {trade.tokenFlow.map((flow, index) => <p key={index} className="text-text-secondary">{flow}</p>)}
                </div>
            </div>

            <div className="mt-6">
                 <h3 className="text-md font-bold text-text-primary mb-2">Financials</h3>
                 <div className="space-y-2">
                    <DetailRow label="Gross Profit">
                        <span className={trade.grossProfit >= 0 ? 'text-green-accent' : 'text-red-accent'}>+{trade.grossProfit.toFixed(4)}</span>
                    </DetailRow>
                     <DetailRow label="Loan Provider Fee">
                       <span className="text-red-accent">-{trade.loanProviderFee.toFixed(4)}</span>
                    </DetailRow>
                    <DetailRow label="Slippage Cost (Est)">
                       <span className="text-red-accent">-{trade.slippage.toFixed(4)}</span>
                    </DetailRow>
                    <DetailRow label="Gas Fee">
                        <span className="text-red-accent">-${trade.gasFee.toFixed(2)}</span>
                    </DetailRow>
                     <DetailRow label="Net Profit">
                        <span className={`font-bold ${profitColor}`}>{trade.netProfit.toFixed(4)}</span>
                    </DetailRow>
                 </div>
            </div>

        </main>
        
        <footer className="p-4 border-t border-border mt-auto bg-background/50 rounded-b-lg">
            <button
                onClick={onClose}
                className="w-full sm:w-auto float-right py-2 px-6 text-sm font-semibold rounded-md transition-colors bg-blue-accent hover:bg-blue-accent/90 text-white"
            >
                Close
            </button>
        </footer>
      </div>
    </div>
  );
};

export default TransactionDetailModal;