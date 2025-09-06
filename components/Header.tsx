import React from 'react';
import { BotStatus } from '../types';

interface HeaderProps {
  status: BotStatus;
}

const getStatusStyle = (status: BotStatus) => {
  switch (status) {
    case BotStatus.LIVE:
      return {
        bgColor: 'bg-green-accent/10',
        dotColor: 'bg-green-accent',
        textColor: 'text-green-accent',
        text: 'LIVE'
      };
    case BotStatus.BACKTESTING:
      return {
        bgColor: 'bg-yellow-500/10',
        dotColor: 'bg-yellow-400',
        textColor: 'text-yellow-400',
        text: 'BACKTESTING'
      };
    case BotStatus.STOPPED:
      return {
        bgColor: 'bg-red-accent/10',
        dotColor: 'bg-red-accent',
        textColor: 'text-red-accent',
        text: 'STOPPED'
      };
    default:
      return {
        bgColor: 'bg-gray-500/10',
        dotColor: 'bg-gray-500',
        textColor: 'text-text-secondary',
        text: 'UNKNOWN'
      };
  }
}

const StatusIndicator: React.FC<{ status: BotStatus }> = ({ status }) => {
  const { bgColor, dotColor, textColor, text } = getStatusStyle(status);
  const isLive = status === BotStatus.LIVE;

  return (
    <div className={`flex items-center space-x-2 rounded-full px-3 py-1.5 ${bgColor} border border-border`}>
      <span className="relative flex h-2 w-2">
        {isLive && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-75`}></span>}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`}></span>
      </span>
      <span className={`text-xs font-bold tracking-wider uppercase ${textColor}`}>{text}</span>
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ status }) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="bg-blue-accent/10 p-2 rounded-lg border border-blue-accent/20">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Autonomous Arbitrage</h1>
      </div>
      <div className="mt-4 md:mt-0">
        <StatusIndicator status={status} />
      </div>
    </header>
  );
};

export default Header;