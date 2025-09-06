import React, { useState, useCallback } from 'react';
import { getMarketAnalysis } from '../services/geminiService';
import Spinner from './Spinner';

const MarketAnalysis: React.FC = () => {
  const [analysis, setAnalysis] = useState<string>('Click the button to get the latest market analysis from Gemini AI.');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchAnalysis = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMarketAnalysis();
      setAnalysis(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setAnalysis('Failed to load market analysis.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div>
      <div className="p-1 text-sm text-text-secondary leading-relaxed min-h-[10rem]">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : (
          <p className={error ? 'text-red-accent' : ''}>
            {analysis}
          </p>
        )}
      </div>
      <button
        onClick={handleFetchAnalysis}
        disabled={isLoading}
        className="w-full mt-4 flex items-center justify-center py-2 px-4 text-sm font-semibold rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background bg-blue-accent hover:bg-blue-accent/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white focus:ring-blue-accent/80"
      >
        {isLoading ? 'Analyzing...' : 'Get AI Analysis'}
      </button>
    </div>
  );
};

export default MarketAnalysis;