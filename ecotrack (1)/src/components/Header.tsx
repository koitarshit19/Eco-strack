import { Leaf, Sun, Moon, User } from 'lucide-react';

interface HeaderProps {
  activeTab: 'Home' | 'Log' | 'Trends' | 'Impact';
  setActiveTab: (tab: 'Home' | 'Log' | 'Trends' | 'Impact') => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Header({ activeTab, setActiveTab, darkMode, setDarkMode }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md shadow-sm border-b border-outline-variant/20 flex items-center justify-between px-6 md:px-12 h-16 transition-colors duration-300">
      <button 
        onClick={() => setActiveTab('Home')}
        className="flex items-center gap-2 hover:opacity-95 transition-opacity pointer-events-auto focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none rounded-lg p-1"
        id="btn-logo"
        aria-label="EcoTrack Home"
      >
        <Leaf role="img" aria-label="EcoTrack Leaf" className="w-6 h-6 text-primary fill-primary transition-colors duration-300" />
        <span className="font-headline text-xl font-bold text-primary transition-colors duration-300">EcoTrack</span>
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8" aria-label="Desktop primary navigation">
        {(['Home', 'Log', 'Trends', 'Impact'] as const).map((tab) => (
          <button
            key={tab}
            id={`nav-desktop-${tab.toLowerCase()}`}
            onClick={() => setActiveTab(tab)}
            aria-current={activeTab === tab ? 'page' : undefined}
            aria-label={`Navigate to ${tab}`}
            className={`font-headline text-sm font-semibold transition-all duration-300 pb-1 border-b-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md px-1.5 ${
              activeTab === tab
                ? 'text-primary border-primary'
                : 'text-on-surface-variant hover:text-on-surface hover:border-on-surface/30'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          id="btn-theme-toggle"
          title="Toggle Theme"
          aria-label="Toggle light and dark mode"
          className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none active:scale-95 duration-100 cursor-pointer"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-primary" aria-hidden="true" />
          ) : (
            <Moon className="w-5 h-5 text-primary" aria-hidden="true" />
          )}
        </button>

        {/* Profile Avatar */}
        <div 
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed/60 shadow-sm flex items-center justify-center bg-surface-container"
          id="profile-avatar"
          role="img"
          aria-label="User Profile"
        >
          <img
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              // fallback if image fails or blocks in developer machine
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsu4gIxPm5GJwBmIwxNmG8tYlWyA6tRWE3_fnK5S2qlIN3Q-CckKbYXlKmx53nNg1gu37L_WSMp1xTPfgCmmxJ8FG4MQ0LPCeROptUcOh3wG37J4WhF1ZERedAGc4RwKR2bqbC0Hbanoz2P25sbmmkNTw8q8RngvKdUkeyN_Js4nHirGCgve2l7UJiPsBfzPBr9OmNXDmkkX2Dfu2yIl7h3FpLl-As6483H0trGeQ81_POOeNrrLfAjoCWrW0Eb6hdLdxvHJXE-Aiy"
          />
          <User className="w-5 h-5 text-on-surface-variant opacity-80" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}
