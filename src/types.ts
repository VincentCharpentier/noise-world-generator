export enum RENDER_TYPE {
  HEIGHTMAP,
  ISOMETRIC,
  FLAT_2D,
}

export interface Settings {
  // Seed for world generation
  seed: number;

  // Type of world renderer
  renderType: RENDER_TYPE;

  amplitude: number; // iso render max height

  // Perlin noise smoothness (zoom)
  smoothness: number;

  // Zoom level => Cell size (px)
  // ! => change number of cells rendered
  cameraZoom: number;

  // Camera Position / what to render
  cameraX: number;
  cameraY: number;

  // HEIGHTMAP only : Show / Hide perlin vertices
  hmShowVertex: boolean;
}
