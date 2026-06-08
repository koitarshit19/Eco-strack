import { useState } from 'react';
import { 
  Bike, 
  Footprints, 
  Utensils, 
  Droplet, 
  Lightbulb, 
  Snowflake,
  Calendar,
  Minus,
  Plus,
  Zap
} from 'lucide-react';
import { ActivityCategory } from '../types';

interface LogTabProps {
  onLogActivity: (category: ActivityCategory, name: string, value: number, saved: number) => void;
}

export default function LogTab({ onLogActivity }: LogTabProps) {
  // Steppers for each logging type
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'Walking': 2,
    'Biking': 5,
    'Plant-based Meal': 1,
    'Dairy Alternative': 1,
    'Unnecessary Lights': 2,
    'Cold Wash Cycle': 1,
  });

  const updateQuantity = (name: string, diff: number) => {
    setQuantities(prev => {
      const curr = prev[name] || 0;
      const next = Math.max(1, curr + diff);
      return { ...prev, [name]: next };
    });
  };

  const actions = [
    {
      category: 'Transport' as ActivityCategory,
      icon: <Footprints className="w-5 h-5 text-on-secondary-container" />,
      bgIcon: 'bg-secondary-container/20 border border-secondary/20',
      headerIcon: <Bike className="w-4 h-4 text-primary" />,
      items: [
        {
          name: 'Walking',
          savedPerUnit: 0.4,
          unit: 'km',
          icon: <Footprints className="w-5 h-5" />,
          bgIcon: 'border border-outline-variant/40 bg-surface',
        },
        {
          name: 'Biking',
          savedPerUnit: 0.3,
          unit: 'km',
          icon: <Bike className="w-5 h-5" />,
          bgIcon: 'border border-outline-variant/40 bg-surface',
        }
      ]
    },
    {
      category: 'Food' as ActivityCategory,
      icon: <Utensils className="w-5 h-5 text-on-primary-fixed-variant" />,
      bgIcon: 'bg-primary-container/20 border border-primary/20',
      headerIcon: <Utensils className="w-4 h-4 text-primary" />,
      items: [
        {
          name: 'Plant-based Meal',
          savedPerUnit: 2.1,
          unit: 'meal',
          icon: <Utensils className="w-5 h-5" />,
          bgIcon: 'border border-outline-variant/40 bg-surface',
        },
        {
          name: 'Dairy Alternative',
          savedPerUnit: 0.8,
          unit: 'serving',
          icon: <Droplet className="w-5 h-5" />,
          bgIcon: 'border border-outline-variant/40 bg-surface',
        }
      ]
    },
    {
      category: 'Energy' as ActivityCategory,
      icon: <Zap className="w-5 h-5 text-on-secondary-fixed" />,
      bgIcon: 'bg-tertiary-container/20 border border-tertiary/20',
      headerIcon: <Zap className="w-4 h-4 text-primary" />,
      items: [
        {
          name: 'Unnecessary Lights',
          savedPerUnit: 0.1,
          unit: 'hour',
          icon: <Lightbulb className="w-5 h-5" />,
          bgIcon: 'border border-outline-variant/40 bg-surface',
        },
        {
          name: 'Cold Wash Cycle',
          savedPerUnit: 0.5,
          unit: 'load',
          icon: <Snowflake className="w-5 h-5" />,
          bgIcon: 'border border-outline-variant/40 bg-surface',
        }
      ]
    }
  ];

  const handleAdd = (name: string, savedPerUnit: number, category: ActivityCategory, unit: string) => {
    const qty = quantities[name] || 1;
    const totalSaved = qty * savedPerUnit;
    onLogActivity(category, name, qty, totalSaved);
  };

  // Get current date string
  const getFormattedDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    const formatted = date.toLocaleDateString('en-US', options);
    return `Today, ${formatted}`;
  };

  return (
    <div className="space-y-10 animate-[fadeIn_0.5s_ease-out]">
      {/* Header & Date Section */}
      <header className="space-y-1">
        <span className="text-xs tracking-wider font-bold text-primary uppercase block">
          Journal Record // Daily Actions
        </span>
        <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Daily Action Log</h2>
        <div className="flex items-center gap-2 text-on-surface-variant pt-1">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">{getFormattedDate()}</span>
        </div>
      </header>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {actions.map((section) => (
          <section key={section.category} className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/30">
              <h3 className="text-sm tracking-widest font-bold uppercase text-primary">
                {section.category}
              </h3>
            </div>

            <div className="grid gap-6">
              {section.items.map((item) => {
                const qty = quantities[item.name] || 1;
                const co2Saved = qty * item.savedPerUnit;

                return (
                  <div
                    key={item.name}
                    className="group bg-surface hover:bg-surface-container-low transition-colors duration-200 p-6 rounded-3xl border border-outline-variant/65 flex flex-col justify-between gap-6 shadow-md hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      {/* Fully rounded emerald-colored icon wrapper */}
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary-container text-primary border border-primary/20">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-bold text-on-surface leading-snug">{item.name}</p>
                        <p className="text-xs text-on-surface-variant mt-1 font-medium">
                          {item.savedPerUnit.toFixed(1)}kg saved / {item.unit}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                      {/* Stepper controls */}
                      <div className="flex items-center bg-background rounded-full px-3 py-1 gap-3 border border-outline-variant/35">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.name, -1)}
                          className="w-6 h-6 rounded-full bg-surface hover:bg-surface-container text-on-surface flex items-center justify-center active:scale-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-transform cursor-pointer border border-outline-variant/10"
                          title="Decrease volume"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="w-3 h-3" aria-hidden="true" />
                        </button>
                        <span className="text-xs font-semibold text-on-surface min-w-[32px] text-center">
                          {qty} <span className="text-[10px] font-normal text-on-surface-variant uppercase">{item.unit}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.name, 1)}
                          className="w-6 h-6 rounded-full bg-surface hover:bg-surface-container text-on-surface flex items-center justify-center active:scale-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-transform cursor-pointer border border-outline-variant/10"
                          title="Increase volume"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </div>

                      {/* Log Action Button */}
                      <button
                        type="button"
                        onClick={() => handleAdd(item.name, item.savedPerUnit, section.category, item.unit)}
                        className="bg-primary text-on-primary rounded-full px-4 py-2 hover:bg-primary/95 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none cursor-pointer text-xs font-bold tracking-wider uppercase flex items-center gap-1 shadow-md active:scale-95"
                        title={`Log ${item.name}`}
                        aria-label={`Log ${qty} ${item.unit} of ${item.name} today`}
                      >
                        <span>+{co2Saved.toFixed(1)}kg</span>
                        <Plus className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Featured Forest Banner Card (Bright and full-colored natural imagery) */}
      <div className="mt-12 relative rounded-3xl overflow-hidden h-[300px] flex items-center bg-gradient-to-r from-emerald-950/80 to-teal-900/40 border border-outline-variant/40 shadow-xl group">
        <img
          alt="Sustainability Inspiration"
          onError={(e) => {
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
          className="absolute inset-x-0 w-full h-full object-cover brightness-50 contrast-105 opacity-40 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt6B2j0sprLaLsgWQmdJGx5LvUGLYWmahMT3lVEy2Iu0K3NVHwm1iekXoH-x06Imp-vHhEBaXG9lwDA0P_bFkGNEC58f7jLEDogHS_oH9js6v4oRs2YAWmq9IlEXwskrqn52I4kScG_66txSG9mDEUr4h3N33TCv1HeoPHw4rNSima5KWQ_jZBpa25iO_54DJP_hyFmm2WYkDMAJBieneqpKCzjM0cIb2P-1AxVZ1xehAnNHPlHBg0Zl1zMIuDqpugBYjmyajKn8Ge"
        />
        <div className="relative z-10 max-w-xl py-6 px-8 space-y-4">
          <span className="text-xs tracking-wider font-bold text-primary uppercase block">
            PERSPECTIVES
          </span>
          <h4 className="text-3xl text-white font-extrabold tracking-tight leading-tight">
            Every Step Matters
          </h4>
          <p className="text-sm text-emerald-100 font-normal leading-relaxed">
            Individual decisions are the raw material of historical change. By documenting your daily choices, you contribute to a collective, sustainable architecture.
          </p>
          <div className="h-1 w-20 bg-primary rounded-full" />
        </div>
      </div>
    </div>
  );
}
