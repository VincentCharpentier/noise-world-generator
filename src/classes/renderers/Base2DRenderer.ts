import { Settings } from '../../types';
import { TileDef, WorldDefinition } from '../WorldGenerator';
import { BaseRenderer } from './BaseRenderer';

// Zoom = cell render size
export const MIN_ZOOM = 5; // = max zoom out
export const MAX_ZOOM = 50; // = max zoom in

const getTileSize = (cameraZoom: number) =>
  Math.round(MIN_ZOOM + cameraZoom * (MAX_ZOOM - MIN_ZOOM));

export abstract class Base2DRenderer extends BaseRenderer {
  tileSize = 10;
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }

  static getWorldSize(
    settings: Settings,
    canvasHeight: number,
    canvasWidth: number,
  ): [worldSizeX: number, worldSizeY: number] {
    const cellSize = getTileSize(settings.cameraZoom);

    return [Math.ceil(canvasWidth / cellSize), Math.ceil(canvasHeight / cellSize)];
  }

  abstract renderTile(tile: TileDef, idx: number, world: WorldDefinition, settings: Settings): void;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  preRender(world: WorldDefinition, settings: Settings): void {}

  postRender(world: WorldDefinition, settings: Settings): void {
    // [DEBUG] RENDER PERLIN VERTEXES
    if (settings.hmShowVertex && world.meta.vertexes) {
      this.ctx.strokeStyle = 'red';
      this.ctx.fillStyle = 'red';
      const getVertexKey = (x: number, y: number) => [x, y].join(',');
      const perlinCellSize = this.tileSize * (settings.smoothness + 0.5);
      const lineLength = perlinCellSize / 2;
      const roundRadius = perlinCellSize / 32;
      // firstVertex in camera range (top-left)
      const posMod = (x: number, mod: number) => ((x % mod) + mod) % mod;
      const cameraX = settings.cameraX * this.tileSize;
      const cameraY = settings.cameraY * this.tileSize;
      // on canvas X/Y
      const firstVertexX = posMod(-cameraX, perlinCellSize) - perlinCellSize;
      const firstVertexY = posMod(-cameraY, perlinCellSize) - perlinCellSize;
      const xIdxOffset = Math.ceil(cameraX / perlinCellSize) - 1;
      const yIdxOffset = Math.ceil(cameraY / perlinCellSize) - 1;
      const stepCountX = 2 + Math.floor((this.canvas.width - firstVertexX) / perlinCellSize);
      const stepCountY = 2 + Math.floor((this.canvas.height - firstVertexY) / perlinCellSize);
      for (let xIdx = 0; xIdx < stepCountX; xIdx++) {
        // for (let cx = firstVertexX; cx < this.canvas.width; cx += perlinCellSize) {
        for (let yIdx = 0; yIdx < stepCountY; yIdx++) {
          // for (let cy = firstVertexY; cy < this.canvas.height; cy += perlinCellSize) {
          // TODO debug (bad cx/cy for get)
          // console.log(cx, cy / perlinCellSize);
          const vertex = world.meta.vertexes.get(
            getVertexKey(xIdxOffset + xIdx, yIdxOffset + yIdx),
          );
          if (!vertex) continue;
          const { x, y } = vertex;
          const cx = firstVertexX + xIdx * perlinCellSize;
          const cy = firstVertexY + yIdx * perlinCellSize;
          this.ctx.beginPath();
          this.ctx.arc(cx, cy, roundRadius, 0, 2 * Math.PI);
          this.ctx.fill();
          this.ctx.beginPath();
          this.ctx.moveTo(cx, cy);
          this.ctx.lineTo(cx + x * lineLength, cy + y * lineLength);
          this.ctx.stroke();
        }
      }
    }
  }

  render(world: WorldDefinition, settings: Settings): void {
    this.clearCanvas();

    this.tileSize = getTileSize(settings.cameraZoom);

    this.preRender(world, settings);

    world.tiles.forEach((tile, idx) => this.renderTile(tile, idx, world, settings));

    this.postRender(world, settings);
  }
}
