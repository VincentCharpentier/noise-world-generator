import { RENDER_TYPE, Settings } from './../types';

export const DEFAULT_SETTINGS: Settings = {
  seed: 0,
  renderType: RENDER_TYPE.ISOMETRIC,
  cameraZoom: 32,
  amplitude: 4,
  smoothness: 1,
  cameraX: 0,
  cameraY: 0,
  // HEIGHTMAP
  hmShowVertex: true,
};
