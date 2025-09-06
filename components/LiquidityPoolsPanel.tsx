import React from 'react';
import { LiquidityPool } from '../types';

interface LiquidityPoolsPanelProps {
  pools: LiquidityPool[];
}

const LiquidityPoolsPanel: React.FC<LiquidityPoolsPanelProps> = ({ pools }) => {
  return (
    <div className="space-y-2">
      <p className="text-xs text-text-secondary mb-4 px-1">
        Displaying live data from real-world DEX contracts on the local Mainnet fork.
      </p>
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="text-text-secondary border-b border-border">
            <th className="pb-2 font-semibold">DEX</th>
            <th className="pb-2 font-semibold text-right">WETH Reserve</th>
            <th className="pb-2 font-semibold text-right">USDC Reserve</th>
            <th className="pb-2 font-semibold text-right">Price (USDC/WETH)</th>
          </tr>
        </thead>
        <tbody>
          {pools.map(pool => {
            const price = pool.reserveB / pool.reserveA;
            return (
              <tr key={pool.id} className="border-b border-border/70">
                <td className="py-3 pr-2">
                  <span className="font-bold text-text-primary">{pool.dex}</span>
                </td>
                <td className="py-3 px-2 text-right font-mono text-text-secondary">
                  {pool.reserveA.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-2 text-right font-mono text-text-secondary">
                  {pool.reserveB.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </td>
                <td className="py-3 pl-2 text-right font-mono font-bold text-green-accent">
                  ${price.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LiquidityPoolsPanel;