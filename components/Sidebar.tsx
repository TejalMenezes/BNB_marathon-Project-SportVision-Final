
import React from 'react';
import { Athlete } from '../types';
import { LogoIcon, DashboardIcon, AthleteIcon } from '../constants';

interface SidebarProps {
  athletes: Athlete[];
  selectedAthleteId: string | null;
  onSelectAthlete: (id: string) => void;
  onShowDashboard: () => void;
  loading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ athletes, selectedAthleteId, onSelectAthlete, onShowDashboard, loading }) => {
  
  const NavLink: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
  }> = ({ onClick, isActive, children }) => (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-brand-accent text-white'
          : 'text-gray-300 hover:bg-brand-light-gray hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  return (
    <aside className="hidden md:flex flex-col w-64 bg-brand-gray p-4 space-y-6">
      <div className="flex items-center gap-3 px-2">
        <LogoIcon className="h-8 w-8 text-brand-accent" />
        <h1 className="text-2xl font-bold text-white">SportVision</h1>
      </div>
      <nav className="flex-1 space-y-2">
        <NavLink onClick={onShowDashboard} isActive={!selectedAthleteId}>
          <DashboardIcon className="h-5 w-5 mr-3" />
          Dashboard
        </NavLink>
        <div className="pt-4">
          <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Athletes</h2>
          <div className="mt-2 space-y-1">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center p-2.5 animate-pulse">
                  <div className="h-8 w-8 rounded-full bg-brand-light-gray"></div>
                  <div className="ml-3 h-4 w-32 rounded bg-brand-light-gray"></div>
                </div>
              ))
            ) : (
              athletes.map((athlete) => (
                <button
                  key={athlete.id}
                  onClick={() => onSelectAthlete(athlete.id)}
                  className={`flex items-center w-full p-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    selectedAthleteId === athlete.id
                      ? 'bg-brand-accent text-white'
                      : 'text-gray-300 hover:bg-brand-light-gray hover:text-white'
                  }`}
                >
                  <img src={athlete.avatarUrl} alt={athlete.name} className="h-8 w-8 rounded-full" />
                  <span className="ml-3">{athlete.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
