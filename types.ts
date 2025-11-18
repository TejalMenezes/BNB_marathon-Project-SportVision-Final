
export interface Athlete {
  id: string;
  name: string;
  position: string;
  avatarUrl: string;
}

export interface LoadData {
  athleteId: string;
  date: string; // YYYY-MM-DD
  load: number;
}

export enum RehabStatus {
  Improving = 'Improving',
  Static = 'Static',
  Regressed = 'Regressed',
}

export interface RehabEntry {
  athleteId: string;
  date: string; // YYYY-MM-DD
  notes: string;
  restrictions: string;
  status: RehabStatus;
}

export interface SensorData {
  athleteId: string;
  date: string; // YYYY-MM-DD
  peakPower: number; // Watts
  jumpHeight: number; // cm
  recoveryScore: number; // 0-100
}
