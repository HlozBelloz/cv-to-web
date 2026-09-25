'use client';

import React, { useState } from 'react';
import { CVProfile } from '@/types';
import { ExecutiveTheme } from './ExecutiveTheme';
import { ModernTechTheme } from './ModernTechTheme';
import { MinimalistTheme } from './MinimalistTheme';
import { CreativeTheme } from './CreativeTheme';
import { ThemeSwitcher, SupportedTheme } from './ThemeSwitcher';

interface Props {
  profile: CVProfile;
  defaultTheme?: SupportedTheme;
}

export function ThemeRenderer({ profile, defaultTheme }: Props) {
  const [theme, setTheme] = useState<SupportedTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`cv_theme_${profile.slug}`);
      if (saved && ['executive', 'tech', 'modern', 'minimal', 'creative'].includes(saved)) {
        return saved as SupportedTheme;
      }
    }
    return (defaultTheme || profile.theme || 'executive') as SupportedTheme;
  });

  const handleThemeChange = (newTheme: SupportedTheme) => {
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`cv_theme_${profile.slug}`, newTheme);
    }
  };

  const renderActiveTheme = () => {
    switch (theme) {
      case 'tech':
      case 'modern':
        return <ModernTechTheme profile={profile} />;
      case 'minimal':
        return <MinimalistTheme profile={profile} />;
      case 'creative':
        return <CreativeTheme profile={profile} />;
      case 'executive':
      default:
        return <ExecutiveTheme profile={profile} />;
    }
  };

  return (
    <div className="relative">
      {renderActiveTheme()}
      <ThemeSwitcher currentTheme={theme} onThemeChange={handleThemeChange} />
    </div>
  );
}
