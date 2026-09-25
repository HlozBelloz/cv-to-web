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
  allowSwitching?: boolean;
  onThemeSelect?: (theme: SupportedTheme) => void;
}

export function ThemeRenderer({ profile, defaultTheme, allowSwitching = false, onThemeSelect }: Props) {
  // Use profile.theme locked by the owner as the primary theme
  const [theme, setTheme] = useState<SupportedTheme>(() => {
    return (defaultTheme || profile.theme || 'executive') as SupportedTheme;
  });

  // Keep in sync if profile updates (e.g. live AI edit)
  React.useEffect(() => {
    if (profile.theme && profile.theme !== theme) {
      setTheme(profile.theme as SupportedTheme);
    }
  }, [profile.theme, theme]);

  const handleThemeChange = (newTheme: SupportedTheme) => {
    setTheme(newTheme);
    if (onThemeSelect) {
      onThemeSelect(newTheme);
    }
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
      {allowSwitching && (
        <ThemeSwitcher currentTheme={theme} onThemeChange={handleThemeChange} />
      )}
    </div>
  );
}
