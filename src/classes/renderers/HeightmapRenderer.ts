import { Settings } from '../../types';
import { getXYFromIndex } from '../../utils/coordinates';
import { TileDef, WorldDefinition } from '../WorldGenerator';
import { Base2DRenderer } from './Base2DRenderer';

export class HeightMapRenderer extends Base2DRenderer {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }

  renderTile(tile: TileDef, idx: number, world: WorldDefinition, settings: Settings): void {
    const [x, y] = getXYFromIndex(idx, world.sizeX);

    const greyValue = Math.round(255 * tile.elevation).toString(16);

    this.ctx.fillStyle = '#' + greyValue.repeat(3);
    this.ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
  }
}
