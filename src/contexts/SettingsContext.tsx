import React from 'react';
import { DEFAULT_SETTINGS } from '../constants/settings';
import { Settings } from '../types';

type SettingsMutator = (prevSettings: Settings) => Partial<Settings>;
type SetSettingsAction = Partial<Settings> | SettingsMutator;

interface SettingsCtx {
  settings: Settings;
  updateSettings: (arg: SetSettingsAction) => void;
}

export const SettingsContext = React.createContext<SettingsCtx>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => null,
});

interface SettingsCtxProps {
  children: React.ReactNode;
}

const getInitialSettings = () => {
  const rawSettings = localStorage.getItem('settings');

  if (rawSettings) {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(rawSettings) };
  }
  return DEFAULT_SETTINGS;
};

export const SettingsContextProvider: React.FC<SettingsCtxProps> = ({ children }) => {
  const [settings, setSettings] = React.useState<Settings>(getInitialSettings);

  const updateSettings = React.useCallback((arg: SetSettingsAction) => {
    setSettings((currentSettings: Settings) => {
      if (typeof arg === 'object') {
        return { ...currentSettings, ...arg };
      } else {
        const mutation = arg(currentSettings);
        return { ...currentSettings, ...mutation };
      }
    });
  }, []);

  React.useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const ctxValue = React.useMemo(() => ({ settings, updateSettings }), [settings, updateSettings]);

  return <SettingsContext.Provider value={ctxValue}>{children}</SettingsContext.Provider>;
};
