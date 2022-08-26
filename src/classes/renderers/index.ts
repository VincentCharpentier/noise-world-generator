import { Settings } from '../../types';
import { BaseRenderer } from './BaseRenderer';

export { HeightMapRenderer } from './HeightmapRenderer';
export { IsoWorldRenderer } from './IsoRenderer';

export interface WorldRendererFactory {
  new (canvas: HTMLCanvasElement): BaseRenderer;
}
