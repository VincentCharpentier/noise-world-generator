import clsx from 'clsx';
import React, { useEffect } from 'react';
import { generateWorld, WorldDefinition } from '../../classes/WorldGenerator';
import { HeightMapRenderer, IsoWorldRenderer, WorldRendererFactory } from '../../classes/renderers';
import { SettingsContext } from '../../contexts/SettingsContext';
import { RENDER_TYPE, Settings } from '../../types';
import { useKeyboardNav } from '../../utils/useKeyboardNav';
import './WorldMap.scss';
import { World2DRenderer } from '../../classes/renderers/World2DRenderer';
import { BaseRenderer } from '../../classes/renderers/BaseRenderer';

interface MapProps {
  className: string;
}

type WorldRendererClass = WorldRendererFactory & {
  getWorldSize(
    settings: Settings,
    canvasHeight: number,
    canvasWidth: number,
  ): [worldSizeX: number, worldSizeY: number];
};

const RENDERER_MAP = new Map<RENDER_TYPE, WorldRendererClass>([
  [RENDER_TYPE.HEIGHTMAP, HeightMapRenderer],
  [RENDER_TYPE.ISOMETRIC, IsoWorldRenderer],
  [RENDER_TYPE.FLAT_2D, World2DRenderer],
]);

function setCanvasSizeToParent(canvas: HTMLCanvasElement) {
  canvas.setAttribute('height', String(canvas.parentElement?.offsetHeight ?? 0));
  canvas.setAttribute('width', String(canvas.parentElement?.offsetWidth ?? 0));
}

function usePrevValue<T>(someValue: T): T {
  const prevValue = React.useRef(someValue);
  useEffect(() => {
    return () => {
      prevValue.current = someValue;
    };
  }, [someValue]);

  return prevValue.current;
}

export const WorldMap: React.FC<MapProps> = ({ className }) => {
  const { settings, updateSettings } = React.useContext(SettingsContext);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const worldRenderer = React.useRef<WorldRendererClass>();
  const world = React.useRef<WorldDefinition>();
  const animFrameRequest = React.useRef(0);

  useKeyboardNav();

  React.useEffect(() => {
    animFrameRequest.current = requestAnimationFrame(() => {
      if (canvasRef.current !== null) {
        const rendererClass = RENDERER_MAP.get(settings.renderType);
        if (!rendererClass) {
          console.error('No renderer for render type', settings.renderType);
          return;
        }

        setCanvasSizeToParent(canvasRef.current);

        const { clientWidth, clientHeight } = canvasRef.current;

        const [worldSizeX, worldSizeY] = rendererClass.getWorldSize(
          settings,
          clientHeight,
          clientWidth,
        );
        worldRenderer.current = rendererClass;

        const renderer = new rendererClass(canvasRef.current);

        const world = generateWorld(worldSizeX, worldSizeY, settings);

        renderer.load().then(() => {
          renderer.render(world, settings);
        });
      }
    });
    return () => cancelAnimationFrame(animFrameRequest.current);
  }, [settings]);

  return (
    <div className={clsx(className, 'mapContainer')}>
      <canvas ref={canvasRef} />
    </div>
  );
};
