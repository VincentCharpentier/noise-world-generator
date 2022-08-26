const getKey = (x: number, y: number) => [x, y].join(',');

export class PerlinNoise {
  gradients = new Map<string, { x: number; y: number; t: number }>();
  memory = new Map<string, number>();

  #randomGradient(ix: number, iy: number) {
    // No precomputed gradients mean this works for any number of grid coordinates
    const w = 64; // sizeof number in JS
    const s = w / 2; // rotation width
    let a = ix,
      b = iy;
    a *= 3284157443;
    b ^= (a << s) | (a >> (w - s));
    b *= 1911520717;
    a ^= (b << s) | (b >> (w - s));
    a *= 2048419325;
    const random = a % (2 * Math.PI); // in [0, 2*Pi]
    const v = { x: Math.cos(random), y: Math.sin(random), t: random };
    return v;
  }

  #dotProdGrid(x: number, y: number, vx: number, vy: number) {
    let gVect;
    const dVect = { x: x - vx, y: y - vy };
    const memGrad = this.gradients.get(getKey(vx, vy));
    // console.log('LOOK AT', vx, vy);
    if (memGrad !== undefined) {
      gVect = memGrad;
    } else {
      gVect = this.#randomGradient(vx, vy);
      this.gradients.set(getKey(vx, vy), gVect);
    }
    return dVect.x * gVect.x + dVect.y * gVect.y;
  }
  #smootherstep(x: number): number {
    return 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
  }
  #interp(x: number, a: number, b: number) {
    return a + this.#smootherstep(x) * (b - a);
  }
  get(x: number, y: number): number {
    const memValue = this.memory.get(getKey(x, y));
    if (memValue !== undefined) {
      return memValue;
    }
    // console.log('GET', x, y);
    const xFloored = Math.floor(x);
    const yFloored = Math.floor(y);
    // interpolate
    const topLeft = this.#dotProdGrid(x, y, xFloored, yFloored);
    const topRight = this.#dotProdGrid(x, y, xFloored + 1, yFloored);
    const bottomLeft = this.#dotProdGrid(x, y, xFloored, yFloored + 1);
    const bottomRight = this.#dotProdGrid(x, y, xFloored + 1, yFloored + 1);

    const xTop = this.#interp(x - xFloored, topLeft, topRight);
    const xBottom = this.#interp(x - xFloored, bottomLeft, bottomRight);
    const value = this.#interp(y - yFloored, xTop, xBottom);
    this.memory.set(getKey(x, y), value);
    return value;
  }
}
