import DashboardTab from './DashboardTab';
import LogTab from './LogTab';
import TrendsTab from './TrendsTab';
import ImpactTab from './ImpactTab';
import { useStore } from '../store/useStore';

interface ActiveViewProps {
  activeTab: 'Home' | 'Log' | 'Trends' | 'Impact';
  setActiveTab: (tab: 'Home' | 'Log' | 'Trends' | 'Impact') => void;
  handleCompleteDailyMission: () => void;
}

export default function ActiveView({ activeTab, setActiveTab, handleCompleteDailyMission }: ActiveViewProps) {
  const {
    totalSaved,
    currentFootprint,
    footprintGoal,
    setFootprintGoal,
    loggedActivities,
    achievements,
    dailyMissionCompleted,
    logActivity,
    unlockSolar
  } = useStore();

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
      return <LogTab onLogActivity={logActivity} />;
    case 'Trends':
      return <TrendsTab loggedActivities={loggedActivities} />;
    case 'Impact':
      return (
        <ImpactTab
          totalSaved={totalSaved}
          achievements={achievements}
          onUnlockSolar={unlockSolar}
        />
      );
    default:
      return null;
  }
}
