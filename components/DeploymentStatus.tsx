import React from 'react';

const StatusItem: React.FC<{ label: string; value: string; valueColor?: string }> = ({ label, value, valueColor = 'text-gray-100' }) => (
  <div className="flex justify-between items-center text-sm py-2 border-b border-gray-700/50 last:border-b-0">
    <span className="text-gray-400">{label}</span>
    <span className={`font-semibold font-mono ${valueColor}`}>{value}</span>
  </div>
);

interface DeploymentStatusProps {
  ethBalance: number;
}

const DeploymentStatus: React.FC<DeploymentStatusProps> = ({ ethBalance }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-100">Deployment Status</h2>
      <div className="space-y-1">
        <StatusItem label="Network" value="Testnet Simulation" valueColor="text-yellow-400" />
        <StatusItem label="Status" value="Online" valueColor="text-green-400" />
        <StatusItem label="Contract Address" value="0xSIM...dE4d" />
        <StatusItem label="Gas Tank" value={`${ethBalance.toFixed(4)} ETH (Simulated)`} />
      </div>
       <p className="text-xs text-gray-500 mt-4">
        This panel shows the simulated deployment status. The bot operates exclusively in a sandboxed test environment.
      </p>
    </div>
  );
};

export default DeploymentStatus;
