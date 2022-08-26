export enum TILE_TYPE {
  DIRT,
  GRASS,
  GRASS_CORNER,
  WATER,
}

const generateFileName = (baseName: string) => `${baseName}_N.png`;

export const TILES: Record<TILE_TYPE, string> = {
  [TILE_TYPE.DIRT]: generateFileName('dirt_center'),
  [TILE_TYPE.GRASS]: generateFileName('grass_center'),
  [TILE_TYPE.GRASS_CORNER]: generateFileName('grass_corner'),
  [TILE_TYPE.WATER]: generateFileName('water_center'),
};
