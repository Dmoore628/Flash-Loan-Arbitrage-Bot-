
import React, { useState, useEffect } from 'react';

interface PreFlightCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CheckboxItem: React.FC<{ isChecked: boolean; onToggle: () => void; children: React.ReactNode }> = ({ isChecked, onToggle, children }) => (
    <label className="flex items-start space-x-3 p-3 bg-background/50 rounded-md border border-border cursor-pointer hover:border-blue-accent/50">
        <input 
            type="checkbox" 
            checked={isChecked} 
            onChange={onToggle}
            className="mt-1 h-4 w-4 rounded border-border text-blue-accent bg-background focus:ring-blue-accent"
        />
        <span className="text-sm text-text-secondary">{children}</span>
    </label>
);

const PreFlightCheckModal: React.FC<PreFlightCheckModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [checks, setChecks] = useState({
    isSimulation: false,
    needsAudit: false,
    secureInfra: false,
    marketRisk: false,
  });

  const allChecked = Object.values(checks).every(Boolean);

  useEffect(() => {
    // Reset checks when modal is opened
    if (isOpen) {
        setChecks({
            isSimulation: false,
            needsAudit: false,
            secureInfra: false,
            marketRisk: false,
        });
    }
  }, [isOpen]);

  const handleToggle = (key: keyof typeof checks) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isOpen) return null;

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
            <h2 className="text-lg font-bold text-text-primary">Mainnet Deployment - Pre-Flight Check</h2>
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-2xl">&times;</button>
        </header>

        <main className="p-6 overflow-y-auto space-y-4">
            <p className="text-sm text-text-secondary mb-4">This high-fidelity simulator tests your STRATEGY. A real-world deployment requires additional, critical steps for SECURITY and INFRASTRUCTURE. Acknowledge the following before proceeding:</p>
            
            <CheckboxItem isChecked={checks.isSimulation} onToggle={() => handleToggle('isSimulation')}>
                I understand this is a <b className="text-text-primary">BROWSER-BASED SIMULATION</b> and is not connected to a real blockchain or wallet. All assets and transactions are self-contained and have no real value.
            </CheckboxItem>

            <CheckboxItem isChecked={checks.needsAudit} onToggle={() => handleToggle('needsAudit')}>
                I understand that real-world smart contract security requires a professional, multi-party <b className="text-text-primary">SECURITY AUDIT</b> by a reputable firm, a step that cannot be simulated.
            </CheckboxItem>

            <CheckboxItem isChecked={checks.secureInfra} onToggle={() => handleToggle('secureInfra')}>
                I understand that managing private keys and API secrets in a <b className="text-text-primary">SECURE, 24/7 SERVER ENVIRONMENT</b> is critical for a live bot and is NOT part of this simulation.
            </CheckboxItem>

            <CheckboxItem isChecked={checks.marketRisk} onToggle={() => handleToggle('marketRisk')}>
                I understand that real-world market conditions can change instantly and that past performance in this simulation <b className="text-text-primary">DOES NOT GUARANTEE</b> future results on the mainnet.
            </CheckboxItem>
        </main>
        
        <footer className="p-4 border-t border-border mt-auto bg-background/50 rounded-b-lg">
            <button
                onClick={onConfirm}
                disabled={!allChecked}
                className="w-full sm:w-auto float-right py-2 px-6 text-sm font-semibold rounded-md transition-colors bg-green-accent hover:bg-green-accent/90 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                Acknowledge & Proceed to Simulation
            </button>
        </footer>
      </div>
    </div>
  );
};

export default PreFlightCheckModal;
