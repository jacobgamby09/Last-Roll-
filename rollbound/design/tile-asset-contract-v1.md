# Rollbound tile asset contract v1

## Runtime contract

- Logical board cell / hitbox: `88 × 88` CSS pixels.
- Visible art viewport: `82 × 82` CSS pixels with no visible rectangular tile shell.
- Normalized source canvas: `64 × 64` RGBA with genuine alpha transparency.
- Normal tile art is fitted inside a maximum `48 × 48` visible bounding box and shares a bottom baseline around source `y = 60`.
- Boss is the deliberate size exception: maximum `56 × 56`, with its bottom baseline around source `y = 62`.
- Individual source assets use a square transparent canvas and are rendered with `object-fit: contain`.
- Hero frames use a `2:3` transparent canvas and share a fixed foot baseline.
- The diorama asset is the visible tile; the logical cell remains only as the path anchor and interaction hitbox.
- Category color is carried by restrained platform pixels plus CSS underglow. Labels, chips and selection states belong to CSS rather than the bitmap.
- Selection outlines trace the diorama silhouette with CSS `drop-shadow`; do not draw a rectangular selection frame into assets.
- Blank / Road dioramas remain fully present and readable before and after the hero passes them. Visited-state desaturation must never fade Road art into the background.
- Connections are a presentation-only trail of separated, irregular dark pixel stones behind the dioramas. Do not reintroduce a solid gray bar or bake path pieces into tile assets.
- Upcoming, traveled and actively moving trail segments may use slightly different plum-stone values, but the trail stays subordinate to tile silhouettes and category colors.
- Missing generated assets must show the magenta `ASSET FEJL` fallback.

## Current generated tile set

- Blank A, Blank B, Blank C
- Combat
- Camp tent, Camp bedroll
- Gold
- Treasure
- Shop
- Event
- Elite
- Trap
- Boss

The current manifest therefore contains 13 assets: three Blank variants, two Camp variants, and one asset for each of the remaining eight tile families. Every board tile family is covered by a bitmap asset; there are no runtime CSS-art placeholders.

## Normalization step

ImageGen output is source material, not a runtime-ready file. After generation and any alpha pass:

1. Find the non-transparent pixel bounding box.
2. Scale it down with nearest-neighbor sampling to the size limits above.
3. Center it horizontally on a fresh transparent `64 × 64` canvas.
4. Align the bottom of the art to the shared baseline.
5. Preserve hard pixel edges and save as versioned RGBA PNG.

This normalization step is authoritative when a generated composition does not land on the requested scale or baseline. Do not compensate for inconsistent source sizes in React or CSS.

## Tile extraction prompt template

Built-in ImageGen was used once per asset. The source selector was changed for Blank A, Blank B, Blank C, Combat, Camp tent, and Camp bedroll.

```text
Use case: background-extraction
Asset type: individual normalized Rollbound tile sprite — <NAME>
Input images: Image 1 is the source atlas. Extract only <SOURCE CELL AND SUBJECT>.
Primary request: Isolate that exact existing diorama as one standalone sprite on a genuinely transparent square canvas. Preserve its pixel-art design, palette, objects, proportions, chunky hard edges, and three-quarter viewpoint. Center its visual bounding box horizontally. Place the bottom edge of the stone platform on a baseline at 82 percent of canvas height. Scale the complete diorama to occupy exactly about 78 percent of canvas width and no more than 66 percent of canvas height, with generous transparent padding on every side.
Constraints: one sprite only; true alpha transparency; no black glow, haze, shadow, checkerboard, background, border, tile frame, label, grid, UI, added object, removed object, redesign, antialiasing, text, or watermark; square 1:1 canvas.
```

## New tile generation prompt template

Built-in ImageGen is used once per distinct tile asset, with the existing Combat, Camp and Blank assets supplied as style references.

```text
Use case: stylized-concept
Asset type: individual Rollbound board tile sprite — <NAME>
Input images: Images 1–3 are style, scale, perspective, platform, palette, and pixel-edge references only.
Primary request: Create one compact <SUBJECT> resting on an irregular dark stone platform with restrained <CATEGORY COLOR> edge highlights integrated into the pixels.
Style/medium: compact 16-bit pixel-art diorama with hard square pixel edges, limited dark fantasy palette, readable silhouette, and the same three-quarter viewpoint and visual density as the references.
Composition/framing: one centered standalone diorama on a square genuinely transparent canvas; platform baseline at 82 percent of canvas height; complete diorama occupies about 78 percent of canvas width and no more than 66 percent of canvas height.
Constraints: exactly one sprite; true alpha transparency; no background, checkerboard, rectangle, card, border, UI frame, label, text, number, icon badge, external glow, haze, antialiasing, watermark, extra objects, or cropped pixels.
```

## Tile alpha-pass prompt template

```text
Use case: background-extraction
Asset type: individual normalized Rollbound tile sprite — <NAME>
Input images: Image 1 is the exact standalone sprite and is the edit target.
Primary request: Remove only the pale white-and-gray checkerboard background and convert all space outside the complete diorama to genuine alpha transparency.
Constraints: preserve the complete pixel-art diorama exactly in its current position, scale, design, palette, and square canvas; preserve hard pixel edges; no pale halos; change only the background; no cropping; no resizing; no movement; no redesign; no added or removed objects; no glow or shadow outside the diorama; no text; no UI; no watermark.
```

## Hero extraction prompt template

Built-in ImageGen was used once per frame for Idle A, Idle B, Walk A, and Walk B.

```text
Use case: background-extraction
Asset type: individual normalized Rollbound hero frame — <NAME>
Input images: Image 1 is the source four-frame hero strip. Extract only <SOURCE FRAME AND POSE>.
Primary request: Isolate that exact existing purple-hooded hero pose as one standalone sprite on a genuinely transparent 2:3 portrait canvas. Preserve character identity, pose, proportions, palette, pixel shape, hard edges, and three-quarter facing direction. Center the visible character horizontally. Place both feet on a baseline at 88 percent of canvas height. Scale the complete visible character to occupy about 72 percent of canvas width and 78 percent of canvas height, with transparent padding on every side.
Constraints: one character only; true alpha transparency; no checkerboard, black background, glow, ground, shadow, tile, frame, UI, weapon, text, redesign, added or removed details, antialiasing, or watermark; exact 2:3 portrait canvas.
```

## Hero alpha-pass prompt template

```text
Use case: background-extraction
Asset type: individual normalized Rollbound hero frame — <NAME>
Input images: Image 1 is the exact standalone hero frame and is the edit target.
Primary request: Remove only the pale white-and-gray checkerboard background and convert all space outside the complete hero to genuine alpha transparency.
Constraints: preserve the hero exactly in the current position, scale, pose, identity, palette, hard pixel edges, and 1024:1536 portrait canvas; change only the background; no halos; no cropping; no resizing; no movement; no redesign; no ground, glow, shadow, tile, text, UI, or watermark.
```

## QA routes

- `?ui=tiles` displays all tile families, both Camp variants, both destination-card sizes, the hero anchor, safe-area guides, and manifest coverage.
- `?ui=classic` keeps the original prototype UI available.
