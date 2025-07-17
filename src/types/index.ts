export interface User {
  id: string;
  email: string;
  name: string;
}

export type TimesheetStatus = 'COMPLETED' | 'INCOMPLETE' | 'MISSING';

export interface TimesheetEntry {
  id: string;
  weekNumber: number;
  date: string;
  status: TimesheetStatus;
  totalHours?: number;
}

export interface TimesheetTask {
  id: string;
  date: string;
  description: string;
  duration: number; // Changed from string to number for calculations
  project: string;
}

export interface AuthResponse {
  token: string;
  user: User;
} 