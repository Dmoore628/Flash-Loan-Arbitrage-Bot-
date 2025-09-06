
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ProfitData } from '../types';

interface ProfitChartProps {
  data: ProfitData[];
}

const ProfitChart: React.FC<ProfitChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
        <XAxis dataKey="name" tick={{ fill: '#8b949e', fontSize: 12 }} stroke="#30363d" />
        <YAxis tick={{ fill: '#8b949e', fontSize: 12 }} stroke="#30363d" domain={['auto', 'auto']} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(22, 27, 34, 0.8)',
            borderColor: '#30363d',
            color: '#c9d1d9',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: '#8b949e' }}
        />
        <Area type="monotone" dataKey="profit" stroke="#22c55e" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ProfitChart;
