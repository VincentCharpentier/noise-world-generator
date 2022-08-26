import clsx from 'clsx';
import React from 'react';
import { SettingsContext } from '../../contexts/SettingsContext';
import { RENDER_TYPE, Settings } from '../../types';
import { CheckboxInput, NumberInput, SelectInput, SliderInput, TextInput } from './inputs';
import './Sidebar.scss';

const RENDER_TYPES = [
  {
    label: 'Isometric',
    value: String(RENDER_TYPE.ISOMETRIC),
  },
  {
    label: 'Heightmap',
    value: String(RENDER_TYPE.HEIGHTMAP),
  },
  {
    label: '2D',
    value: String(RENDER_TYPE.FLAT_2D),
  },
];

interface SideBarProps {
  className: string;
}

export const Sidebar: React.FC<SideBarProps> = ({ className }) => {
  const { settings, updateSettings } = React.useContext(SettingsContext);
  const [showSettings, setShowSettings] = React.useState(false);

  const handleChange = React.useCallback(
    function <T>(key: keyof Settings) {
      return (newValue: T) =>
        updateSettings({
          [key]: newValue,
        });
    },
    [updateSettings],
  );

  return (
    <aside className={clsx(className, 'settings')}>
      <header>Settings</header>
      <NumberInput label='Seed' value={settings.seed} onChange={handleChange('seed')} />
      <SelectInput
        label='Render Type'
        options={RENDER_TYPES}
        value={String(settings.renderType)}
        onChange={(newValue: string) => handleChange('renderType')(parseInt(newValue))}
      />
      <SliderInput
        label='Zoom'
        min={0}
        max={1}
        step={0.01}
        value={settings.cameraZoom}
        onChange={handleChange('cameraZoom')}
      />
      <SliderInput
        label='Amplitude'
        min={1}
        max={5}
        step={1}
        value={settings.amplitude}
        onChange={handleChange('amplitude')}
      />
      <SliderInput
        label='Smoothness'
        min={1}
        max={40}
        step={1}
        value={settings.smoothness}
        onChange={handleChange('smoothness')}
      />
      {[RENDER_TYPE.HEIGHTMAP, RENDER_TYPE.FLAT_2D].includes(settings.renderType) && (
        <CheckboxInput
          label='Show Vectors'
          value={settings.hmShowVertex}
          onChange={handleChange('hmShowVertex')}
        />
      )}
      <NumberInput label='Camera X' value={settings.cameraX} onChange={handleChange('cameraX')} />
      <NumberInput label='Camera Y' value={settings.cameraY} onChange={handleChange('cameraY')} />
      <label>
        <span>Show settings</span>
        <input type='checkbox' checked={showSettings} onChange={() => setShowSettings((x) => !x)} />
      </label>
      {showSettings && <pre>{JSON.stringify(settings, null, 2)}</pre>}
    </aside>
  );
};
