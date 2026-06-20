import { useState, useEffect } from 'react';
import Header from './components/Header';
import ActiveView from './components/ActiveView';
import BottomNavBar from './components/BottomNavBar';
import Footer from './components/Footer';
import Toaster from './components/Toaster';
import { useStore } from './store/useStore';

export default function App() {
  const [activeTab, setActiveTab] = useState<'Home' | 'Log' | 'Trends' | 'Impact'>('Home');
  const { darkMode, setDarkMode, dailyMissionCompleted, logActivity } = useStore();

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

  const handleCompleteDailyMission = () => {
    /* v8 ignore next */
    if (dailyMissionCompleted) return;
    useStore.setState({ dailyMissionCompleted: true });
    logActivity('Food', 'Plant-based Meal (Daily)', 1, 2.5);
  };

  return (
    <div className="bg-background text-on-background font-sans min-h-screen transition-colors duration-300 pb-24 md:pb-6 selection:bg-primary-container selection:text-on-primary-container">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <main className="pt-24 max-w-[1280px] mx-auto px-6 md:px-12 min-h-[calc(100vh-64px)] pb-12 flex flex-col justify-between">
        <div className="flex-1">
          <ActiveView 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            handleCompleteDailyMission={handleCompleteDailyMission} 
          />
        </div>
        <Footer />
      </main>
      <Toaster />
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}


