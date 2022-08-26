import { SettingsContextProvider } from '../../contexts/SettingsContext';
import { WorldMap } from '../WorldMap';
import { Sidebar } from '../Sidebar/Sidebar';
import './App.scss';

export const App = () => (
  <SettingsContextProvider>
    <div className='app'>
      <header>Perlin Noise World Generator</header>
      <Sidebar className='sidebar' />
      <WorldMap className='main' />
    </div>
  </SettingsContextProvider>
);
