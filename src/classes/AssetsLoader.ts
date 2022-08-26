import { TILES, TILE_TYPE } from '../constants/tiles';

export async function getAllTiles() {
  return Object.fromEntries(
    await Promise.all(
      Object.entries(TILES).map(
        ([tileType, fileName]) =>
          new Promise<[string, HTMLImageElement]>((r) => {
            import(`../../assets/Tiles/${fileName}`).then(({ default: base64 }) => {
              const img = new Image();
              img.src = base64;
              r([tileType, img]);
            });
          }),
      ),
    ),
  );
}
