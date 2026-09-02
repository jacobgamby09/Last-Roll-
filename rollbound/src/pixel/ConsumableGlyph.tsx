import { CONSUMABLES } from '../core/items';
import type { ConsumableId } from '../core/types';

// Glyf-placeholder pr. effekt-familie, indtil consumable-ikoner produceres
const CONSUMABLE_GLYPHS: Record<string, string> = {
  heal: '⚗', bomb: '✷', flee: '☁', permDmg: '▲', grant: '✦', gold: '¤', twinRoll: '⚄', teleport: '➹',
};

export function ConsumableGlyph({ id }: { id: ConsumableId }) {
  return (
    <span aria-hidden="true" className="pixel-consumable-glyph">
      {CONSUMABLE_GLYPHS[CONSUMABLES[id].effect.kind] ?? '·'}
    </span>
  );
}
