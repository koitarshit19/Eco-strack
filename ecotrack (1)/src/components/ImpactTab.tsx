import { useState } from 'react';
import { 
  Award, 
  Share2, 
  Eye, 
  Info, 
  TrendingDown, 
  Trees, 
  Bus, 
  Utensils, 
  Lock, 
  ExternalLink,
  Check,
  X
} from 'lucide-react';
import { Achievement, TrendPeriod } from '../types';
import { MONTHLY_TREND_DATA, YEARLY_TREND_DATA } from '../data';

interface ImpactTabProps {
  totalSaved: number;
  achievements: Achievement[];
  onUnlockSolar: () => void;
}

export default function ImpactTab({ totalSaved, achievements, onUnlockSolar }: ImpactTabProps) {
  const [trendPeriod, setTrendPeriod] = useState<TrendPeriod>('Monthly');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Share milestone modal state
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Carbon footprint details interactive modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const currentTrendData = trendPeriod === 'Monthly' ? MONTHLY_TREND_DATA : YEARLY_TREND_DATA;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`I've saved ${totalSaved.toFixed(1)}kg of CO2 using EcoTrack! Join me in shaping a greener future.`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getAchievementIcon = (type: string, locked: boolean) => {
    if (locked) return <Lock className="w-6 h-6 text-outline/60" />;
    switch (type) {
      case 'tree': return <Trees className="w-6 h-6 text-primary" />;
      case 'bus': return <Bus className="w-6 h-6 text-secondary" />;
      case 'gourmet': return <Utensils className="w-6 h-6 text-tertiary" />;
      case 'solar': return <Award className="w-6 h-6 text-primary" />;
      default: return <Award className="w-6 h-6 text-primary" />;
    }
  };

  const getAchievementBg = (type: string, locked: boolean) => {
    if (locked) return 'bg-surface-container-high border border-dashed border-outline-variant/30 opacity-60';
    switch (type) {
      case 'tree': return 'bg-primary-container/20 border border-primary/25';
      case 'bus': return 'bg-secondary-container/20 border border-secondary/25';
      case 'gourmet': return 'bg-tertiary-container/20 border border-tertiary/25';
      case 'solar': return 'bg-primary-container/30 border border-primary/30';
      default: return 'bg-primary-container/25 border border-primary/20';
    }
  };

  // Convert saved footprint back into trees
  const equivalentTrees = Math.floor(totalSaved / 24);

  return (
    <div className="space-y-12 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Hero Section / Total Saved */}
      <section className="flex flex-col md:flex-row gap-8 items-center bg-surface border border-outline-variant/65 p-8 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="z-10 flex-1 space-y-4">
          <span className="text-xs tracking-wider font-bold text-primary uppercase block">
            GLOBAL MILESTONE REPORT
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-on-surface leading-tight">
            You've offset {totalSaved.toFixed(0)} kg of carbon
          </h2>
          <p className="text-sm md:text-base text-on-surface font-normal leading-relaxed max-w-xl">
            This metric matches approximately {equivalentTrees} full-grown trees absorbing pollutants annually. Your active, conscious habits render an empirical, beneficial architecture.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="bg-primary text-on-primary hover:bg-primary/95 font-sans text-xs tracking-wider uppercase font-bold px-5 py-3 rounded-full cursor-pointer shadow-md active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none duration-150 flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" aria-hidden="true" /> Share Milestone
            </button>
            <button
              type="button"
              onClick={() => setShowDetailsModal(true)}
              className="bg-surface border border-outline-variant/50 text-on-surface hover:bg-surface-container-high font-sans text-xs tracking-wider uppercase font-bold px-5 py-3 rounded-full cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none duration-150 flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" aria-hidden="true" /> View Details
            </button>
          </div>
        </div>

        <div className="relative z-10 w-full md:w-1/3 aspect-square max-w-[220px] rounded-3xl overflow-hidden border border-outline-variant/35 flex items-center justify-center bg-surface-container shadow-md">
          <img
            alt="Trees growing in a sunny forest"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAt2_W-mkV1HDPzTOqii-LD0iZVud1N7WiItMx2ymYl32IYJfZdg5Nvb2_zNxwl17D-83lcPmyvjN3VkdLUxl-gfJrVVWWuc39YQekEHgYIZmFqK0wiKcrnhdMjyEHitSqlSBvRG5VGT4aKIF6SCXxgtJ75wx_2A7y9t6b7sdgMfF7ypZRXdyqKjHxNquK7nBrV8wIgegK1c23MtTRh-VmPC4bhSd4XjM2AgGYN5a4r7q-EurWj4dQQxjnOHSWw-7eWW40Nwgtj0AFV"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      </section>

      {/* Carbon Footprint Trend Chart Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/20 pb-3">
          <h3 className="text-2xl font-bold tracking-tight text-on-surface">
            Carbon Footprint Trend
          </h3>
          <div className="flex bg-surface-container rounded-full p-1 border border-outline-variant/15 self-start" role="group" aria-label="Select trend period">
            {(['Monthly', 'Yearly'] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setTrendPeriod(period)}
                aria-pressed={trendPeriod === period}
                aria-label={`View ${period} trends`}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer ${
                  trendPeriod === period
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface hover:text-primary'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-outline-variant/65 rounded-3xl p-6 shadow-md relative overflow-hidden">
          {/* Legend */}
          <div className="flex gap-4 mb-4 justify-end text-xs font-bold tracking-wider uppercase text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-primary/20 border border-outline-variant/30 rounded-sm" />
              Footprint Index (kg)
            </div>
            <div className="flex items-center gap-1.5 text-primary">
              <span className="w-3 h-0.5 bg-primary" />
              Cumulative Saved
            </div>
          </div>

          <div className="h-[260px] w-full relative flex flex-col justify-end pt-12 animate-[fadeIn_0.5s_ease-out]">
            <div className="absolute inset-x-0 bottom-12 top-0 flex items-end justify-between px-4 pb-1">
              {currentTrendData.map((data, idx) => {
                const maxVal = Math.max(...currentTrendData.map(d => d.footprint));
                const heightPercent = `${(data.footprint / maxVal) * 85}%`;
                const isHovered = hoveredIndex === idx;

                return (
                  <div
                    key={data.month}
                    className="flex-1 flex flex-col justify-end items-center h-full relative px-2 group cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Hover state Tooltip */}
                    <div 
                      className={`absolute -top-14 z-20 bg-on-surface text-surface text-xs font-normal px-3 py-2 rounded-xl shadow-lg border border-outline-variant/30 pointer-events-none transition-all duration-200 flex flex-col items-center min-w-[124px] ${
                        isHovered ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
                      }`}
                    >
                      <span className="font-bold tracking-wider">{data.month}</span>
                      <span className="mt-0.5 opacity-90">Footprint: {data.footprint}kg</span>
                      <span className="text-primary font-bold">Saved: {data.saved}kg</span>
                    </div>

                    {/* Bar chart block */}
                    <div
                      className={`w-10 rounded-t-xl transition-all duration-300 border border-outline-variant/20 ${
                        isHovered 
                          ? 'bg-primary/45 border-primary/60' 
                          : data.month === 'Jun' || data.month === '2026'
                            ? 'bg-primary border-primary' 
                            : 'bg-primary/25'
                      }`}
                      style={{ height: heightPercent }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Path SVG line drawing */}
            <svg 
              className="absolute inset-x-0 bottom-12 top-0 w-full h-[85%] overflow-visible pointer-events-none px-4"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--primary)" />
                </linearGradient>
              </defs>
              <path
                d="M 8 75 Q 26 65 42 50 T 74 30 T 92 10"
                fill="none"
                stroke="url(#lineGrad)"
                strokeLinecap="round"
                strokeWidth="3"
                className="transition-all duration-700"
              />
              <circle cx="8" cy="75" fill="var(--primary)" r="4" className="shadow-sm" />
              <circle cx="42" cy="50" fill="var(--primary)" r="4" className="shadow-sm" />
              <circle cx="74" cy="30" fill="var(--primary)" r="4" className="shadow-sm" />
              <circle cx="92" cy="10" fill="var(--primary)" r="5" className="animate-pulse shadow-md" />
            </svg>

            {/* Dynamic labels overlay */}
            <div className="flex justify-between items-center px-4 mt-2 border-t border-outline-variant/25 pt-3 h-10">
              {currentTrendData.map((data, idx) => (
                <span 
                  key={data.month} 
                  className={`text-xs tracking-wider font-semibold text-center flex-1 transition-all ${
                    data.month === 'Jun' || data.month === '2026' || hoveredIndex === idx
                      ? 'text-primary font-bold scale-105'
                      : 'text-on-surface'
                  }`}
                >
                  {data.month}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Your Achievements Grid Section */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-outline-variant/20 pb-3">
          <h3 className="text-2xl font-bold tracking-tight text-on-surface">
            Honorary Milestones
          </h3>
          <button 
            onClick={() => setShowDetailsModal(true)}
            className="text-xs font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
          >
            Details <Info className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-6 rounded-3xl flex flex-col items-center text-center justify-between min-h-[240px] transition-all duration-300 shadow-md ${
                ach.locked 
                  ? 'bg-surface-container-high/40 border border-dashed border-outline-variant/30 opacity-60'
                  : 'bg-surface border border-outline-variant/30 hover:bg-surface-container-low hover:shadow-lg'
              }`}
            >
              {/* Icon round wrapper */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${getAchievementBg(ach.iconType, ach.locked)}`}>
                {getAchievementIcon(ach.iconType, ach.locked)}
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-on-surface">{ach.name}</h4>
                <p className="text-xs text-on-surface max-w-[140px] leading-relaxed font-normal">
                  {ach.locked ? 'Switch and activate limit' : ach.description}
                </p>
              </div>

              {/* LVL chip or unlock button or progress bar */}
              <div className="mt-4 w-full flex justify-center">
                {ach.locked ? (
                  <button
                    type="button"
                    onClick={onUnlockSolar}
                    className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-full shadow-md cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                    aria-label={`Unlock milestone ${ach.name}`}
                  >
                    Unlock Unit
                  </button>
                ) : ach.progressPercentage !== undefined ? (
                  <div className="w-full space-y-1.5 px-1.5">
                    <div className="flex justify-between items-center text-[10px] tracking-wide font-bold text-on-surface-variant">
                      <span>PROGRESS</span>
                      <span>{ach.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-secondary transition-all duration-500 rounded-full"
                        style={{ width: `${ach.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <span className="px-3 py-1 bg-surface border border-outline-variant/30 text-on-surface text-xs font-bold rounded-full">
                    LEVEL {ach.level}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof / Recent Activity Bento Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        
        {/* Comparison Rank */}
        <div className="md:col-span-2 bg-surface border border-outline-variant/65 p-6 rounded-3xl shadow-lg flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-3">
              <TrendingDown className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-bold tracking-tight text-on-surface">
                Impact Comparison Overview
              </h4>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-xl font-normal">
              You are positionally aligned inside the top 5% of active eco-conscious citizens in your municipal jurisdiction this cycle. Let's document more to strengthen the index.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between pt-4 border-t border-outline-variant/10">
            <div className="flex -space-x-1.5 overflow-hidden items-center">
              <img
                className="w-8 h-8 rounded-full border border-surface object-cover"
                alt="Community member"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIjB6WqPc6S1nymezq5TCvPpYM_BOwnbupG0Z6mCog4uX1VVpF4-3xrHa-CLgL2qtZ5fILg3RUTidHsEQg1quZLGm4PMt9XnjNhn3RRiNr4Gg_BbIKSYnZQ5NRm71Hyr3ZImeQkNI6TWIhPuru4U6PThZtaWs3zp7HAdIpKmZQMBJJJtJJ-f565nMyfg6GVBCVb508wbwBWezaY5Of_ITN__pS4xzNYkMrWxQYo4mkrC8yHg2U6yo38yNDbY8bdMldkKdxhRmELLB0"
              />
              <img
                className="w-8 h-8 rounded-full border border-surface object-cover"
                alt="Community member"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhKus8RIN1nbmpPseyG19sHBmQuC5EbBqkxmnbjQX6Yl2E8LbX8xw8e8BcYt837WVrgdtKH4oELuzgsb9LeXU8wUgl5aP5HPY7Y67gp7eO8-bGsPc0u_1BGo-w-WKBGLkLBXsOyw49cfQOtRveUpZ5FbGnjJDdzwEOQhg-KfuOskckSysYGRAGXKoOfR7l39B3NeF9sfbLN3AtZkPZR5d62PSLY6NIErMTTdoLpB86hdvXGXJfuILqj5uQ6TRhotSph6NmdyNWO2WK"
              />
              <img
                className="w-8 h-8 rounded-full border border-surface object-cover"
                alt="Community member"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuXVd0xbsx4fWfxfj7kj5atoa4KQ1UPXlRTf966GX_hrAg8f2Uvj4Z-o9PZsWz6mZKN2xLC7uU9NGP4t_VxHSqWph90EtBbC15R9vNAXOqSMtLm150oaQWNvZ1NicVrzVNgKz2CH9YKAiX0s7vqWXx2TkPY8Y-rzRYRaFako4ipu26FK4XSeYLwhIJIbovqbgb1TSY9WySA9OjwtAl0LkBmDK0joZjmY_559o4OqY9cYZxnoUhK0YhJr8SRc2vMYlB8kc_ZPk4JG1B"
              />
              <div className="w-8 h-8 rounded-full border border-surface bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface">
                +12k
              </div>
            </div>
            <span className="text-xs text-primary font-bold tracking-wider uppercase flex items-center gap-1.5 hover:underline transition-colors cursor-pointer">
              Join discussion <ExternalLink className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Pro Tip Card */}
        <div className="bg-surface border border-outline-variant/65 p-6 rounded-3xl flex flex-col justify-between shadow-lg group">
          <div className="space-y-4">
            <span className="text-xs tracking-wider font-bold text-primary uppercase block">
              ADVISORY NOTE
            </span>
            <div>
              <p className="text-sm text-on-surface font-normal leading-relaxed italic">
                "Shortening laundry run cycles and opting for full cold-water loads decreases dynamic grid heat loss indexes significantly over 12 months."
              </p>
            </div>
          </div>
          
          <button 
            disabled
            className="mt-6 text-on-surface-variant text-xs tracking-wider uppercase font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform self-start opacity-75"
          >
            Learn More <ExternalLink className="w-4 h-4 ml-1" />
          </button>
        </div>
      </section>

      {/* Share Milestone Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
          <div className="bg-surface border border-outline-variant/30 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-6">
            <button
              type="button"
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full border border-outline-variant/30 bg-surface-container hover:bg-surface-container-high text-on-surface active:scale-95 transition-transform cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              aria-label="Close share modal"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-center space-y-2 pb-2 border-b border-outline-variant/20">
              <Award className="w-10 h-10 text-primary mx-auto" aria-hidden="true" />
              <h4 id="share-modal-title" className="text-2xl font-bold text-primary">Carbon Milestone</h4>
              <p className="text-xs text-on-surface">
                Let your peers know about your offset contributions
              </p>
            </div>

            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 text-center">
              <p className="text-lg font-bold text-primary">🌱 EcoTrack Champion</p>
              <p className="text-xs text-on-surface mt-3 leading-relaxed font-normal">
                "I have compiled {totalSaved.toFixed(1)}kg of carbon saved using EcoTrack. This helps offset {equivalentTrees} full-grown trees in our state forests."
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 py-3 bg-primary text-on-primary hover:bg-primary/95 transition-all text-xs font-bold rounded-full flex items-center justify-center gap-2 cursor-pointer shadow active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" aria-hidden="true" /> Copied link
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" aria-hidden="true" /> Copy Message Link
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="py-3 px-6 border border-outline-variant/30 hover:bg-surface-container text-on-surface text-xs font-bold rounded-full active:scale-95 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Carbon Calculator Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" role="dialog" aria-modal="true" aria-labelledby="details-modal-title">
          <div className="bg-surface border border-outline-variant/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-6 max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full border border-outline-variant/20 bg-surface-container hover:bg-surface-container-high text-on-surface active:scale-95 transition-transform cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              aria-label="Close details modal"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="space-y-2 pb-3 border-b border-outline-variant/30">
              <h4 id="details-modal-title" className="text-2xl font-bold text-primary">Calculation Schema</h4>
              <p className="text-xs text-on-surface">
                Scientific carbon savings calculated based on verified EPA global standards.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-2xl border border-outline-variant/20 text-xs font-normal">
                <span className="text-on-surface font-medium">Walking instead of Driving</span>
                <span className="text-primary font-bold">+0.4 kg CO2 / km</span>
              </div>
              <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-2xl border border-outline-variant/20 text-xs font-normal">
                <span className="text-on-surface" font-medium="true">Biking instead of Driving</span>
                <span className="text-primary font-bold">+0.3 kg CO2 / km</span>
              </div>
              <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-2xl border border-outline-variant/20 text-xs font-normal">
                <span className="text-on-surface" font-medium="true">Switching to Plant-based Meal</span>
                <span className="text-primary font-bold">+2.1 kg CO2 / meal</span>
              </div>
              <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-2xl border border-outline-variant/20 text-xs font-normal">
                <span className="text-on-surface" font-medium="true">Using Dairy Alternatives</span>
                <span className="text-primary font-bold">+0.8 kg CO2 / serving</span>
              </div>
              <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-2xl border border-outline-variant/20 text-xs font-normal">
                <span className="text-on-surface" font-medium="true">Switching Off Lights</span>
                <span className="text-primary font-bold">+0.1 kg CO2 / hr</span>
              </div>
              <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-2xl border border-outline-variant/20 text-xs font-normal">
                <span className="text-on-surface" font-medium="true">Cold Wash Cycle</span>
                <span className="text-primary font-bold">+0.5 kg CO2 / load</span>
              </div>
            </div>

            <div className="border border-primary/30 p-4 bg-primary/5 text-xs text-primary leading-relaxed rounded-2xl">
              💡 <strong>Tree absorption:</strong> A mature tree absorbs approximately 24 kg of carbon dioxide from the atmosphere containing pollutants per year. Therefore, every 24 kg of carbon you save effectively offsets a whole tree's annual carbon processing workload!
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="py-2.5 px-6 bg-primary text-on-primary hover:bg-primary/95 transition-all text-xs font-bold rounded-full active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
