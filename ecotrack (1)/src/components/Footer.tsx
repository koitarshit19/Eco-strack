import { useStore } from '../store/useStore';
import { INITIAL_LOGGED_ACTIVITIES, INITIAL_ACHIEVEMENTS } from '../data';

export default function Footer() {
  const handleResetProgress = () => {
    if (window.confirm("Do you want to reset your logged activities back to the draft template base values?")) {
      useStore.setState({
        totalSaved: 240.0,
        currentFootprint: 140.0,
        footprintGoal: 180.0,
        loggedActivities: INITIAL_LOGGED_ACTIVITIES,
        achievements: INITIAL_ACHIEVEMENTS,
        dailyMissionCompleted: false,
        toasts: []
      });
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
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
  );
}
