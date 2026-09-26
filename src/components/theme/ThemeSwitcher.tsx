'use client';

import React from 'react';
import { Sparkles, Terminal, BookOpen, Cpu } from 'lucide-react';

export type SupportedTheme = 
  | 'portfolio-wp-pro' 
  | 'cyber-dark-glass' 
  | 'mechatronics-cobalt-emerald' 
  | 'editorial-luxury-warm'
  | 'executive' 
  | 'modern' 
  | 'minimal' 
  | 'tech' 
  | 'creative';

interface ThemeSwitcherProps {
  currentTheme: SupportedTheme;
  onThemeChange: (theme: SupportedTheme) => void;
}

const THEMES: { id: SupportedTheme; name: string; icon: React.ReactNode; badge: string }[] = [
  {
    id: 'portfolio-wp-pro',
    name: 'WP Pro Editorial',
    badge: 'Editorial Light',
    icon: <BookOpen className="w-3.5 h-3.5" />,
  },
  {
    id: 'cyber-dark-glass',
    name: 'Cyber Dark Glass',
    badge: 'Cyber Neon',
    icon: <Terminal className="w-3.5 h-3.5" />,
  },
  {
    id: 'mechatronics-cobalt-emerald',
    name: 'Cobalt Emerald',
    badge: 'Hardware & Ops',
    icon: <Cpu className="w-3.5 h-3.5" />,
  },
  {
    id: 'editorial-luxury-warm',
    name: 'Luxury Warm',
    badge: 'Warm Slate',
    icon: <Sparkles className="w-3.5 h-3.5" />,
  },
];

export function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  // Normalize legacy IDs
  let activeId: SupportedTheme = currentTheme;
  if (currentTheme === 'minimal' || currentTheme === 'executive') {
    activeId = 'portfolio-wp-pro';
  } else if (currentTheme === 'tech' || currentTheme === 'modern') {
    activeId = 'cyber-dark-glass';
  } else if (currentTheme === 'creative') {
    activeId = 'editorial-luxury-warm';
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-full px-4 print:hidden">
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl text-slate-200">
        <span className="hidden sm:inline-block pl-3 pr-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase select-none">
          Theme:
        </span>
        
        {THEMES.map((t) => {
          const isActive = activeId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onThemeChange(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t.icon}
              <span>{t.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
