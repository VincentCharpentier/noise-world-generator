import { TILE_TYPE } from '../constants/tiles';
import { Settings } from '../types';
import { getXYFromIndex } from '../utils/coordinates';
import { PerlinNoise } from '../utils/perlin';

export interface TileDef {
  elevation: number;
}

export interface WorldDefinition {
  sizeX: number;
  sizeY: number;
  tiles: Array<TileDef>;
  meta: {
    vertexes?: typeof perlinNoise.gradients;
  };
}

const perlinNoise = new PerlinNoise();

class CombinedPerlinNoise {
  #scale: number;
  #octaves: number;
  #lacunarity: number;
  #persistence: number;

  /**
   * @param scale number that determines at what distance to view the noisemap.
   * @param octaves the number of levels of detail you want you perlin noise to have.
   * @param lacunarity number that determines how much detail is added or removed at each octave (adjusts frequency).
   * @param persistence number that determines how much each octave contributes to the overall shape (adjusts amplitude).
   */
  constructor(scale: number, octaves: number, lacunarity: number, persistence: number) {
    this.#scale = scale;
    this.#octaves = octaves;
    this.#lacunarity = lacunarity;
    this.#persistence = persistence;
  }

  /*
float EvaluateFBM(float x, float y, 
                  float amplitude, float frequency,
                  int octaveCount, float persistence, float lacunarity) {

    float value = 0;

    for (int i = 0; i < octaveCount; i++) {
        value += amplitude * EvaluateNoise(x * frequency, y * frequency);
        amplitude *= persistence;
        frequency *= lacunarity;
    }

    return value;
}
   */

  get(x: number, y: number): number {
    let value = 0;
    let frequency = this.#scale;
    let amplitude = 1;

    for (let i = 0; i < this.#octaves; i++) {
      const noise = perlinNoise.get(x * frequency, y * frequency);
      value += amplitude * noise;
      amplitude *= this.#persistence;
      frequency *= this.#lacunarity;
    }

    return (value + 1) / 2;
  }
}

export function generateWorld(sizeX: number, sizeY: number, settings: Settings) {
  const perlinCellSize = settings.smoothness + 0.5;

  const noise = new CombinedPerlinNoise(4, 4, 2, 0.5);

  const world: WorldDefinition = {
    sizeX,
    sizeY,
    // WORLD GENERATION
    // tiles: new Array(sizeX * sizeY).fill(null).map((_, idx) => {
    //   const [x, y] = getXYFromIndex(idx, sizeX);
    //   const noisePosX = (x + settings.cameraX) / sizeX;
    //   const noisePosY = (y + settings.cameraY) / sizeY;
    //   const value = noise.get(noisePosX, noisePosY);
    //   const elevation = value;
    //   return { elevation };
    // }),
    tiles: new Array(sizeX * sizeY).fill(null).map((_, idx) => {
      const [x, y] = getXYFromIndex(idx, sizeX);
      const noisePosX = (x + settings.cameraX) / perlinCellSize;
      const noisePosY = (y + settings.cameraY) / perlinCellSize;
      // Noise is [-1;1] => convert to [0;1]
      const value = (perlinNoise.get(noisePosX, noisePosY) + 1) / 2;
      const elevation = value;
      return { elevation };
    }),
    meta: {},
  };
  if (settings.hmShowVertex) {
    world.meta.vertexes = perlinNoise.gradients;
  }

  const elevations = world.tiles.map(({ elevation }) => elevation);
  console.log(Math.min(...elevations), Math.max(...elevations));

  return world;
}
