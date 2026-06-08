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

  // State with LocalStorage fallbacks
  const [totalSaved, setTotalSaved] = useState<number>(() => {
    const saved = localStorage.getItem('ecotrack-total-saved');
    return saved ? parseFloat(saved) : 240.0;
  });

  const [currentFootprint, setCurrentFootprint] = useState<number>(() => {
    const saved = localStorage.getItem('ecotrack-footprint');
    return saved ? parseFloat(saved) : 140.0;
  });

  const [footprintGoal, setFootprintGoal] = useState<number>(() => {
    const saved = localStorage.getItem('ecotrack-footprint-goal');
    return saved ? parseFloat(saved) : 180.0;
  });

  const [loggedActivities, setLoggedActivities] = useState<LoggedActivity[]>(() => {
    const saved = localStorage.getItem('ecotrack-activities');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
      } catch (e) {
        return INITIAL_LOGGED_ACTIVITIES;
      }
    }
    return INITIAL_LOGGED_ACTIVITIES;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('ecotrack-achievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  const [dailyMissionCompleted, setDailyMissionCompleted] = useState<boolean>(() => {
    const saved = localStorage.getItem('ecotrack-daily-mission');
    return saved === 'true';
  });

  const [toasts, setToasts] = useState<Array<{ id: string; actionName: string; kgSaved: number }>>([]);

  // Theme support class sync
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('ecotrack-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('ecotrack-theme', 'light');
    }
  }, [darkMode]);

  // Persist states in LocalStorage
  useEffect(() => {
    localStorage.setItem('ecotrack-total-saved', totalSaved.toString());
    localStorage.setItem('ecotrack-footprint', currentFootprint.toString());
    localStorage.setItem('ecotrack-footprint-goal', footprintGoal.toString());
    localStorage.setItem('ecotrack-activities', JSON.stringify(loggedActivities));
    localStorage.setItem('ecotrack-achievements', JSON.stringify(achievements));
    localStorage.setItem('ecotrack-daily-mission', dailyMissionCompleted ? 'true' : 'false');
  }, [totalSaved, currentFootprint, footprintGoal, loggedActivities, achievements, dailyMissionCompleted]);

  // Toast notifier trigger
  const makeToast = (actionName: string, kgSaved: number) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, actionName, kgSaved }]);
    
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
    const newActivity: LoggedActivity = {
      id: `act-${Date.now()}`,
      category,
      name,
      value,
      saved,
      unit: getUnitForName(name),
      timestamp: new Date(),
      dateStr: 'Today'
    };

    setLoggedActivities(prev => [newActivity, ...prev]);
    setTotalSaved(prev => prev + saved);
    setCurrentFootprint(prev => Math.max(0, prev - saved));
    makeToast(name, saved);

    // Dynamic Leveling Up calculation for Green Gourmet / Achievements
    if (name === 'Plant-based Meal') {
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
