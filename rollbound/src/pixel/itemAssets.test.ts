import { describe, expect, it } from 'vitest';
import { CONSUMABLES, ITEMS } from '../core/items';
import { CONSUMABLE_ASSETS } from './consumableAssets';
import { EQUIPMENT_ASSETS } from './equipmentAssets';

describe('item icon batch coverage', () => {
  it('maps all 30 gear definitions with matching identities and slots', () => {
    expect(Object.keys(EQUIPMENT_ASSETS).sort()).toEqual(Object.keys(ITEMS).sort());
    for (const item of Object.values(ITEMS)) {
      const asset = EQUIPMENT_ASSETS[item.id];
      expect(asset).toMatchObject({ id: item.id, name: item.name, kind: item.slot });
      expect(asset?.src).toBeTruthy();
      expect(asset?.alt).toBeTruthy();
    }
  });

  it('maps all 12 consumables without pending icons', () => {
    // The buff-icon batch completes the catalog. Any unmapped item now fails.
    const pendingIcons: string[] = [];
    const unmapped = Object.keys(CONSUMABLES).filter(id => !(id in CONSUMABLE_ASSETS)).sort();
    expect(unmapped).toEqual(pendingIcons.sort());
    for (const item of Object.values(CONSUMABLES)) {
      if (pendingIcons.includes(item.id)) continue;
      const asset = CONSUMABLE_ASSETS[item.id];
      expect(asset).toMatchObject({ id: item.id, name: item.name });
      expect(asset?.src).toContain('/consumables/');
      expect(asset?.alt).toBeTruthy();
    }
  });

  it('uses a distinct bitmap URL for every item', () => {
    const urls = [...Object.values(EQUIPMENT_ASSETS), ...Object.values(CONSUMABLE_ASSETS)]
      .map(asset => asset?.src);
    expect(new Set(urls).size).toBe(Object.keys(ITEMS).length + Object.keys(CONSUMABLES).length);
  });
});
