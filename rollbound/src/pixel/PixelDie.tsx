import dieBody from '../assets/pixel/dice/die-body-v1.png';

const PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

export type DiceRollStage = 'idle' | 'anticipation' | 'tumble' | 'impact';

export interface DiceRollFx {
  stage: DiceRollStage;
  value: number;
}

export function PixelDie({ value, rolling = false }: { value: number; rolling?: boolean }) {
  const pips = new Set(PIPS[value] ?? PIPS[1]);
  return (
    <span
      aria-hidden={rolling || undefined}
      aria-label={rolling ? undefined : `Die shows ${value}`}
      className={`pixel-die ${rolling ? 'is-rolling' : ''}`}
      data-value={value}
      role={rolling ? undefined : 'img'}
    >
      <img alt="" aria-hidden="true" draggable="false" src={dieBody} />
      <span className="pixel-die-pips" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => (
          <i className={pips.has(index) ? 'pip visible' : 'pip'} key={index} />
        ))}
      </span>
    </span>
  );
}
