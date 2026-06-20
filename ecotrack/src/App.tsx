import { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardTab from './components/DashboardTab';
import LogTab from './components/LogTab';
import TrendsTab from './components/TrendsTab';
import ImpactTab from './components/ImpactTab';
import BottomNavBar from './components/BottomNavBar';
import { LoggedActivity, Achievement, ActivityCategory } from './types';
import { 
  INITIAL_LOGGED_ACTIVITIES, 
  INITIAL_ACHIEVEMENTS, 
  INITIAL_REF_DATE 
} from './data';
import ToastNotification from './components/ToastNotification';

export default function App() {
  const [activeTab, setActiveTab] = useState<'Home' | 'Log' | 'Trends' | 'Impact'>('Home');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('ecotrack-theme');
    if (saved) return saved === 'dark';
    return false; // Default to Light theme as requested
  });

  // State with LocalStorage fallbacks and comprehensive secure verification
  const [totalSaved, setTotalSaved] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ecotrack-total-saved');
      if (saved) {
        const parsed = parseFloat(saved);
        if (isFinite(parsed) && parsed >= 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Secure load error: totalSaved", e);
    }
    return 240.0;
  });

  const [currentFootprint, setCurrentFootprint] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ecotrack-footprint');
      if (saved) {
        const parsed = parseFloat(saved);
        if (isFinite(parsed) && parsed >= 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Secure load error: currentFootprint", e);
    }
    return 140.0;
  });

  const [footprintGoal, setFootprintGoal] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ecotrack-footprint-goal');
      if (saved) {
        const parsed = parseFloat(saved);
        if (isFinite(parsed) && parsed >= 50 && parsed <= 500) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Secure load error: footprintGoal", e);
    }
    return 180.0;
  });

  const [loggedActivities, setLoggedActivities] = useState<LoggedActivity[]>(() => {
    try {
      const saved = localStorage.getItem('ecotrack-activities');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed
            .filter((item): item is LoggedActivity => 
              item && 
              typeof item === 'object' && 
              typeof item.id === 'string' && 
              typeof item.name === 'string'
            )
            .map((item: any) => ({
              id: item.id,
              category: typeof item.category === 'string' && ['Transport', 'Food', 'Energy'].includes(item.category) ? item.category : 'Food',
              name: String(item.name || '').substring(0, 80),
              value: typeof item.value === 'number' && isFinite(item.value) && item.value > 0 ? item.value : 1,
              saved: typeof item.saved === 'number' && isFinite(item.saved) && item.saved >= 0 ? item.saved : 0,
              unit: typeof item.unit === 'string' ? item.unit : 'unit',
              timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
              dateStr: typeof item.dateStr === 'string' ? item.dateStr : 'Today'
            }));
        }
      }
    } catch (e) {
      console.error("Secure load error: loggedActivities", e);
    }
    return INITIAL_LOGGED_ACTIVITIES;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem('ecotrack-achievements');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed
            .filter((item): item is Achievement => 
              item && 
              typeof item === 'object' && 
              typeof item.id === 'string' && 
              typeof item.title === 'string'
            )
            .map((ach: any) => ({
              id: ach.id,
              title: String(ach.title || '').substring(0, 80),
              category: String(ach.category || '').substring(0, 80),
              description: String(ach.description || '').substring(0, 200),
              progressPercentage: typeof ach.progressPercentage === 'number' && isFinite(ach.progressPercentage) ? Math.max(0, Math.min(100, ach.progressPercentage)) : 0,
              level: typeof ach.level === 'number' && isFinite(ach.level) ? Math.max(0, ach.level) : 0,
              locked: typeof ach.locked === 'boolean' ? ach.locked : true,
              iconType: typeof ach.iconType === 'string' ? ach.iconType : 'award'
            }));
        }
      }
    } catch (e) {
      console.error("Secure load error: achievements", e);
    }
    return INITIAL_ACHIEVEMENTS;
  });

  const [dailyMissionCompleted, setDailyMissionCompleted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('ecotrack-daily-mission');
      return saved === 'true';
    } catch (e) {
      return false;
    }
  });

  const [toasts, setToasts] = useState<Array<{ id: string; actionName: string; kgSaved: number }>>([]);

  // Theme support class sync
  useEffect(() => {
    try {
      const root = window.document.documentElement;
      if (darkMode) {
        root.classList.add('dark');
        localStorage.setItem('ecotrack-theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('ecotrack-theme', 'light');
      }
    } catch (e) {
      console.error("Theme toggle persistence failure:", e);
    }
  }, [darkMode]);

  // Persist states in LocalStorage safely
  useEffect(() => {
    try {
      localStorage.setItem('ecotrack-total-saved', totalSaved.toString());
      localStorage.setItem('ecotrack-footprint', currentFootprint.toString());
      localStorage.setItem('ecotrack-footprint-goal', footprintGoal.toString());
      localStorage.setItem('ecotrack-activities', JSON.stringify(loggedActivities));
      localStorage.setItem('ecotrack-achievements', JSON.stringify(achievements));
      localStorage.setItem('ecotrack-daily-mission', dailyMissionCompleted ? 'true' : 'false');
    } catch (e) {
      console.warn("Storage writing quota limit or exception warning:", e);
    }
  }, [totalSaved, currentFootprint, footprintGoal, loggedActivities, achievements, dailyMissionCompleted]);

  // Toast notifier trigger
  const makeToast = (actionName: string, kgSaved: number) => {
    const id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const sanitizedActionName = String(actionName || '').substring(0, 100);
    const sanitizedSaved = (typeof kgSaved === 'number' && isFinite(kgSaved)) ? kgSaved : 0;
    
    setToasts(prev => [...prev, { id, actionName: sanitizedActionName, kgSaved: sanitizedSaved }]);
    
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Activity logger callback handler
  const handleLogActivity = (category: ActivityCategory, name: string, value: number, saved: number) => {
    // 🛡️ Security Audit & Validation: Ensure absolute alignment and type safety
    const validCategories: ActivityCategory[] = ['Transport', 'Food', 'Energy'];
    const sanitizedCategory = validCategories.includes(category) ? category : 'Food';
    const sanitizedName = String(name || '').substring(0, 80);
    
    // Numbers check to ensure positive, non-infinite, safe values
    const sanitizedValue = (typeof value === 'number' && isFinite(value) && value > 0)
      ? Math.min(value, 1000)
      : 1;
    const sanitizedSaved = (typeof saved === 'number' && isFinite(saved) && saved >= 0)
      ? Math.min(saved, 500)
      : 0;

    const newActivity: LoggedActivity = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      category: sanitizedCategory,
      name: sanitizedName,
      value: sanitizedValue,
      saved: sanitizedSaved,
      unit: getUnitForName(sanitizedName),
      timestamp: new Date(),
      dateStr: 'Today'
    };

    setLoggedActivities(prev => [newActivity, ...prev]);
    setTotalSaved(prev => {
      const next = prev + sanitizedSaved;
      return isFinite(next) ? next : prev;
    });
    setCurrentFootprint(prev => {
      const next = Math.max(0, prev - sanitizedSaved);
      return isFinite(next) ? next : prev;
    });
    makeToast(sanitizedName, sanitizedSaved);

    // Dynamic Leveling Up calculation for Green Gourmet / Achievements
    if (sanitizedName === 'Plant-based Meal') {
      setAchievements(prev => {
        return prev.map(ach => {
          if (ach.id === 'ach-3') { // Green Gourmet
            const currentProgress = ach.progressPercentage || 0;
            const nextProgress = Math.min(100, currentProgress + 12);
            const nextLvl = nextProgress >= 100 ? ach.level + 1 : ach.level;
            return {
              ...ach,
              level: nextLvl,
              progressPercentage: nextProgress >= 100 ? 0 : nextProgress
            };
          }
          if (ach.id === 'ach-1') { // Tree Planter level increase
            return { ...ach, level: ach.level + 1 };
          }
          return ach;
        });
      });
    }
  };

  const getUnitForName = (name: string) => {
    if (name === 'Walking' || name === 'Biking') return 'km';
    if (name === 'Plant-based Meal') return 'meal';
    if (name === 'Dairy Alternative') return 'serving';
    if (name === 'Unnecessary Lights') return 'hour';
    if (name === 'Cold Wash Cycle') return 'load';
    return 'unit';
  };

  // Daily Mission completion callback
  const handleCompleteDailyMission = () => {
    if (dailyMissionCompleted) return;
    setDailyMissionCompleted(true);
    
    // Log as a food activity saving 2.5kg CO2
    handleLogActivity('Food', 'Plant-based Meal (Daily)', 1, 2.5);
  };

  // Switch Solar renewables unlock
  const handleUnlockSolar = () => {
    setAchievements(prev => {
      return prev.map(ach => {
        if (ach.id === 'ach-4') { // Solar Starter
          return {
            ...ach,
            locked: false,
            level: 1,
            description: 'You switched to 100% renewable energy grids!'
          };
        }
        return ach;
      });
    });
    // Subtract footprint & boost carbon status saved
    setTotalSaved(prev => prev + 25);
    setCurrentFootprint(prev => Math.max(0, prev - 25));
    makeToast('Solar Starter Renewables Switch', 25.0);
  };

  // Reset progress logic to default mock heights
  const handleResetProgress = () => {
    if (window.confirm("Do you want to reset your logged activities back to the draft template base values?")) {
      setTotalSaved(240.0);
      setCurrentFootprint(140.0);
      setFootprintGoal(180.0);
      setLoggedActivities(INITIAL_LOGGED_ACTIVITIES);
      setAchievements(INITIAL_ACHIEVEMENTS);
      setDailyMissionCompleted(false);
      setToasts([]);
      localStorage.clear();
      window.location.reload();
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Home':
        return (
          <DashboardTab
            currentFootprint={currentFootprint}
            footprintGoal={footprintGoal}
            onUpdateFootprintGoal={setFootprintGoal}
            loggedActivities={loggedActivities}
            dailyMissionCompleted={dailyMissionCompleted}
            onCompleteDailyMission={handleCompleteDailyMission}
            onNavigateToLog={() => setActiveTab('Log')}
            onNavigateToTab={setActiveTab}
          />
        );
      case 'Log':
        return <LogTab onLogActivity={handleLogActivity} />;
      case 'Trends':
        return <TrendsTab loggedActivities={loggedActivities} />;
      case 'Impact':
        return (
          <ImpactTab
            totalSaved={totalSaved}
            achievements={achievements}
            onUnlockSolar={handleUnlockSolar}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-background text-on-background font-sans min-h-screen transition-colors duration-300 pb-24 md:pb-6 selection:bg-primary-container selection:text-on-primary-container">
      {/* Top sticky app header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Container Canvas */}
      <main className="pt-24 max-w-[1280px] mx-auto px-6 md:px-12 min-h-[calc(100vh-64px)] pb-12 flex flex-col justify-between">
        <div className="flex-1">
          {renderActiveTab()}
        </div>

        {/* Quiet human credit line / reset debug helper footer */}
        <footer className="mt-20 pt-8 border-t border-outline-variant/10 text-center flex flex-col sm:flex-row justify-between items-center text-xs text-on-surface-variant/40 gap-4">
          <p>© 2026 EcoTrack. Protecting our environment, one small step at a time.</p>
          <button
            onClick={handleResetProgress}
            className="px-4 py-1.5 border border-outline-variant/20 hover:border-outline-variant/50 text-on-surface-variant/50 rounded-full hover:text-on-surface transition-all cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            title="Reset tracker back to initial mock mockup values"
          >
            Reset App Progress
          </button>
        </footer>
      </main>

      {/* Dynamic Slide up Toast Notifications */}
      <div 
        className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-40px)] max-w-sm pointer-events-none flex flex-col gap-2"
        id="toast-container"
      >
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            actionName={toast.actionName}
            kgSaved={toast.kgSaved}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </div>

      {/* Bottom stick bar for mobile screen sizes */}
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
