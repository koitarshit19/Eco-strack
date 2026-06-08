import { 
  CheckCircle, 
  Bike, 
  Footprints, 
  Utensils, 
  Droplet, 
  Lightbulb, 
  Zap,
  ShoppingBag, 
  Sparkles,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { LoggedActivity } from '../types';

interface DashboardTabProps {
  currentFootprint: number;
  footprintGoal: number;
  loggedActivities: LoggedActivity[];
  dailyMissionCompleted: boolean;
  onCompleteDailyMission: () => void;
  onNavigateToLog: () => void;
  onNavigateToTab: (tab: 'Home' | 'Log' | 'Trends' | 'Impact') => void;
}

export default function DashboardTab({
  currentFootprint,
  footprintGoal,
  loggedActivities,
  dailyMissionCompleted,
  onCompleteDailyMission,
  onNavigateToLog,
  onNavigateToTab
}: DashboardTabProps) {
  // Calculate circular meter values
  const radius = 90;
  const strokeWidth = 10; 
  const circumference = 2 * Math.PI * radius;
  
  // Progress ratio (clamped between 0 and 1)
  const ratio = Math.min(Math.max(currentFootprint / footprintGoal, 0), 1);
  const strokeDashoffset = circumference * (1 - ratio);

  // Return corresponding Lucide icon
  const getActivityIcon = (name: string, category: string) => {
    const isName = (term: string) => name.toLowerCase().includes(term);
    if (isName('bike') || isName('biking')) return <Bike className="w-5 h-5" />;
    if (isName('walk')) return <Footprints className="w-5 h-5" />;
    if (isName('meal') || isName('plant')) return <Utensils className="w-5 h-5" />;
    if (isName('dairy') || isName('milk') || isName('alternative')) return <Droplet className="w-5 h-5" />;
    if (isName('light') || isName('lamp')) return <Lightbulb className="w-5 h-5" />;
    if (isName('grocery') || isName('shop')) return <ShoppingBag className="w-5 h-5" />;
    return <Zap className="w-5 h-5" />;
  };

  const getCategoryThemeColor = (category: string) => {
    switch (category) {
      case 'Transport': return 'text-secondary bg-secondary-container/20 border border-secondary-container';
      case 'Food': return 'text-primary bg-primary-container/20 border border-primary-container';
      case 'Energy': return 'text-tertiary bg-tertiary-container/25 border border-tertiary-container';
      default: return 'text-on-surface bg-surface-container';
    }
  };

  return (
    <div className="space-y-10 animate-[fadeIn_0.5s_ease-out]">
      {/* Welcome Header */}
      <section className="space-y-2">
        <span className="text-xs tracking-wider font-bold text-primary uppercase block">
          Your Eco Dashboard
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-on-background tracking-tight">
          Hello, Nature Guardian
        </h2>
        <p className="text-base text-on-surface-variant max-w-2xl font-normal leading-relaxed">
          Your small steps are shaping a greener landscape. Below is an overview of your climate milestones and habitat metrics for this month.
        </p>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Central Carbon Meter (Hero Card) */}
        <div className="lg:col-span-8 bg-surface border border-outline-variant/65 rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl min-h-[440px]">
          <div className="absolute top-6 left-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Emission Budget Tracker
          </div>

          <div className="absolute top-6 right-6">
            <span className="text-primary px-3 py-1 text-xs tracking-wider font-semibold uppercase bg-primary-container rounded-full">
              September Progress
            </span>
          </div>

          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mt-6">
            {/* SVG Progress Circle */}
            <svg className="absolute w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className="stroke-surface-container"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className="stroke-primary transition-all duration-700 ease-out"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            {/* Inner text content */}
            <div className="z-10 bg-background p-6 rounded-full w-[170px] h-[170px] md:w-[210px] md:h-[210px] flex flex-col justify-center items-center shadow-inner">
              <span className="text-5xl md:text-6xl font-extrabold text-primary tracking-tighter leading-none">
                {currentFootprint.toFixed(1)}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/80 mt-2">
                kg CO2e
              </span>
            </div>
          </div>

          <div className="mt-8 z-10 space-y-2">
            <p className="text-xs tracking-wider uppercase font-bold text-on-surface-variant">
              CURRENT BUDGET LIMIT: <span className="text-primary">{footprintGoal} kg</span>
            </p>
            <div className="flex gap-1 justify-center items-center">
              <div 
                className="h-1.5 bg-primary rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100 * ratio, 100)}px` }}
              />
              <div 
                className="h-1.5 bg-surface-container rounded-full transition-all duration-500"
                style={{ width: `${Math.max(100 * (1 - ratio), 0)}px` }}
              />
            </div>
          </div>
        </div>

        {/* Side Cards Column - Quick Insight and Daily Mission */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Quick Insight Card */}
          <div className="bg-surface border border-outline-variant/65 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-lg min-h-[190px]">
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-baseline border-b border-outline-variant/20 pb-2">
                <span className="text-xs tracking-wider font-bold text-on-surface-variant/80 uppercase">
                  Metric Insight
                </span>
                <span className="text-xs font-bold text-primary">01</span>
              </div>
              <div>
                <p className="text-sm text-on-surface font-normal leading-relaxed">
                  Your household food segment is currently <span className="font-semibold text-primary">15% more efficient</span> than previous weeks. Your high-fiber logs contributed heavily.
                </p>
              </div>
            </div>
            
            <div className="text-xs tracking-wider uppercase font-bold text-primary pt-3 mt-4 border-t border-outline-variant/10">
              Active Diet Index
            </div>
          </div>

          {/* Daily Mission Card */}
          <div className="bg-gradient-to-br from-primary to-secondary text-on-primary rounded-3xl p-6 relative overflow-hidden group flex flex-col justify-between flex-1 min-h-[220px] shadow-lg">
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-start border-b border-white/20 pb-3">
                <span className="text-xs uppercase font-bold tracking-widest text-white">
                  DAILY MISSION
                </span>
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-bold leading-tight text-white">
                  Go Meatless Today
                </h3>
                <p className="text-xs opacity-90 mt-2 leading-relaxed font-normal text-white">
                  Choosing plant-based options at dinner offsets approximately 2.5kg of carbon emissions instantly.
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-6">
              <button
                disabled={dailyMissionCompleted}
                onClick={onCompleteDailyMission}
                className={`w-full py-3 rounded-2xl font-bold text-xs tracking-widest uppercase transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                  dailyMissionCompleted
                    ? 'bg-white/20 text-white/60 border border-white/10 cursor-not-allowed'
                    : 'bg-white text-primary hover:bg-white/95'
                }`}
              >
                {dailyMissionCompleted ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-white" />
                    Completed (+2.5kg)
                  </>
                ) : (
                  'Complete Task'
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Row: Habit Activity and Community summary */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        
        {/* Recent Activity Card */}
        <div className="lg:col-span-8 bg-surface border border-outline-variant/65 rounded-3xl p-6 shadow-md">
          <div className="flex justify-between items-baseline mb-6 border-b border-outline-variant/20 pb-3">
            <h3 className="text-lg font-bold tracking-tight text-on-surface">
              Recent Logged Activities
            </h3>
            <button
              onClick={onNavigateToLog}
              className="text-primary text-xs tracking-wider uppercase font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              View Full Log <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {loggedActivities.length === 0 ? (
              <div className="text-center py-12 bg-background/50 rounded-2xl border border-dashed border-outline-variant/60">
                <p className="text-on-surface-variant/70 text-sm">No recorded changes for today.</p>
                <button
                  onClick={onNavigateToLog}
                  className="mt-4 bg-primary text-on-primary text-xs tracking-wider uppercase font-bold px-5 py-2.5 rounded-full hover:opacity-90 active:scale-95 duration-100"
                >
                  Create Log entry
                </button>
              </div>
            ) : (
              loggedActivities.slice(0, 3).map((act) => (
                <div
                  key={act.id}
                  className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 transition-all hover:shadow-sm"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center p-2.5 ${getCategoryThemeColor(act.category)}`}>
                    {getActivityIcon(act.name, act.category)}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-on-surface">
                      {act.name}
                    </p>
                    <p className="text-xs text-on-surface-variant/80 mt-0.5">
                      {act.value.toFixed(1)} {act.unit} • {act.dateStr}
                    </p>
                  </div>
                  <span className="text-primary font-bold text-sm">
                    -{act.saved.toFixed(1)}kg CO2
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Community summary Card */}
        <div className="lg:col-span-4 bg-surface border border-outline-variant/65 rounded-3xl p-6 shadow-md flex flex-col justify-between min-h-[300px]">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold tracking-tight text-on-surface">
                Discussion Board
              </h3>
            </div>
            <p className="text-sm text-on-surface-variant font-normal leading-relaxed">
              You are globally positioned in the top <span className="font-semibold text-primary">12% of local micro-savers</span>. Keep striving!
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-outline-variant/10">
            <div className="flex -space-x-1.5 overflow-hidden items-center">
              <img
                className="w-8 h-8 rounded-full border border-surface object-cover"
                alt="Community avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyqlJfOV8SkodlFc65mSIy7_qUG1cOCO-yYe8bbAD0v5OUszJXETm4vXKV24-WcBVxEzu1Wjp7nDvNBEqfKmvT-cYjnPplqsHQ5vclEeWKvDXijI8LtO681x3o9vWGw-7zoG9jgIkpErkO9pFDvJ-nQ8RzK2V-QstgANuFJSb9FXfZZocYGKGgdIhy0TsEfN450dbxMwIR9sSK6hWqenttcQvz8F6AcnFrJxTKBoDeoyqhyZxc_71IWFSHDwcsMPQb-nSKHFQxjpTD"
              />
              <img
                className="w-8 h-8 rounded-full border border-surface object-cover"
                alt="Community avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZiYvjeH9bPvqpiFdznETLaVvcE_U3TPiWUvIeGIuq9q02f8qWwhGwcdkPVlBkXuFVNBMs4TO7dhGgwrb4kQoylKSRMacApZ9qc4MtaHr8aEH13Ds2oeNJ6bm4fd_JWkneMWo8TTdcOZMtJk8FGnfSwTVaF6RtInXk7Hz075UCANNZVXkvZ2K1W00iuM4KyFEBwGO5roQPBOMZJSk9D5f-X17Z93kptBrRsU8VhQCs3rxs-0_3xDpgZmdbQ37pOFiAUdSfvpqlFgKh"
              />
              <img
                className="w-8 h-8 rounded-full border border-surface object-cover"
                alt="Community avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCU6CXF_mBJZO_rXnbt7OmhPr8QGEBTBXmv2CFeXo_VcUAwVw51ixv_xvo6U7zAW0ptDgVVCLchMrS_vmG0PwQfZWUAV-Aa9i4Zs_zIfwsl63TIWJlTYeQgGtFj1BXciaan9suem9w9jCA0VgOcOPZ5OigViNONxTKVhQKPz1Zu9rLMZ5GfyS-NyAeriLkiMbmM7yCZ19aTlFg6VCbOrejsqv3e7YyXdOT5CE-1umqXGQHZ5RrMuC-cmGlkfTMvCKh35MqkOZnXEIKE"
              />
              <div className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center text-[10px] font-bold text-on-surface">
                +42
              </div>
            </div>
            
            <button
              onClick={() => onNavigateToTab('Impact')}
              className="mt-4 text-[11px] tracking-wider uppercase font-bold text-primary flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              Discuss with Curation group <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </section>
    </div>
  );
}
