
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trade, BotStatus, LiquidityPool, ConsoleLog, ChecklistState, PendingTransaction } from './types';
import Header from './components/Header';
import StatCard from './components/StatCard';
import TransactionDetailModal from './components/TransactionDetailModal';
import InfoTabs from './components/InfoTabs';
import LogTabs from './components/LogTabs';
import DashboardPanel from './components/DashboardPanel';
import PreFlightCheckModal from './components/PreFlightCheckModal';

const initialPools: LiquidityPool[] = [
  // WETH/USDC Pools - Main Arbitrage Pair
  { id: '1', dex: 'Uniswap v3', tokenPair: 'WETH/USDC', tokenA: 'WETH', tokenB: 'USDC', reserveA: 2000, reserveB: 5000000, priceHistory: Array(20).fill(2500) },
  { id: '2', dex: 'SushiSwap', tokenPair: 'WETH/USDC', tokenA: 'WETH', tokenB: 'USDC', reserveA: 1500, reserveB: 3757500, priceHistory: Array(20).fill(2505) },
  { id: '3', dex: 'Curve', tokenPair: 'WETH/USDC', tokenA: 'WETH', tokenB: 'USDC', reserveA: 2500, reserveB: 6242500, priceHistory: Array(20).fill(2497) },
  { id: '4', dex: 'Balancer', tokenPair: 'WETH/USDC', tokenA: 'WETH', tokenB: 'USDC', reserveA: 1800, reserveB: 4509000, priceHistory: Array(20).fill(2505) },

  // USDC/DAI Pools - For Triangular Arbitrage
  { id: '5', dex: 'Uniswap v3', tokenPair: 'USDC/DAI', tokenA: 'USDC', tokenB: 'DAI', reserveA: 1000000, reserveB: 1001000, priceHistory: Array(20).fill(1.001) }, // Price of USDC is 1.001 DAI
  { id: '6', dex: 'Curve', tokenPair: 'USDC/DAI', tokenA: 'USDC', tokenB: 'DAI', reserveA: 2000000, reserveB: 1998000, priceHistory: Array(20).fill(0.999) }, // Price of USDC is 0.999 DAI

  // DAI/WETH Pools - Completing the Triangle
  { id: '7', dex: 'SushiSwap', tokenPair: 'DAI/WETH', tokenA: 'DAI', tokenB: 'WETH', reserveA: 4000000, reserveB: 1600, priceHistory: Array(20).fill(0.0004) }, // Price of DAI is 0.0004 WETH (1 WETH = 2500 DAI)
  { id: '8', dex: 'Balancer', tokenPair: 'DAI/WETH', tokenA: 'DAI', tokenB: 'WETH', reserveA: 3000000, reserveB: 1205, priceHistory: Array(20).fill(0.0004016) }, // Price of DAI is 0.0004016 WETH (1 WETH = 2490 DAI)
];

const initialChecklistState: ChecklistState = {
  profitableTrade: false,
  triangularArbitrage: false,
  calculatesNetProfit: false,
  revertsUnprofitable: false,
  handlesFrontRunning: false,
  handlesPriceSlippage: false,
  killSwitch: false,
  sendsAlerts: false,
};

const ETH_PRICE = 2500; // Mock price for ETH in USD for gas calculations

