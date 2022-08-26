import { TILE_TYPE } from '../../constants/tiles';
import { Settings } from '../../types';
import { getIndexFromXY, getXYFromIndex } from '../../utils/coordinates';
import { getAllTiles as getAllTileImages } from '../AssetsLoader';
import { TileDef, WorldDefinition } from '../WorldGenerator';
import { BaseRenderer } from './BaseRenderer';

const SOURCE_X = 12;
const SOURCE_Y = 129;
const SOURCE_WIDTH = 242 - SOURCE_X;
const SOURCE_HEIGHT = 347 - SOURCE_Y;
const SOURCE_CROP: [number, number, number, number] = [
  SOURCE_X,
  SOURCE_Y,
  SOURCE_WIDTH,
  SOURCE_HEIGHT,
];
const SOURCE_ASPECT_RATIO = SOURCE_HEIGHT / SOURCE_WIDTH;

const TILE_SRC_W_GAP = 110;
const TILE_SRC_H_GAP = 52;
const BASE_TILE_WIDTH = 16;
// Zoom = cell render size (px)
export const MIN_ZOOM = 10; // = max zoom out
export const MAX_ZOOM = 50; // = max zoom in

const DEBUG_COORDS = false;
const DEBUG_PERLIN = false;

const convertElevation = (elevation: number, settings: Settings) =>
  Math.floor(elevation * (1 + settings.amplitude));

const getTileWidth = (cameraZoom: number) => MIN_ZOOM + cameraZoom * (MAX_ZOOM - MIN_ZOOM);

export class IsoWorldRenderer extends BaseRenderer {
  tileImgs: { [tileType: string]: HTMLImageElement } = {};

  static getWorldSize(
    settings: Settings,
    canvasHeight: number,
    canvasWidth: number,
  ): [worldSizeX: number, worldSizeY: number] {
    const tileWidth = MIN_ZOOM + settings.cameraZoom * (MAX_ZOOM - MIN_ZOOM);

    const worldSize = Math.round(Math.max(canvasHeight / tileWidth, canvasWidth / tileWidth));

    return [worldSize, worldSize];
  }

  async load() {
    this.tileImgs = await getAllTileImages();
  }

  getTileImg(tileType: TILE_TYPE) {
    const img = this.tileImgs[tileType];
    if (!img) {
      console.error('No image for this tile type', tileType);
      return null;
    }
    return img;
  }

  render(world: WorldDefinition, settings: Settings) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // const tileWidth = camera.zoom * BASE_TILE_WIDTH;
    const tileWidth = MIN_ZOOM + settings.cameraZoom * (MAX_ZOOM - MIN_ZOOM);
    const tileHeight = tileWidth * SOURCE_ASPECT_RATIO;

    const scaleRatio = tileWidth / SOURCE_WIDTH;
    const hGap = scaleRatio * TILE_SRC_H_GAP;
    const wGap = scaleRatio * TILE_SRC_W_GAP;

    // center camera
    const camOffsetX = this.canvas.width / 2;
    const camOffsetY = this.canvas.height / 3 - (hGap * world.sizeY) / 2;

    const getRenderXYFromCoords = (
      x: number,
      y: number,
      elevation: number,
    ): [destX: number, destY: number] => {
      const rX = x;
      const rY = y;
      return [
        camOffsetX + (rX - rY) * wGap,
        camOffsetY + (rY + rX + 2 * elevation) * hGap - elevation * tileHeight,
      ];
    };

    world.tiles.forEach((tile, idx) => {
      const [x, y] = getXYFromIndex(idx, world.sizeX);

      const renderHeight = convertElevation(tile.elevation, settings);

      const tileNextIdx = getIndexFromXY(x, y + 1, world.sizeX);
      const tileNextElevation = convertElevation(
        world.tiles[tileNextIdx]?.elevation ?? 0,
        settings,
      );

      const tileBelowElevation =
        x === world.sizeX - 1
          ? 0
          : convertElevation(
              world.tiles[getIndexFromXY(x + 1, y, world.sizeX)]?.elevation ?? 0,
              settings,
            );
      const drawFromElevation = Math.min(tileBelowElevation, tileNextElevation);

      // draw terrain under
      const underImg = this.getTileImg(TILE_TYPE.DIRT);

      if (underImg) {
        for (let i = drawFromElevation; i < renderHeight; i++) {
          const [destX, destY] = getRenderXYFromCoords(x, y, i);
          this.ctx.drawImage(underImg, ...SOURCE_CROP, destX, destY, tileWidth, tileHeight);
        }
      }

      // draw final tile
      const tileType =
        tile.elevation * (1 + settings.amplitude) < 0.8 ? TILE_TYPE.WATER : TILE_TYPE.GRASS;
      const tileImg = this.getTileImg(tileType);
      const [destX, destY] = getRenderXYFromCoords(x, y, renderHeight);
      if (tileImg !== null) {
        this.ctx.drawImage(tileImg, ...SOURCE_CROP, destX, destY, tileWidth, tileHeight);
      }

      // debug with coordinates
      if (DEBUG_COORDS) {
        this.ctx.textAlign = 'center';
        const txtX = destX + tileWidth / 2;
        const txtY = destY + hGap;
        this.ctx.fillText(x + ',' + y + ',' + renderHeight, txtX, txtY);
        this.ctx.fillText(`(${idx.toString()})`, txtX, txtY + 10);
      }

      if (DEBUG_PERLIN) {
        this.ctx.textAlign = 'center';
        const txtX = destX + tileWidth / 2;
        const txtY = destY + hGap;
        this.ctx.fillText(tile.elevation.toFixed(2), txtX, txtY);
      }
    });
  }
}
