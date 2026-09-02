// Fælles fullscreen-scene-skal (beslutning 2026-09-02): combat, loot, treasure,
// shop og level-up renderes alle som takeovers over det stadig-mountede board.
// Skallen ejer baggrund, topbjælke med board-kontekst og enter-transition.

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

interface SceneShellProps {
  accent?: string;
  children: ReactNode;
  className?: string;
  onSceneClick?: () => void;
  subtitle?: string;
  title: string;
}

export function SceneShell({ accent, children, className = '', onSceneClick, subtitle, title }: SceneShellProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      aria-label={title}
      aria-modal="true"
      className={`pixel-scene ${className}`}
      onClick={onSceneClick}
      ref={ref}
      role="dialog"
      style={{ '--scene-accent': accent ?? '#61556f' } as CSSProperties}
      tabIndex={-1}
    >
      <div aria-hidden="true" className="pixel-scene-backdrop" />
      <header className="pixel-scene-top">
        {subtitle ? <small>{subtitle}</small> : null}
        <b>{title}</b>
      </header>
      <div className="pixel-scene-content">{children}</div>
    </div>
  );
}