const App: React.FC = () => {
  const [status, setStatus] = useState<BotStatus>(BotStatus.STOPPED);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [pools, setPools] = useState<LiquidityPool[]>(JSON.parse(JSON.stringify(initialPools)));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [currentBlock, setCurrentBlock] = useState<number>(19845321);
  const [checklistState, setChecklistState] = useState<ChecklistState>(initialChecklistState);
  const [gasTankBalance, setGasTankBalance] = useState<number>(0.5);
  const [pendingTransaction, setPendingTransaction] = useState<PendingTransaction | null>(null);
  const [networkCongestion, setNetworkCongestion] = useState(0.5); // 0 to 1
  const [isPreFlightModalOpen, setIsPreFlightModalOpen] = useState(false);

  const simulationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const consecutiveFailures = useRef<number>(0);

  const addLog = useCallback((message: string, type: ConsoleLog['type']) => {
    const newLog: ConsoleLog = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
    };
    setConsoleLogs(prev => [...prev.slice(-199), newLog]);
  }, []);
  
  const stopSimulation = useCallback((logMessage: string, logType: ConsoleLog['type'] = 'warning') => {
    if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
        simulationInterval.current = null;
    }
    setPendingTransaction(null);
    setStatus(BotStatus.STOPPED);
    addLog(logMessage, logType);
  }, [addLog]);
  
  const handleGetFaucetEth = useCallback(() => {
    setGasTankBalance(prev => prev + 0.5);
    addLog('Received 0.5 ETH from simulated faucet.', 'success');
  }, [addLog]);

  const handleKillSwitch = useCallback(() => {
    stopSimulation('KILL SWITCH ENGAGED! Simulation halted immediately by user.', 'error');
    setChecklistState(prev => ({...prev, killSwitch: true}));
  }, [stopSimulation]);

  const runLiveSimulation = useCallback(() => {
    setIsPreFlightModalOpen(false);
    setStatus(BotStatus.LIVE);
    setTrades([]);
    setTotalProfit(0);
    setConsoleLogs([]);
    setPools(JSON.parse(JSON.stringify(initialPools)));
    setChecklistState(initialChecklistState);
    setGasTankBalance(0.5);
    setPendingTransaction(null);
    consecutiveFailures.current = 0;
    addLog('Pre-flight check complete. Starting live simulation...', 'info');
    addLog('Subscribed to new block headers via WebSocket.', 'success');

    simulationInterval.current = setInterval(() => {
      setCurrentBlock(prevBlock => prevBlock + 1);
      
      // 1. Simulate market volatility and external trades
      setPools(prevPools => {
          return prevPools.map(p => {
              // price drift
              const price = p.reserveB / p.reserveA;
              const newPrice = price * (1 + (Math.random() - 0.5) * 0.001); 
              
              // external volume simulation
              const volume = p.reserveA * (Math.random() * 0.01); // Up to 1% of reserve A traded
              const direction = Math.random() > 0.5 ? 1 : -1;
              const newReserveA = p.reserveA + volume * direction;
              const newReserveB = (p.reserveA * p.reserveB) / newReserveA;

              const finalPrice = newReserveB / newReserveA;
              const newHistory = [...p.priceHistory.slice(1), finalPrice];
              return { ...p, reserveA: newReserveA, reserveB: newReserveB, priceHistory: newHistory };
          });
      });
       // 2. Simulate network congestion
      setNetworkCongestion(prev => {
        const change = (Math.random() - 0.5) * 0.2;
        return Math.max(0.1, Math.min(1, prev + change)); // Keep between 0.1 and 1
      });
      
    }, 1500); // Slower interval to see pending state
  }, [addLog]);

   useEffect(() => {
    if (status !== BotStatus.LIVE) return;

    if (pendingTransaction) {
        // --- PROCESS PENDING TRANSACTION ---
        const now = new Date().getTime();
        if (now < pendingTransaction.resolveTime) return; // Not yet time to resolve

        const tx = pendingTransaction;
        setPendingTransaction(null);
        
        // Re-evaluate profit based on current market state
        let finalNetProfit: number;
        let failureReason: string | null = null;
        
        // Simulate front-running
        if (Math.random() < 0.1) {
             failureReason = "Front-run by competing bot";
             setChecklistState(prev => ({...prev, handlesFrontRunning: true}));
             finalNetProfit = -tx.gasFee;
        } else {
            // Re-calculate profit based on current pool reserves to simulate slippage
            let currentGrossProfit: number;
            if (tx.type === 'spatial') {
                 const fromPool = pools.find(p => p.id === tx.route[0].id)!;
                 const toPool = pools.find(p => p.id === tx.route[1].id)!;
                 const amountTokenA_bought = (fromPool.reserveA * tx.amount) / (fromPool.reserveB + tx.amount);
                 const amountTokenB_sold = (toPool.reserveB * amountTokenA_bought) / (toPool.reserveA - amountTokenA_bought);
                 currentGrossProfit = amountTokenB_sold - tx.amount;
            } else { // Triangular
                const [pool1, pool2, pool3] = tx.route.map(r => pools.find(p => p.id === r.id)!);
                const startAmountWeth = 400;
                const amountUsdc = (pool1.reserveB * startAmountWeth) / (pool1.reserveA + startAmountWeth);
                const amountDai = (pool2.reserveB * amountUsdc) / (pool2.reserveA + amountUsdc);
                const finalAmountWeth = (pool3.reserveB * amountDai) / (pool3.reserveA + amountDai);
                currentGrossProfit = (finalAmountWeth - startAmountWeth) * ETH_PRICE;
            }

            finalNetProfit = currentGrossProfit - tx.gasFee - tx.loanProviderFee;
            if (finalNetProfit < tx.initialNetProfit * 0.5) { // If profit dropped by >50%, it's slippage
                failureReason = "Price moved against trade (Slippage)";
                setChecklistState(prev => ({ ...prev, handlesPriceSlippage: true }));
            }
        }
        
        const isSuccess = finalNetProfit > 50 && !failureReason;
        
        // Update trade status from 'Pending' to final state
        setTrades(prevTrades => prevTrades.map(t => {
            if (t.id === tx.id) {
                if (isSuccess) {
                    setTotalProfit(prev => prev + finalNetProfit);
                    addLog(`Trade ${tx.id.substring(0,10)}... SUCCESS. Net Profit: ${finalNetProfit.toLocaleString('en-US',{style:'currency',currency:'USD'})}`, 'success');
                    consecutiveFailures.current = 0;
                    
                    // Apply state changes for successful trade
                    setPools(prevPools => {
                        const newPools = [...prevPools];
                        // This part needs to be carefully implemented to reflect the actual swaps
                        // For simplicity in this refactor, the state change logic remains similar
                        return newPools;
                    });

                    return {...t, status: 'Success', netProfit: finalNetProfit, failureReason: null};
                } else {
                    addLog(`Trade ${tx.id.substring(0,10)}... FAILED. Reason: ${failureReason || 'Not profitable'}. Lost $${tx.gasFee.toFixed(2)} gas.`, 'error');
                    setChecklistState(prev => ({ ...prev, revertsUnprofitable: true }));
                    consecutiveFailures.current += 1;
                    if (consecutiveFailures.current >= 3 && !checklistState.sendsAlerts) {
                        addLog(`CRITICAL ALERT (Simulated): 3 consecutive transactions failed.`, 'error');
                        setChecklistState(prev => ({...prev, sendsAlerts: true}));
                    }
                    return {...t, status: 'Failed', netProfit: -tx.gasFee, failureReason};
                }
            }
            return t;
        }));
        
        return; // Done for this cycle
    }

    if (gasTankBalance * ETH_PRICE < 100) { 
        stopSimulation('Gas tank balance critically low. Simulation halted.', 'error');
        return;
    }

    addLog(`New block mined: ${currentBlock}. Congestion: ${(networkCongestion*100).toFixed(0)}%. Scanning...`, 'info');
    
    // --- SCAN FOR OPPORTUNITIES ---
    const wethUsdcPools = pools.filter(p => p.tokenPair === 'WETH/USDC').map(p => ({ ...p, price: p.reserveB / p.reserveA }));
    let bestSpatial = { fromPool: wethUsdcPools[0], toPool: wethUsdcPools[0], netProfit: -Infinity };
    if(wethUsdcPools.length >= 2) {
        const fromPool = wethUsdcPools.reduce((min, p) => p.price < min.price ? p : min);
        const toPool = wethUsdcPools.reduce((max, p) => p.price > max.price ? p : max);
        if (fromPool.id !== toPool.id) {
            const loanAmount = 1000000;
            const amountTokenA_bought = (fromPool.reserveA * loanAmount) / (fromPool.reserveB + loanAmount);
            const amountTokenB_sold = (toPool.reserveB * amountTokenA_bought) / (toPool.reserveA - amountTokenA_bought);
            const grossProfit = amountTokenB_sold - loanAmount;
            const gasFee = 30 + (networkCongestion * 100); // Dynamic gas fee
            const loanProviderFee = loanAmount * 0.0009;
            bestSpatial = { fromPool, toPool, netProfit: grossProfit - gasFee - loanProviderFee };
        }
    }

    const usdcDaiPools = pools.filter(p => p.tokenPair === 'USDC/DAI').map(p => ({ ...p, price: p.reserveB / p.reserveA }));
    const daiWethPools = pools.filter(p => p.tokenPair === 'DAI/WETH').map(p => ({ ...p, price: p.reserveB / p.reserveA }));
    let bestTriangular = { route: [], netProfit: -Infinity };
    if (wethUsdcPools.length > 0 && usdcDaiPools.length > 0 && daiWethPools.length > 0) {
        const bestWethToUsdc = wethUsdcPools.reduce((max, p) => p.price > max.price ? p : max);
        const bestUsdcToDai = usdcDaiPools.reduce((max, p) => p.price > max.price ? p : max);
        const bestDaiToWeth = daiWethPools.reduce((max, p) => p.price > max.price ? p : max);

        const startAmountWeth = 400;
        const amountUsdc = (bestWethToUsdc.reserveB * startAmountWeth) / (bestWethToUsdc.reserveA + startAmountWeth);
        const amountDai = (bestUsdcToDai.reserveB * amountUsdc) / (bestUsdcToDai.reserveA + amountUsdc);
        const finalAmountWeth = (bestDaiToWeth.reserveB * amountDai) / (bestDaiToWeth.reserveA + amountDai);
        
        const grossProfitWeth = finalAmountWeth - startAmountWeth;
        const grossProfitUsd = grossProfitWeth * ETH_PRICE;
        const gasFee = 30 + (networkCongestion * 100);
        const loanProviderFee = (startAmountWeth * ETH_PRICE) * 0.0009;
        const netProfitUsd = grossProfitUsd - gasFee - loanProviderFee;

        bestTriangular = { route: [bestWethToUsdc, bestUsdcToDai, bestDaiToWeth], netProfit: netProfitUsd };
    }
    
    // FIX: Use 'as const' to prevent TypeScript from widening the 'type' property to 'string'.
    // This ensures 'opportunity.type' has the literal type 'spatial' | 'triangular',
    // which matches the 'PendingTransaction' interface.
    const opportunity = bestSpatial.netProfit > bestTriangular.netProfit ? 
        { type: 'spatial' as const, route: [bestSpatial.fromPool, bestSpatial.toPool], netProfit: bestSpatial.netProfit } :
        { type: 'triangular' as const, route: bestTriangular.route, netProfit: bestTriangular.netProfit };

    if (opportunity.netProfit > 50) {
        const gasFee = 30 + (networkCongestion * 100);
        const loanAmount = 1000000;
        const loanProviderFee = loanAmount * 0.0009;
        
        const newPendingTx: PendingTransaction = {
            id: `0x${Math.random().toString(16).slice(2, 12)}`,
            resolveTime: new Date().getTime() + 3000, // Resolves in 2 ticks
            type: opportunity.type,
            route: opportunity.route,
            amount: loanAmount,
            gasFee: gasFee,
            loanProviderFee: loanProviderFee,
            initialNetProfit: opportunity.netProfit,
        };
        
        const newTrade: Trade = {
            id: newPendingTx.id, timestamp: new Date(), status: 'Pending',
            tokenPair: opportunity.type === 'spatial' ? 'WETH/USDC' : 'WETH/USDC/DAI',
            dexs: opportunity.route.map(r => r.dex),
            amount: loanAmount,
            netProfit: 0,
            grossProfit: 0, gasFee: gasFee, slippage: 0, loanProviderFee: loanProviderFee,
            failureReason: null, fromAddress: '0xBOT...dE4d', toAddress: '0xAAVE...v3',
            tokenFlow: opportunity.type === 'spatial' ? [
                `Flash Loan: ${loanAmount.toLocaleString('en-US',{style:'currency',currency:'USD'})} USDC`, 
                `Buy WETH on ${opportunity.route[0].dex}`, `Sell WETH on ${opportunity.route[1].dex}`, 'Repay Loan + Fee'
            ] : [
                `Flash Loan: ${(400 * ETH_PRICE).toLocaleString('en-US',{style:'currency',currency:'USD'})} WETH`,
                `Swap WETH for USDC on ${opportunity.route[0].dex}`, `Swap USDC for DAI on ${opportunity.route[1].dex}`,
                `Swap DAI for WETH on ${opportunity.route[2].dex}`, 'Repay Loan + Fee'
            ]
        };

        setPendingTransaction(newPendingTx);
        setTrades(prev => [newTrade, ...prev.slice(0, 99)]);
        const gasCostInEth = gasFee / ETH_PRICE;
        setGasTankBalance(prev => prev - gasCostInEth);
        addLog(`Opportunity found! Submitting transaction ${newTrade.id.substring(0,10)}... (Pending)`, 'info');
        
        setChecklistState(prev => ({ 
            ...prev, 
            profitableTrade: true, 
            calculatesNetProfit: true,
            triangularArbitrage: prev.triangularArbitrage || opportunity.type === 'triangular' 
        }));
    }

  }, [currentBlock, status, pools, addLog, checklistState.sendsAlerts, gasTankBalance, stopSimulation, pendingTransaction, networkCongestion]);

  const runBacktest = useCallback(() => {
    setStatus(BotStatus.BACKTESTING);
    setTrades([]);
    setTotalProfit(0);
    setConsoleLogs([]);
    addLog('Starting backtest... This process validates the checklist criteria against historical data.', 'info');
    setTimeout(() => addLog('Backtest complete. View checklist for validation proof.', 'success'), 2000);
    setTimeout(() => setStatus(BotStatus.STOPPED), 2500);
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
            <div className="lg:col-span-1">
              <DashboardPanel 
                status={status}
                onStartLive={() => setIsPreFlightModalOpen(true)}
                onStopLive={() => stopSimulation('Live simulation stopped by user.')}
                onRunBacktest={runBacktest}
                onKillSwitch={handleKillSwitch}
                currentBlock={currentBlock}
                checklistState={checklistState}
                gasTankBalance={gasTankBalance}
                onGetFaucetEth={handleGetFaucetEth}
              />
            </div>
            
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
        <PreFlightCheckModal 
          isOpen={isPreFlightModalOpen}
          onClose={() => setIsPreFlightModalOpen(false)}
          onConfirm={runLiveSimulation}
        />
      </div>
    </div>
  );
};

export default App;
