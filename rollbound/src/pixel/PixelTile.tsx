import { useState, type CSSProperties } from 'react';
import { enemyForTile } from '../core/combat';
import type { TileType } from '../core/types';
import { approxEnemyStats } from '../ui/preview';
import { HERO_FRAMES } from './heroAssets';
import { PIXEL_TILE_META } from './pixelMeta';
import { PixelTileArt } from './PixelTileArt';

interface PixelTileProps {
  chip?: { text: string } | null;
  current?: boolean;
  heroFacing?: 'left' | 'right';
  pos: number;
  primary?: boolean;
  reachable?: boolean;
  heroMoving?: boolean;
  tipBelow?: boolean;
  type: TileType;
  visited?: boolean;
}

// Sprite-arket vender mod højre; spejlvend i venstre-gående slangerækker
export function PixelHero({ facing = 'right', moving = false }: { facing?: 'left' | 'right'; moving?: boolean }) {
  return (
    <span className={`pixel-hero ${moving ? 'is-walking' : ''} ${facing === 'left' ? 'is-facing-left' : ''}`} aria-label="Your hero" role="img">
      <img alt="" className="hero-frame hero-idle-a" draggable={false} src={HERO_FRAMES.idleA} />
      <img alt="" className="hero-frame hero-idle-b" draggable={false} src={HERO_FRAMES.idleB} />
      <img alt="" className="hero-frame hero-walk-a" draggable={false} src={HERO_FRAMES.walkA} />
      <img alt="" className="hero-frame hero-walk-b" draggable={false} src={HERO_FRAMES.walkB} />
    </span>
  );
}

// Face-down-felt uden for synlighed (fog-of-war, 2026-09-03). Typen må ALDRIG
// lækkes her — ingen tile-klasse, meta-label, chip eller enemy-tooltip.
// `depth` = afstand til synlighedskanten; tågen fortættes med afstanden.
export function FacedownTile({ depth, pos }: { depth: number; pos: number }) {
  return (
    <div
      aria-label={`Tile ${pos}: unrevealed`}
      className="pixel-tile pixel-tile-facedown"
      role="listitem"
      style={{ '--fog-depth': depth } as CSSProperties}
    >
      <span className="pixel-tile-number">{pos}</span>
      <span className="pixel-facedown-card" aria-hidden="true" />
    </div>
  );
}

export function PixelTile({ chip, current = false, heroFacing = 'right', heroMoving = false, pos, primary = false, reachable = false, tipBelow = false, type, visited = false }: PixelTileProps) {
  const meta = PIXEL_TILE_META[type];
  const style = { '--tile-accent': meta.color } as CSSProperties;
  // Inspektion (AGENTS.md 2026-09-02): combat-felter viser mob-type og ca. stats
  // via hover/klik/fokus — aldrig en udregnet pris.
  const isCombat = pos > 0 && (type === 'enemy' || type === 'elite' || type === 'boss');
  const enemy = isCombat ? enemyForTile(pos, type) : null;
  const [pinnedTip, setPinnedTip] = useState(false);
  const stateClasses = [
    current ? 'is-current' : '',
    primary ? 'is-primary' : '',
    reachable ? 'is-reachable' : '',
    visited ? 'is-visited' : '',
    isCombat ? 'is-inspectable' : '',
    pinnedTip ? 'is-tip-pinned' : '',
  ].filter(Boolean).join(' ');

  const inspectLabel = enemy ? `, ${enemy.name}: ${approxEnemyStats(enemy)}` : '';

  return (
    <div
      aria-current={current ? 'step' : undefined}
      className={`pixel-tile tile-${type} ${stateClasses}`}
      style={style}
      aria-label={`Tile ${pos}: ${meta.label}${inspectLabel}${chip ? `, ${chip.text}` : ''}${primary ? ', primary destination' : reachable ? ', possible destination with nudge' : visited ? ', visited' : ''}`}
      role="listitem"
      tabIndex={isCombat ? 0 : undefined}
      onClick={isCombat ? () => setPinnedTip(v => !v) : undefined}
      onBlur={isCombat ? () => setPinnedTip(false) : undefined}
      onKeyDown={isCombat ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPinnedTip(v => !v); } } : undefined}
    >
      <span className="pixel-tile-number">{pos === 0 ? 'S' : pos}</span>
      <PixelTileArt type={type} variant={pos} />
      {current ? <PixelHero facing={heroFacing} moving={heroMoving} /> : null}
      {chip ? <span className="pixel-tile-chip">{chip.text}</span> : null}
      <span className="pixel-tile-label">{meta.shortLabel}</span>
      {enemy ? (
        <span className={`pixel-tile-tip ${tipBelow ? 'is-below' : ''}`} role="tooltip">
          <b>{enemy.name}</b>
          <span>{approxEnemyStats(enemy)}</span>
        </span>
      ) : null}
    </div>
  );
}
