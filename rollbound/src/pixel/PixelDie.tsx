const PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

export function PixelDie({ value, rolling = false }: { value: number; rolling?: boolean }) {
  const pips = new Set(PIPS[value] ?? PIPS[1]);
  return (
    <span className={`pixel-die ${rolling ? 'is-rolling' : ''}`} aria-label={`Terning viser ${value}`} role="img">
      {Array.from({ length: 9 }, (_, index) => (
        <i className={pips.has(index) ? 'pip visible' : 'pip'} key={index} />
      ))}
    </span>
  );
}
