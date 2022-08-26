import { Settings } from '../../types';
import { WorldDefinition } from '../WorldGenerator';

export abstract class BaseRenderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
      throw new Error('Canvas 2D context is not supported');
    }
    this.ctx = ctx;
  }

  // ABSTRACT METHOD
  static getCellSize(settings: Settings): number {
    throw new Error('BaseRenderer.getCellSize is an abstract method, must overwrite');
  }

  async load() {
    return Promise.resolve();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  abstract render(world: WorldDefinition, settings: Settings): void;
}
