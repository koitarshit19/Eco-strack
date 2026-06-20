export type ActivityCategory = 'Transport' | 'Food' | 'Energy';

export interface LoggedActivity {
  id: string;
  category: ActivityCategory;
  name: string;
  saved: number; // in kg CO2
  unit: string;
  value: number; // raw value logged (e.g. 2 km, 1 meal)
  timestamp: Date;
  dateStr: string; // e.g. "2026-06-08" or "Today"
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  savedText: string;
  level: number;
  maxLevel?: number;
  progressPercentage?: number; // e.g. 75 for 75%
  locked: boolean;
  iconType: 'tree' | 'bus' | 'gourmet' | 'solar';
}

export type TrendPeriod = 'Monthly' | 'Yearly';
