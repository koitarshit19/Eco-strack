import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';
import { storedDataSchema, loggedActivitySchema, achievementSchema, activityCategorySchema } from './schema';
import DOMPurify from 'dompurify';
import { INITIAL_ACHIEVEMENTS, INITIAL_LOGGED_ACTIVITIES } from '../data';
import { ActivityCategory, LoggedActivity, Achievement } from '../types';

interface StoreState {
  totalSaved: number;
  currentFootprint: number;
  footprintGoal: number;
  loggedActivities: LoggedActivity[];
  achievements: Achievement[];
  dailyMissionCompleted: boolean;
  toasts: Array<{ id: string; actionName: string; kgSaved: number }>;
  darkMode: boolean;

  setDarkMode: (value: boolean) => void;
  setFootprintGoal: (goal: number) => void;
  removeToast: (id: string) => void;
  makeToast: (actionName: string, kgSaved: number) => void;
  logActivity: (category: ActivityCategory, name: string, value: number, saved: number) => void;
  unlockSolar: () => void;
}

const getUnitForName = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('walk') || lower.includes('bike') || lower.includes('carpool') || lower.includes('transit')) return 'km';
  if (lower.includes('meal') || lower.includes('diet') || lower.includes('dairy')) return 'meals';
  if (lower.includes('light') || lower.includes('air') || lower.includes('heat') || lower.includes('solar')) return 'hrs';
  if (lower.includes('recycle') || lower.includes('waste') || lower.includes('compost')) return 'lbs';
  return 'unit';
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      totalSaved: 240.0,
      currentFootprint: 140.0,
      footprintGoal: 180.0,
      loggedActivities: INITIAL_LOGGED_ACTIVITIES,
      achievements: INITIAL_ACHIEVEMENTS,
      dailyMissionCompleted: false,
      toasts: [],
      darkMode: false,

      setDarkMode: (value) => set({ darkMode: value }),
      setFootprintGoal: (goal) => set({ footprintGoal: goal }),
      removeToast: (id) => set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) })),
      makeToast: (actionName, kgSaved) => {
        const id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        set((state) => ({
          toasts: [...state.toasts, { id, actionName, kgSaved }]
        }));
        setTimeout(() => {
          get().removeToast(id);
        }, 4000);
      },

      logActivity: (category, name, value, saved) => {
        // Sanitize names
        const sanitizedName = DOMPurify.sanitize(name).substring(0, 80);
        const parsedCategory = activityCategorySchema.safeParse(category);
        const safeCategory = parsedCategory.success ? parsedCategory.data : 'Food';
        
        const sanitizedValue = (typeof value === 'number' && isFinite(value) && value > 0) ? Math.min(value, 1000) : 1;
        const sanitizedSaved = (typeof saved === 'number' && isFinite(saved) && saved >= 0) ? Math.min(saved, 500) : 0;

        const newActivity: LoggedActivity = {
          id: `act-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          category: safeCategory as ActivityCategory,
          name: sanitizedName,
          value: sanitizedValue,
          saved: sanitizedSaved,
          unit: getUnitForName(sanitizedName),
          timestamp: new Date(),
          dateStr: 'Today'
        };

        set((state) => {
          const nextSaved = state.totalSaved + sanitizedSaved;
          const nextFootprint = Math.max(0, state.currentFootprint - sanitizedSaved);
          
          let achievements = [...state.achievements];
          if (sanitizedName === 'Plant-based Meal') {
            achievements = achievements.map(ach => {
              if (ach.id === 'ach-3') {
                const newProgress = Math.min(100, ach.progressPercentage + 20);
                return { ...ach, progressPercentage: newProgress, level: Math.floor(newProgress / 25) };
              }
              return ach;
            });
          }

          return {
            loggedActivities: [newActivity, ...state.loggedActivities],
            totalSaved: nextSaved,
            currentFootprint: nextFootprint,
            achievements
          };
        });

        get().makeToast(sanitizedName, sanitizedSaved);
      },

      unlockSolar: () => {
        set((state) => ({
          achievements: state.achievements.map(ach => ach.id === 'ach-1' ? { ...ach, locked: false } : ach)
        }));
      }
    }),
    {
      name: 'ecotrack-storage',
      merge: (persistedState: any, currentState: StoreState) => {
        try {
          // Attempt validation on hydration
          const parsed = storedDataSchema.safeParse(persistedState);
          if (parsed.success) {
            return {
              ...currentState,
              ...parsed.data,
              darkMode: typeof persistedState.darkMode === 'boolean' ? persistedState.darkMode : currentState.darkMode
            };
          }
        } catch (e) {
          console.error("Hydration validation failed:", e);
        }
        return currentState;
      }
    }
  )
);
