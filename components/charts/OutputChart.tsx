
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SensorData } from '../../types';

interface OutputChartProps {
  data: SensorData[];
}

const OutputChart: React.FC<OutputChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
          <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} stroke="#E5E7EB" fontSize={12} />
          <YAxis yAxisId="left" orientation="left" stroke="#10B981" fontSize={12} />
          <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" fontSize={12} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }}
            labelStyle={{ color: '#E5E7EB' }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="peakPower" fill="#10B981" name="Peak Power (W)" />
          <Bar yAxisId="right" dataKey="jumpHeight" fill="#F59E0B" name="Jump Height (cm)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OutputChart;
