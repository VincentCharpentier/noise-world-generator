import React from 'react';
import { SettingsContext } from '../contexts/SettingsContext';

const isEventFromInput = (event: KeyboardEvent): boolean =>
  (event.target as HTMLElement).tagName === 'INPUT';

export const useKeyboardNav = () => {
  const { settings, updateSettings } = React.useContext(SettingsContext);

  const handleNavKeys = React.useCallback(
    (event: KeyboardEvent) => {
      if (isEventFromInput(event)) return;
      switch (event.key) {
        case 'Down': // IE/Edge specific value
        case 'ArrowDown':
          event.preventDefault();
          // Handle "down arrow" key press.
          updateSettings(({ cameraY }) => ({
            cameraY: cameraY + 1,
          }));
          break;
        case 'Up': // IE/Edge specific value
        case 'ArrowUp':
          // Handle "up arrow" key press.
          event.preventDefault();
          // Handle "down arrow" key press.
          updateSettings(({ cameraY }) => ({
            cameraY: cameraY - 1,
          }));
          break;
        case 'Left': // IE/Edge specific value
        case 'ArrowLeft':
          // Handle "left arrow" key press.
          event.preventDefault();
          // Handle "down arrow" key press.
          updateSettings(({ cameraX }) => ({
            cameraX: cameraX - 1,
          }));
          break;
        case 'Right': // IE/Edge specific value
        case 'ArrowRight':
          // Handle "right arrow" key press.
          event.preventDefault();
          // Handle "down arrow" key press.
          updateSettings(({ cameraX }) => ({
            cameraX: cameraX + 1,
          }));
          break;
      }
    },
    [updateSettings],
  );

  React.useEffect(() => {
    window.addEventListener('keydown', handleNavKeys);
    return () => window.removeEventListener('keydown', handleNavKeys);
  }, [handleNavKeys]);
};
