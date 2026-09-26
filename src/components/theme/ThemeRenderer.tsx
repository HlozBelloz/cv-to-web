'use client';

import React, { useState } from 'react';
import { CVProfile } from '@/types';
import { PortfolioWpProTheme } from './PortfolioWpProTheme';
import { CyberDarkGlassTheme } from './CyberDarkGlassTheme';
import { MechatronicsCobaltEmeraldTheme } from './MechatronicsCobaltEmeraldTheme';
import { EditorialLuxuryWarmTheme } from './EditorialLuxuryWarmTheme';
import { ThemeSwitcher, SupportedTheme } from './ThemeSwitcher';

interface Props {
  profile: CVProfile;
  defaultTheme?: SupportedTheme | string;
  allowSwitching?: boolean;
  onThemeSelect?: (theme: SupportedTheme) => void;
}

export function ThemeRenderer({ profile, defaultTheme, allowSwitching = false, onThemeSelect }: Props) {
  // Use profile.theme locked by the owner as the primary theme
  const [theme, setTheme] = useState<SupportedTheme>(() => {
    return (defaultTheme || profile.theme || 'portfolio-wp-pro') as SupportedTheme;
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
      case 'cyber-dark-glass':
      case 'tech':
      case 'modern':
        return <CyberDarkGlassTheme profile={profile} />;
      case 'mechatronics-cobalt-emerald':
        return <MechatronicsCobaltEmeraldTheme profile={profile} />;
      case 'editorial-luxury-warm':
      case 'creative':
        return <EditorialLuxuryWarmTheme profile={profile} />;
      case 'portfolio-wp-pro':
      case 'minimal':
      case 'executive':
      default:
        return <PortfolioWpProTheme profile={profile} />;
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
