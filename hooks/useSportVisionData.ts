
import { useState, useEffect } from 'react';
import { Athlete, LoadData, RehabEntry, SensorData, RehabStatus } from '../types';

const MOCK_ATHLETES: Athlete[] = [
  { id: '1', name: 'Alex Johnson', position: 'Forward', avatarUrl: 'https://picsum.photos/id/1005/100/100' },
  { id: '2', name: 'Maria Garcia', position: 'Midfielder', avatarUrl: 'https://picsum.photos/id/1027/100/100' },
  { id: '3', name: 'Sam Chen', position: 'Defender', avatarUrl: 'https://picsum.photos/id/1011/100/100' },
  { id: '4', name: 'Priya Patel', position: 'Goalkeeper', avatarUrl: 'https://picsum.photos/id/42/100/100' },
];

const generateMockData = () => {
  const loads: LoadData[] = [];
  const rehabs: RehabEntry[] = [];
  const sensors: SensorData[] = [];
  const today = new Date();

  MOCK_ATHLETES.forEach(athlete => {
    for (let i = 14; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Load Data
      loads.push({
        athleteId: athlete.id,
        date: dateString,
        load: Math.floor(Math.random() * (700 - 300 + 1)) + 300,
      });

      // Sensor Data
      sensors.push({
        athleteId: athlete.id,
        date: dateString,
        peakPower: Math.floor(Math.random() * (4500 - 3800 + 1)) + 3800,
        jumpHeight: Math.floor(Math.random() * (65 - 45 + 1)) + 45,
        recoveryScore: Math.floor(Math.random() * (95 - 60 + 1)) + 60,
      });
    }

    // Rehab Data (less frequent)
    if (athlete.id === '2') { // Maria Garcia has a rehab history
        rehabs.push({
            athleteId: '2',
            date: new Date(new Date().setDate(today.getDate() - 10)).toISOString().split('T')[0],
            notes: 'Light ACL strain, progressing well with physio.',
            restrictions: 'No contact drills.',
            status: RehabStatus.Improving,
        }, {
            athleteId: '2',
            date: new Date(new Date().setDate(today.getDate() - 5)).toISOString().split('T')[0],
            notes: 'Increased mobility in knee joint.',
            restrictions: 'Limited lateral movement.',
            status: RehabStatus.Improving,
        }, {
            athleteId: '2',
            date: new Date(new Date().setDate(today.getDate() - 1)).toISOString().split('T')[0],
            notes: 'Slight swelling after session, icing.',
            restrictions: 'Monitor load, reduce intensity.',
            status: RehabStatus.Static,
        });
    }
  });

  return { loads, rehabs, sensors };
};

const { loads, rehabs, sensors } = generateMockData();

export const useSportVisionData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Simulate API fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getLoadDataForAthlete = (athleteId: string) => loads.filter(l => l.athleteId === athleteId);
  const getRehabDataForAthlete = (athleteId: string) => rehabs.filter(r => r.athleteId === athleteId);
  const getSensorDataForAthlete = (athleteId: string) => sensors.filter(s => s.athleteId === athleteId);
  const getAllLoadData = () => loads;

  return {
    loading,
    error,
    athletes: MOCK_ATHLETES,
    getLoadDataForAthlete,
    getRehabDataForAthlete,
    getSensorDataForAthlete,
    getAllLoadData
  };
};
