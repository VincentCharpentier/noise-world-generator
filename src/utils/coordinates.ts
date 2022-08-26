export const getXYFromIndex = (idx: number, sizeX: number): [x: number, y: number] => {
  const x = idx % sizeX;
  const y = Math.floor(idx / sizeX);
  return [x, y];
};

export const getIndexFromXY = (x: number, y: number, sizeX: number) => y * sizeX + x;
