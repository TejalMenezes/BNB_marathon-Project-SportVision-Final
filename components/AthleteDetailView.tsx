import React, { useState, useMemo } from 'react';
// FIX: Import SensorData type to use it for typing.
import { Athlete, RehabEntry, RehabStatus, SensorData } from '../types';
import { useSportVisionData } from '../hooks/useSportVisionData';
import { generateAthleteSummary } from '../services/geminiService';
import StatCard from './StatCard';
import LoadChart from './charts/LoadChart';
import OutputChart from './charts/OutputChart';
import { PowerIcon, JumpIcon, RecoveryIcon } from '../constants';
import Spinner from './ui/Spinner';

interface AthleteDetailViewProps {
  athlete: Athlete;
}

const statusColors: Record<RehabStatus, string> = {
  [RehabStatus.Improving]: 'bg-green-500/20 text-green-400',
  [RehabStatus.Static]: 'bg-yellow-500/20 text-yellow-400',
  [RehabStatus.Regressed]: 'bg-red-500/20 text-red-400',
};

const RehabTable: React.FC<{ data: RehabEntry[] }> = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead className="text-xs text-gray-400 uppercase bg-brand-gray/50">
        <tr>
          <th className="px-4 py-3">Date</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3">Notes</th>
          <th className="px-4 py-3">Restrictions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry, index) => (
          <tr key={index} className="border-b border-brand-gray">
            <td className="px-4 py-3">{entry.date}</td>
            <td className="px-4 py-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[entry.status]}`}>
                {entry.status}
              </span>
            </td>
            <td className="px-4 py-3">{entry.notes}</td>
            <td className="px-4 py-3">{entry.restrictions}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AthleteDetailView: React.FC<AthleteDetailViewProps> = ({ athlete }) => {
  const { getLoadDataForAthlete, getRehabDataForAthlete, getSensorDataForAthlete } = useSportVisionData();
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string>('');
  
  const loadData = useMemo(() => getLoadDataForAthlete(athlete.id), [athlete.id, getLoadDataForAthlete]);
  const rehabData = useMemo(() => getRehabDataForAthlete(athlete.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [athlete.id, getRehabDataForAthlete]);
  const sensorData = useMemo(() => getSensorDataForAthlete(athlete.id), [athlete.id, getSensorDataForAthlete]);
  
  // FIX: Explicitly type latestSensorData as Partial<SensorData> to avoid type errors when sensorData is empty.
  const latestSensorData: Partial<SensorData> = sensorData[sensorData.length - 1] || {};

  const handleGenerateSummary = async () => {
    setIsLoadingSummary(true);
    setSummaryError('');
    setAiSummary('');
    try {
      const summary = await generateAthleteSummary(athlete, loadData, rehabData, sensorData);
      setAiSummary(summary);
    } catch (error) {
      if(error instanceof Error) {
        setSummaryError(error.message);
      } else {
        setSummaryError("An unknown error occurred.");
      }
    } finally {
      setIsLoadingSummary(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <img src={athlete.avatarUrl} alt={athlete.name} className="h-20 w-20 rounded-full" />
        <div>
          <h1 className="text-3xl font-bold text-white">{athlete.name}</h1>
          <p className="text-brand-light-gray">{athlete.position}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Peak Power (Last Session)" value={`${latestSensorData.peakPower || 'N/A'}W`} icon={<PowerIcon />} />
        <StatCard title="Jump Height (Last Session)" value={`${latestSensorData.jumpHeight || 'N/A'}cm`} icon={<JumpIcon />} />
        <StatCard title="Recovery Score (Today)" value={`${latestSensorData.recoveryScore || 'N/A'}/100`} icon={<RecoveryIcon />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-brand-gray p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Training Load (Last 14 Days)</h2>
          <LoadChart data={loadData.slice(-14)} />
        </div>
        <div className="bg-brand-gray p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Sensor Output (Last 14 Days)</h2>
          <OutputChart data={sensorData.slice(-14)} />
        </div>
      </div>

      <div className="bg-brand-gray p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">AI Performance Summary (Gemini)</h2>
        <button 
          onClick={handleGenerateSummary}
          disabled={isLoadingSummary}
          className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoadingSummary && <Spinner />}
          {isLoadingSummary ? 'Generating...' : 'Generate Insights'}
        </button>
        {summaryError && <p className="mt-4 text-red-400">{summaryError}</p>}
        {aiSummary && (
          <div className="mt-4 prose prose-invert prose-sm max-w-none text-brand-text">
            {aiSummary.split('\n').map((line, index) => {
              if (line.startsWith('* ')) {
                return <p key={index} className="ml-4 before:content-['•'] before:mr-2">{line.substring(2)}</p>;
              }
              return <p key={index}>{line}</p>;
            })}
          </div>
        )}
      </div>

      <div className="bg-brand-gray p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Rehab Status</h2>
        {rehabData.length > 0 ? <RehabTable data={rehabData} /> : <p className="text-brand-light-gray">No rehab entries for this athlete.</p>}
      </div>
    </div>
  );
};

export default AthleteDetailView;
