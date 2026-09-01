import type { CSSProperties } from 'react';
import type { TileType } from '../core/types';
import { HERO_FRAMES } from './heroAssets';
import { PIXEL_TILE_META } from './pixelMeta';
import { PixelTileArt } from './PixelTileArt';

interface PixelTileProps {
  chip?: { deadly: boolean; text: string } | null;
  current?: boolean;
  pos: number;
  primary?: boolean;
  reachable?: boolean;
  heroMoving?: boolean;
  type: TileType;
  visited?: boolean;
}

export function PixelHero({ moving = false }: { moving?: boolean }) {
  return (
    <span className={`pixel-hero ${moving ? 'is-walking' : ''}`} aria-label="Din helt" role="img">
      <img alt="" className="hero-frame hero-idle-a" draggable={false} src={HERO_FRAMES.idleA} />
      <img alt="" className="hero-frame hero-idle-b" draggable={false} src={HERO_FRAMES.idleB} />
      <img alt="" className="hero-frame hero-walk-a" draggable={false} src={HERO_FRAMES.walkA} />
      <img alt="" className="hero-frame hero-walk-b" draggable={false} src={HERO_FRAMES.walkB} />
    </span>
  );
}

export function PixelTile({ chip, current = false, heroMoving = false, pos, primary = false, reachable = false, type, visited = false }: PixelTileProps) {
  const meta = PIXEL_TILE_META[type];
  const style = { '--tile-accent': meta.color } as CSSProperties;
  const stateClasses = [
    current ? 'is-current' : '',
    primary ? 'is-primary' : '',
    reachable ? 'is-reachable' : '',
    visited ? 'is-visited' : '',
    chip?.deadly ? 'is-deadly' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      aria-current={current ? 'step' : undefined}
      className={`pixel-tile tile-${type} ${stateClasses}`}
      style={style}
      aria-label={`Felt ${pos}: ${meta.label}${chip ? `, ${chip.text}` : ''}${primary ? ', primær destination' : reachable ? ', mulig destination med Nudge' : visited ? ', besøgt' : ''}`}
      role="listitem"
    >
      <span className="pixel-tile-number">{pos === 0 ? 'S' : pos}</span>
      <PixelTileArt type={type} variant={pos} />
      {current ? <PixelHero moving={heroMoving} /> : null}
      {chip ? <span className={`pixel-tile-chip ${chip.deadly ? 'danger' : ''}`}>{chip.text}</span> : null}
      <span className="pixel-tile-label">{meta.shortLabel}</span>
    </div>
  );
}
