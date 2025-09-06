import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trade, BotStatus, ProfitData, LiquidityPool, ConsoleLog } from './types';
import Header from './components/Header';
import StatCard from './components/StatCard';
import TransactionDetailModal from './components/TransactionDetailModal';
import InfoTabs from './components/InfoTabs';
import LogTabs from './components/LogTabs';
import DashboardPanel from './components/DashboardPanel';

const initialPools: LiquidityPool[] = [
  { id: '1', dex: 'Uniswap v3', tokenPair: 'WETH/USDC', tokenA: 'WETH', tokenB: 'USDC', reserveA: 2000, reserveB: 5000000, priceHistory: Array(20).fill(2500) },
  { id: '2', dex: 'SushiSwap', tokenPair: 'WETH/USDC', tokenA: 'WETH', tokenB: 'USDC', reserveA: 2000, reserveB: 5000000, priceHistory: Array(20).fill(2500) },
];

const App: React.FC = () => {
  const [status, setStatus] = useState<BotStatus>(BotStatus.STOPPED);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [profitData, setProfitData] = useState<ProfitData[]>([]);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [pools, setPools] = useState<LiquidityPool[]>(initialPools);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [currentBlock, setCurrentBlock] = useState<number>(19845321);

  const simulationInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const addLog = useCallback((message: string, type: ConsoleLog['type']) => {
    const newLog: ConsoleLog = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
    };
    setConsoleLogs(prev => [...prev.slice(-199), newLog]);
  }, []);
  
  const stopSimulation = useCallback(() => {
    if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
        simulationInterval.current = null;
    }
    setStatus(BotStatus.STOPPED);
    addLog('Live simulation stopped by user.', 'warning');
  }, [addLog]);


  const runLiveSimulation = useCallback(() => {
    setStatus(BotStatus.LIVE);
    setTrades([]);
    setProfitData([]);
    setTotalProfit(0);
    setConsoleLogs([]);
    addLog('Starting live simulation...', 'info');
    addLog('Subscribed to new block headers via WebSocket.', 'success');

    simulationInterval.current = setInterval(() => {
      setCurrentBlock(prevBlock => prevBlock + 1);
      
      setPools(prevPools => {
          // Simulate market volatility
          return prevPools.map(p => {
              const price = p.reserveB / p.reserveA;
              const newPrice = price * (1 + (Math.random() - 0.5) * 0.001); // +/- 0.05% change
              const newHistory = [...p.priceHistory.slice(1), newPrice];
              return { ...p, reserveB: newPrice * p.reserveA, priceHistory: newHistory };
          });
      });
      
    }, 3000);
  }, [addLog]);

  // Effect to handle logic within the live simulation loop
   useEffect(() => {
    if (status !== BotStatus.LIVE) return;

    addLog(`New block mined: ${currentBlock}. Scanning transactions...`, 'info');
    
    // Check for arbitrage opportunities
    const poolA = pools.find(p => p.dex === 'Uniswap v3')!;
    const poolB = pools.find(p => p.dex === 'SushiSwap')!;
    const priceA = poolA.reserveB / poolA.reserveA;
    const priceB = poolB.reserveB / poolB.reserveA;
    
    const priceDiff = Math.abs(priceA - priceB);
    const profitThreshold = 50; // $50 profit to trigger a trade

    if (priceDiff > profitThreshold / 1000) { // simplified check
        const fromPool = priceA < priceB ? poolA : poolB;
        const toPool = priceA < priceB ? poolB : poolA;
        addLog(`Arbitrage opportunity detected! ${fromPool.dex} -> ${toPool.dex}`, 'success');
        
        const loanAmount = 100000;
        const amountTokenA_bought = (fromPool.reserveA * loanAmount) / (fromPool.reserveB + loanAmount);
        const amountTokenB_sold = (toPool.reserveB * amountTokenA_bought) / (toPool.reserveA + amountTokenA_bought);
        const grossProfit = amountTokenB_sold - loanAmount;
        const gasFee = 40 + Math.random() * 20;
        const netProfit = grossProfit - gasFee - (grossProfit * 0.005) - (loanAmount * 0.0005);

        if (netProfit > 20) {
            const newTrade: Trade = {
                id: `0x${Math.random().toString(16).slice(2, 12)}`,
                timestamp: new Date(),
                tokenPair: 'WETH/USDC',
                dexs: [fromPool.dex, toPool.dex],
                amount: loanAmount,
                netProfit,
                status: 'Success',
                grossProfit, gasFee, slippage: (grossProfit*0.005), loanProviderFee: (loanAmount*0.0005),
                fromAddress: '0xBOT...dE4d', toAddress: '0xAAVE...v3',
                tokenFlow: [`Flash Loan: ${loanAmount.toFixed(2)} USDC`, `Swap on ${fromPool.dex}`, `Swap on ${toPool.dex}`, `Repay Loan`]
            };
            addLog(`Executing trade... Net Profit: $${netProfit.toFixed(2)}`, 'success');
            setTrades(prev => [newTrade, ...prev.slice(0, 99)]);
            setTotalProfit(prev => prev + netProfit);
            setProfitData(prev => [...prev.slice(-99), {name: currentBlock.toString().slice(-4), profit: prev.reduce((acc, p) => acc + p.profit, 0) + netProfit}])
        } else {
             addLog(`Opportunity not profitable enough after fees. Skipping.`, 'warning');
        }
    }
  }, [currentBlock, status, pools, addLog]);

  const runBacktest = useCallback(() => {
    setStatus(BotStatus.BACKTESTING);
    setTrades([]);
    setProfitData([]);
    setTotalProfit(0);
    setConsoleLogs([]);
    
    const steps = [
        () => addLog('Starting backtest...', 'info'),
        () => addLog('Acquiring historical data for WETH/USDC (1-month period)...', 'info'),
        () => new Promise(resolve => setTimeout(resolve, 1000)),
        () => addLog('Processing 1,250,480 historical ticks...', 'info'),
        () => new Promise(resolve => setTimeout(resolve, 1500)),
        () => addLog('Simulating 1,842 potential arbitrage opportunities...', 'info'),
        () => new Promise(resolve => setTimeout(resolve, 1000)),
        () => addLog('Calculating performance metrics...', 'info'),
        () => new Promise(resolve => setTimeout(resolve, 500)),
        () => {
            addLog('Backtest complete. View checklist for validation criteria.', 'success');
            setStatus(BotStatus.STOPPED);
        },
    ];

     steps.reduce((p, step) => p.then(() => {
        if (typeof step === 'function') step();
        return Promise.resolve();
    }), Promise.resolve());

  }, [addLog]);

  const handleTradeClick = useCallback((trade: Trade) => {
    setSelectedTrade(trade);
    setIsModalOpen(true);
  }, []);

  const successfulTrades = trades.filter(t => t.status === 'Success').length;
  const winRate = trades.length > 0 ? (successfulTrades / trades.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background text-text-primary p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-8xl mx-auto">
        <Header status={status} />
        
        <main className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard icon="profit" title="Total Profit (Live)" value={`$${totalProfit.toFixed(2)}`} isProfit={totalProfit >= 0} />
            <StatCard icon="trades" title="Trades Executed (Live)" value={successfulTrades.toString()} />
            <StatCard icon="winrate" title="Win Rate (Live)" value={`${winRate.toFixed(1)}%`} />
            <StatCard icon="block" title="Current Block" value={currentBlock.toLocaleString()} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Controls & Status */}
            <div className="lg:col-span-1">
              <DashboardPanel 
                status={status}
                onStartLive={runLiveSimulation}
                onStopLive={stopSimulation}
                onRunBacktest={runBacktest}
                currentBlock={currentBlock}
              />
            </div>
            
            {/* Right Column: Data & Logs */}
            <div className="lg:col-span-2 space-y-8">
              <LogTabs 
                consoleLogs={consoleLogs} 
                trades={trades} 
                onTradeClick={handleTradeClick}
              />
              <InfoTabs pools={pools} />
            </div>
          </div>
        </main>
        <TransactionDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} trade={selectedTrade} />
      </div>
    </div>
  );
};

export default App;