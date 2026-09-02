// Genbrugelig HUD-tooltip: hover/fokus viser, klik/Enter fastgør —
// samme inspektionsmønster som boardets combat-felter (pixel-tile-tip),
// men åbner NEDAD, da HUD'en sidder øverst.

import { useState, type KeyboardEvent, type ReactNode } from 'react';

interface HudTipProps {
  children: ReactNode;
  className?: string;
  label: string;
  lines: string[];
}

export function HudTip({ children, className = '', label, lines }: HudTipProps) {
  const [pinned, setPinned] = useState(false);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setPinned(v => !v);
    }
  };

  return (
    <span
      aria-label={`${label}: ${lines.join(' · ')}`}
      className={`pixel-hud-tippable ${pinned ? 'is-tip-pinned' : ''} ${className}`}
      onBlur={() => setPinned(false)}
      onClick={() => setPinned(v => !v)}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
    >
      {children}
      <span className="pixel-hud-tip" role="tooltip">
        <b>{label}</b>
        {lines.map((line, i) => <span key={i}>{line}</span>)}
      </span>
    </span>
  );
}
