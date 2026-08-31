import type { GameState } from '../core/types';

export function LogView({ state }: { state: GameState }) {
  const entries = state.log.slice(-9).reverse();
  return (
    <div className="log">
      {entries.map((e, i) => (
        <div key={state.log.length - i} className={`log-line log-${e.kind} ${i === 0 ? 'log-newest' : ''}`}>
          {e.text}
        </div>
      ))}
    </div>
  );
}
