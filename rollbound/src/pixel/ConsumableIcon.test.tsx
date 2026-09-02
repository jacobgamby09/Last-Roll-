import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { ConsumableIcon } from './ConsumableIcon';

vi.mock('./consumableAssets', () => ({
  CONSUMABLE_ASSETS: {
    bomb: { id: 'bomb', name: 'Bombe', alt: 'En jernbombe', src: '/bomb-test.png' },
  },
}));

describe('ConsumableIcon presentation contract', () => {
  it('renders mapped item art with a stable semantic ID', () => {
    const html = renderToStaticMarkup(<ConsumableIcon assetId="bomb" size="hud" />);
    expect(html).toContain('data-consumable-asset-id="bomb"');
    expect(html).toContain('size-hud');
    expect(html).toContain('src="/bomb-test.png"');
    expect(html).not.toContain('pixel-consumable-glyph');
  });

  it('keeps the original effect-family glyph as an explicit missing-art fallback', () => {
    const html = renderToStaticMarkup(<ConsumableIcon assetId="smoke-bomb" />);
    expect(html).toContain('is-missing');
    expect(html).toContain('pixel-consumable-glyph');
    expect(html).toContain('☁');
    expect(html).not.toContain('<img');
  });

  it('hides decorative art but names standalone art, including fallbacks', () => {
    const decorative = renderToStaticMarkup(<ConsumableIcon assetId="bomb" />);
    const named = renderToStaticMarkup(<ConsumableIcon assetId="smoke-bomb" decorative={false} />);
    expect(decorative).toContain('aria-hidden="true"');
    expect(decorative).not.toContain('role="img"');
    expect(named).toContain('role="img"');
    expect(named).toContain('aria-label="Røgbombe"');
  });
});
