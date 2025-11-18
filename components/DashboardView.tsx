
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Athlete } from '../types';
import { useSportVisionData } from '../hooks/useSportVisionData';

interface DashboardViewProps {
  athletes: Athlete[];
  onSelectAthlete: (id: string) => void;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const DashboardView: React.FC<DashboardViewProps> = ({ athletes, onSelectAthlete }) => {
    const { getAllLoadData } = useSportVisionData();
    const allLoadData = getAllLoadData();

    // Aggregate load data for the last 7 days
    const last7DaysLoad = athletes.map(athlete => {
        const athleteLoad = allLoadData
            .filter(ld => ld.athleteId === athlete.id)
            .slice(-7)
            .reduce((acc, curr) => acc + curr.load, 0);
        return { name: athlete.name, totalLoad: athleteLoad, id: athlete.id };
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Coach Dashboard</h1>
                <p className="mt-1 text-brand-light-gray">A summary of your team's performance over the last 7 days.</p>
            </div>

            <div className="bg-brand-gray p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-4">7-Day Training Load Per Athlete</h2>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <BarChart
                            data={last7DaysLoad}
                            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                            <XAxis dataKey="name" stroke="#E5E7EB" />
                            <YAxis stroke="#E5E7EB" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }}
                                labelStyle={{ color: '#E5E7EB' }}
                            />
                            <Legend />
                            <Bar dataKey="totalLoad" name="Total Load (Arbitrary Units)" fill="#3B82F6" >
                                {last7DaysLoad.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {athletes.map(athlete => (
                    <div
                        key={athlete.id}
                        className="bg-brand-gray p-5 rounded-lg shadow-lg hover:bg-brand-light-gray cursor-pointer transition-colors"
                        onClick={() => onSelectAthlete(athlete.id)}
                    >
                        <div className="flex items-center">
                            <img src={athlete.avatarUrl} alt={athlete.name} className="h-12 w-12 rounded-full" />
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-white">{athlete.name}</h3>
                                <p className="text-sm text-brand-light-gray">{athlete.position}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardView;
