import { LoggedActivity, Achievement } from './types';

export const INITIAL_REF_DATE = new Date('2026-06-08T14:38:49Z');

export const INITIAL_LOGGED_ACTIVITIES: LoggedActivity[] = [
  {
    id: 'act-1',
    category: 'Transport',
    name: 'Commute by Bike',
    saved: 0.8,
    unit: 'km',
    value: 2.66,
    timestamp: new Date(INITIAL_REF_DATE.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
    dateStr: 'Today',
  },
  {
    id: 'act-2',
    category: 'Food',
    name: 'Local Grocery Shop',
    saved: 0.3,
    unit: 'purchase',
    value: 1,
    timestamp: new Date(INITIAL_REF_DATE.getTime() - 24 * 60 * 60 * 1000), // Yesterday
    dateStr: 'Yesterday',
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    name: 'Tree Planter',
    description: 'Offset 50kg via reforestation',
    savedText: 'Offset 50kg via reforestation',
    level: 3,
    locked: false,
    iconType: 'tree',
  },
  {
    id: 'ach-2',
    name: 'Bus Commuter',
    description: '20 rides this month',
    savedText: '20 rides this month',
    level: 5,
    locked: false,
    iconType: 'bus',
  },
  {
    id: 'ach-3',
    name: 'Green Gourmet',
    description: '15 plant-based meals this month',
    savedText: '15 plant-based meals',
    level: 2,
    progressPercentage: 75,
    locked: false,
    iconType: 'gourmet',
  },
  {
    id: 'ach-4',
    name: 'Solar Starter',
    description: 'Switch to renewable energy',
    savedText: 'Switch to renewables',
    level: 1,
    locked: true,
    iconType: 'solar',
  },
];

export interface CarbonActionSpec {
  name: string;
  category: 'Transport' | 'Food' | 'Energy';
  savedPerUnit: number;
  unit: string;
  icon: string;
}

export const CARBON_ACTIONS: CarbonActionSpec[] = [
  {
    name: 'Walking',
    category: 'Transport',
    savedPerUnit: 0.4,
    unit: 'km',
    icon: 'Footprints',
  },
  {
    name: 'Biking',
    category: 'Transport',
    savedPerUnit: 0.3,
    unit: 'km',
    icon: 'Bike',
  },
  {
    name: 'Plant-based Meal',
    category: 'Food',
    savedPerUnit: 2.1,
    unit: 'meal',
    icon: 'Leaf',
  },
  {
    name: 'Dairy Alternative',
    category: 'Food',
    savedPerUnit: 0.8,
    unit: 'serving',
    icon: 'Droplet',
  },
  {
    name: 'Unnecessary Lights',
    category: 'Energy',
    savedPerUnit: 0.1,
    unit: 'hour',
    icon: 'Lightbulb',
  },
  {
    name: 'Cold Wash Cycle',
    category: 'Energy',
    savedPerUnit: 0.5,
    unit: 'load',
    icon: 'Snowflake',
  },
];

export const MONTHLY_TREND_DATA = [
  { month: 'Jan', footprint: 172, saved: 8 },
  { month: 'Feb', footprint: 165, saved: 15 },
  { month: 'Mar', footprint: 158, saved: 22 },
  { month: 'Apr', footprint: 150, saved: 30 },
  { month: 'May', footprint: 145, saved: 35 },
  { month: 'Jun', footprint: 140, saved: 40 },
];

export const YEARLY_TREND_DATA = [
  { month: '2021', footprint: 2100, saved: 120 },
  { month: '2022', footprint: 1950, saved: 270 },
  { month: '2023', footprint: 1820, saved: 400 },
  { month: '2024', footprint: 1680, saved: 540 },
  { month: '2025', footprint: 1520, saved: 700 },
  { month: '2026', footprint: 1400, saved: 820 },
];
