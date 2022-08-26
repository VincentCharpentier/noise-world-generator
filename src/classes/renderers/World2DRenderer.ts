import { Settings } from '../../types';
import { getXYFromIndex } from '../../utils/coordinates';
import { TileDef, WorldDefinition } from '../WorldGenerator';
import { Base2DRenderer } from './Base2DRenderer';

export class World2DRenderer extends Base2DRenderer {
  renderTile(tile: TileDef, idx: number, world: WorldDefinition, settings: Settings): void {
    const [x, y] = getXYFromIndex(idx, world.sizeX);

    const { elevation } = tile;

    const color =
      elevation < 0.3
        ? COLOR.DEEP_OCEAN
        : elevation < 0.4
        ? COLOR.SHALLOW_WATER
        : elevation < 0.45
        ? COLOR.SAND
        : elevation < 0.65
        ? COLOR.GRASS
        : elevation < 0.8
        ? COLOR.ROCK
        : COLOR.SNOW;

    this.ctx.fillStyle = color;
    this.ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);

    // this.ctx.fillStyle = 'black';
    // this.ctx.textAlign = 'center';
    // const txtX = x * this.tileSize + this.tileSize / 2;
    // const txtY = y * this.tileSize + this.tileSize * 0.75;
    // this.ctx.fillText(Math.round(tile.elevation * 100).toString(), txtX, txtY);
  }
}

enum COLOR {
  DEEP_OCEAN = '#00f',
  SHALLOW_WATER = '#0af',
  SAND = '#ff8',
  GRASS = '#0A0',
  ROCK = '#888',
  SNOW = '#EEE',
}
