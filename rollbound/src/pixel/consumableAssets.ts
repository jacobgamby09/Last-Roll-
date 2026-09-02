import { CONSUMABLES } from '../core/items';
import type { ConsumableId } from '../core/types';

export interface ConsumableAsset {
  alt: string;
  id: ConsumableId;
  name: string;
  src: string;
}

// Explicit ID/version allowlist: adding a PNG alone never changes item mapping.
// Missing files are deliberately omitted so ConsumableIcon renders the glyph.
// Partial: 'armor-solder' og 'wool-lining' (item-buff-batchen 2026-09-02)
// afventer ikoner og bruger glyf-fallback indtil da.
const ART_DESCRIPTIONS: Partial<Record<ConsumableId, string>> = {
  elixir: 'A small bottle of healing elixir',
  'grand-elixir': 'A large, richly ornamented elixir bottle',
  bomb: 'A round iron bomb with a fuse',
  'thunder-flask': 'A flask with a cyan lightning motif',
  'smoke-bomb': 'A smoke bomb in muted smoky colors',
  whetstone: 'A worn whetstone',
  'fate-stone': 'A violet fate stone',
  'gold-pouch': 'A drawstring leather pouch of gold',
  'fate-die': 'A die with fate-colored pixel highlights',
  'teleport-scroll': 'A parchment scroll with a rune motif',
};

const sources = import.meta.glob<string>('../assets/pixel/consumables/*-v1.png', {
  eager: true,
  import: 'default',
  query: '?url',
});

export const CONSUMABLE_ASSETS: Partial<Record<ConsumableId, ConsumableAsset>> = {};

for (const id of Object.keys(ART_DESCRIPTIONS) as ConsumableId[]) {
  const src = sources[`../assets/pixel/consumables/${id}-v1.png`];
  const alt = ART_DESCRIPTIONS[id];
  if (src && alt) {
    CONSUMABLE_ASSETS[id] = { id, src, name: CONSUMABLES[id].name, alt };
  }
}
