
import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import AthleteDetailView from './components/AthleteDetailView';
import { useSportVisionData } from './hooks/useSportVisionData';
import { Athlete } from './types';
import { LogoIcon } from './constants';

const App: React.FC = () => {
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
  const { athletes, loading, error } = useSportVisionData();

  const handleSelectAthlete = useCallback((athleteId: string) => {
    setSelectedAthleteId(athleteId);
  }, []);

  const handleShowDashboard = useCallback(() => {
    setSelectedAthleteId(null);
  }, []);

  const selectedAthlete = athletes.find(a => a.id === selectedAthleteId);

  const renderContent = () => {
    if (loading) {
      return <div className="flex items-center justify-center h-full text-lg">Loading athlete data...</div>;
    }
    if (error) {
      return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
    }
    if (selectedAthleteId && selectedAthlete) {
      return <AthleteDetailView athlete={selectedAthlete} />;
    }
    return <DashboardView athletes={athletes} onSelectAthlete={handleSelectAthlete} />;
  };

  return (
    <div className="flex h-screen bg-brand-dark font-sans">
      <Sidebar 
        athletes={athletes}
        selectedAthleteId={selectedAthleteId}
        onSelectAthlete={handleSelectAthlete}
        onShowDashboard={handleShowDashboard}
        loading={loading}
      />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="flex items-center gap-3 mb-6 md:hidden">
          <LogoIcon className="h-8 w-8 text-brand-accent" />
          <h1 className="text-2xl font-bold text-white">SportVision</h1>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
