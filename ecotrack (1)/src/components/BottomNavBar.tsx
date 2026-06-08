import { LayoutDashboard, PlusCircle, TrendingUp, Award } from 'lucide-react';

interface BottomNavBarProps {
  activeTab: 'Home' | 'Log' | 'Trends' | 'Impact';
  setActiveTab: (tab: 'Home' | 'Log' | 'Trends' | 'Impact') => void;
}

export default function BottomNavBar({ activeTab, setActiveTab }: BottomNavBarProps) {
  const tabs = [
    { name: 'Home', icon: LayoutDashboard },
    { name: 'Log', icon: PlusCircle },
    { name: 'Trends', icon: TrendingUp },
    { name: 'Impact', icon: Award },
  ] as const;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4 pb-safe bg-surface/95 backdrop-blur-lg border-t border-outline-variant/20 shadow-[0_-4px_20px_0_rgba(15,82,56,0.12)] transition-all duration-300" aria-label="Mobile navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.name;

        if (isActive) {
          return (
            <button
              key={tab.name}
              id={`nav-mobile-${tab.name.toLowerCase()}`}
              onClick={() => setActiveTab(tab.name)}
              aria-current="page"
              aria-label={`Current Tab: ${tab.name}`}
              className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-5 py-2 active:scale-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-transform duration-200 cursor-pointer shadow-md"
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span className="font-sans text-[11px] font-semibold mt-0.5">{tab.name}</span>
            </button>
          );
        }

        return (
          <button
            key={tab.name}
            id={`nav-mobile-${tab.name.toLowerCase()}`}
            onClick={() => setActiveTab(tab.name)}
            aria-label={`Go to ${tab.name}`}
            className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary px-4 py-2 transition-all active:scale-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none duration-200 cursor-pointer"
          >
            <Icon className="w-5 h-5 text-on-surface-variant" aria-hidden="true" />
            <span className="font-sans text-[11px] mt-0.5">{tab.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
