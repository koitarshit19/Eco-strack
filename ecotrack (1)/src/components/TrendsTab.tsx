import { useState } from 'react';
import { LoggedActivity } from '../types';
import { 
  TrendingUp, 
  Leaf, 
  Car, 
  Flame, 
  PieChart as PieIcon, 
  TrendingDown, 
  Award,
  Zap
} from 'lucide-react';

interface TrendsTabProps {
  loggedActivities: LoggedActivity[];
}

export default function TrendsTab({ loggedActivities }: TrendsTabProps) {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'All' | 'Transport' | 'Food' | 'Energy'>('All');

  // Stats Calculations
  const totalOffset = loggedActivities.reduce((acc, curr) => acc + curr.saved, 0);

  // Grouped by Category
  const categoryTotals = loggedActivities.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.saved;
    return acc;
  }, {} as Record<string, number>);

  const transportOffset = categoryTotals['Transport'] || 0;
  const foodOffset = categoryTotals['Food'] || 0;
  const energyOffset = categoryTotals['Energy'] || 0;

  // Percentage distribution
  const totalWeight = transportOffset + foodOffset + energyOffset || 1;
  const shares = {
    Transport: Math.round((transportOffset / totalWeight) * 100),
    Food: Math.round((foodOffset / totalWeight) * 100),
    Energy: Math.round((energyOffset / totalWeight) * 100),
  };

  const filteredLogs = activeCategoryFilter === 'All' 
    ? loggedActivities 
    : loggedActivities.filter(a => a.category === activeCategoryFilter);

  return (
    <div className="space-y-10 animate-[fadeIn_0.5s_ease-out]">
      {/* Header */}
      <section className="space-y-1">
        <span className="text-xs tracking-wider font-bold text-primary uppercase block">
          Audits & Analytics // Periodic Footprint
        </span>
        <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Climate Performance & Trends</h2>
        <p className="text-base text-on-surface-variant font-normal leading-relaxed max-w-2xl">
          Track emission distribution models and audit cumulative savings over active intervals. Identify high-yield behaviors in your daily cycle.
        </p>
      </section>

      {/* Row stats overview components */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Cumulative Offset */}
        <div className="bg-surface border border-outline-variant/65 rounded-3xl p-6 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase font-extrabold tracking-wider text-on-surface-variant">Cumulative Savings</span>
            <p className="text-3xl font-extrabold text-primary">{totalOffset.toFixed(1)} <span className="text-sm font-normal text-on-surface-variant">kg CO2</span></p>
          </div>
          <div className="w-12 h-12 bg-primary-container text-primary border border-primary/15 rounded-full flex items-center justify-center p-3">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Highest Category */}
        <div className="bg-surface border border-outline-variant/65 rounded-3xl p-6 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase font-extrabold tracking-wider text-on-surface-variant">Active Segment</span>
            <p className="text-2xl font-extrabold text-secondary">
              {transportOffset >= foodOffset && transportOffset >= energyOffset ? 'Transport' : foodOffset >= energyOffset ? 'Food & Diet' : 'Energy Saving'}
            </p>
          </div>
          <div className="w-12 h-12 bg-secondary-container text-secondary border border-secondary/15 rounded-full flex items-center justify-center p-3">
            <Leaf className="w-6 h-6" />
          </div>
        </div>

        {/* Dynamic Streak Rate */}
        <div className="bg-surface border border-outline-variant/65 rounded-3xl p-6 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase font-extrabold tracking-wider text-on-surface-variant">Active Streak</span>
            <p className="text-3xl font-extrabold text-[#7c3aed]">
              05 <span className="text-sm font-normal text-on-surface-variant">Days running</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-[#f5f3ff] text-[#7c3aed] border border-[#ddd6fe] rounded-full flex items-center justify-center p-3">
            <Award className="w-6 h-6" />
          </div>
        </div>

      </section>

      {/* Grid: Category share graph on left + Filter logs on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Category Share chart */}
        <div className="lg:col-span-4 bg-surface border border-outline-variant/65 rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-3">
              <PieIcon className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-bold text-on-surface">Category Shares</h4>
            </div>
            <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed">
              Segment distribution based on total carbon emissions offset. Focus resources on minor indicators to optimize yields.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            {/* Transport shares */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
                <span>TRANSPORT SAVINGS</span>
                <span>{shares.Transport}%</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden border border-outline-variant/10">
                <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${shares.Transport}%` }} />
              </div>
            </div>

            {/* Food shares */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
                <span>FOOD & NUTRITION</span>
                <span>{shares.Food}%</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden border border-outline-variant/10">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${shares.Food}%` }} />
              </div>
            </div>

            {/* Energy shares */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
                <span>RENEWABLES & GRID</span>
                <span>{shares.Energy}%</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden border border-outline-variant/10">
                <div className="h-full bg-[#3b82f6] rounded-full transition-all duration-500" style={{ width: `${shares.Energy}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Filter list on right */}
        <div className="lg:col-span-8 bg-surface border border-outline-variant/65 rounded-3xl p-6 shadow-md space-y-6">
          
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/20 pb-4">
            <h4 className="text-lg font-bold text-on-surface">Activity Ledger</h4>
            
            <div className="flex flex-wrap gap-1 bg-surface-container-low rounded-full p-1 border border-outline-variant/15" role="group" aria-label="Filter logs by category">
              {(['All', 'Transport', 'Food', 'Energy'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveCategoryFilter(filter)}
                  aria-pressed={activeCategoryFilter === filter}
                  aria-label={`Filter logs to showing ${filter}`}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer ${
                    activeCategoryFilter === filter
                      ? 'bg-primary text-on-primary shadow'
                      : 'text-on-surface hover:text-primary'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Table list */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant bg-background/30 rounded-2xl border border-dashed border-outline-variant/50">
                No active records match the filter query.
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container transition-colors rounded-2xl border border-outline-variant/15">
                  <div className="flex items-center gap-3">
                    <span className="text-xs uppercase font-extrabold px-3 py-1 tracking-wider bg-background border border-outline-variant/30 rounded-full text-on-surface">
                      {log.category}
                    </span>
                    <div>
                      <p className="text-base font-bold text-on-surface leading-snug">{log.name}</p>
                      <p className="text-[11px] font-semibold text-on-surface mt-0.5">{log.value.toFixed(1)} {log.unit} logged</p>
                    </div>
                  </div>
                  
                  <span className="text-secondary font-bold text-sm bg-secondary-container/20 border border-secondary-container rounded-full px-3 py-1">
                    -{log.saved.toFixed(1)}kg CO2
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
