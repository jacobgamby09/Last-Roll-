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
  elixir: 'En lille flaske med helbredende eliksir',
  'grand-elixir': 'En stor, rigt udsmykket eliksirflaske',
  bomb: 'En rund jernbombe med lunte',
  'thunder-flask': 'En kolbe med cyan lynmotiv',
  'smoke-bomb': 'En røgbombe i dæmpede røgfarver',
  whetstone: 'En slidt slibesten',
  'fate-stone': 'En violet skæbnesten',
  'gold-pouch': 'En snøret læderpose med guld',
  'fate-die': 'En terning med skæbnens farvede pixel-highlights',
  'teleport-scroll': 'En pergamentrulle med runemotiv',
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
