# Rollbound sprite production prompts v1

These prompts produced the first production-oriented pixel-art atlases used by the playable prototype.

## Core tile atlas

```text
Use case: stylized-concept
Asset type: production sprite atlas for Rollbound board tiles
Input images: Image 1 is the approved visual direction mockup. Image 2 is the current playable implementation. Use them only to preserve the established dark-fantasy pixel palette, chunky outlines, readable silhouettes, top-down three-quarter viewpoint, and miniature-diorama feeling. Create original sprite art.
Primary request: Create one transparent-background sprite atlas arranged as a strict 3-column by 2-row grid with six equally sized cells and generous transparent padding inside every cell. The cells must contain, in reading order:
1. Blank road variation A: dark stone path, one square rock, two tiny tufts of muted green grass.
2. Blank road variation B: cracked dark flagstone, small broken pillar, sparse roots.
3. Blank road variation C: worn dark road, two uneven stones, tiny purple mushroom.
4. Combat: crossed short swords above cracked dark red earth, a subtle goblin-eye silhouette behind them.
5. Camp: small brown triangular tent, bright orange stepped-pixel campfire, two crossed logs, a few dark green grass pixels.
6. Camp variation: bedroll and small cooking pot beside a smaller orange fire.
Style/medium: authentic hand-authored 16-bit pixel art, as though every sprite was designed inside a 48x48 pixel cell, then enlarged with nearest-neighbor scaling. Hard square pixel clusters, limited palette, two-pixel dark-plum outline, no antialiasing, no smooth curves, no painterly rendering.
Composition/framing: exact orthographic three-quarter board-tile dioramas, each object centered and occupying about 70 percent of its cell. Every cell isolated; nothing crosses cell boundaries.
Color palette: near-black plum #0B0712, dark plum #17111F, slate #61556F, muted green #405237, combat red #FF3B4D, camp green #39FF88, fire orange #FFB52E, ivory highlight #FFF2DF.
Constraints: genuinely transparent background; no outer tile frames, no neon borders, no labels, no letters, no numbers, no grid lines, no shadows outside each sprite, no UI, no characters, no watermark. Keep all six sprites at identical scale and viewpoint.
```

### Alpha extraction pass

```text
Use case: background-extraction
Asset type: production pixel-art sprite atlas
Input images: Image 1 is the exact sprite atlas to preserve.
Primary request: Remove only the white and pale-gray background and make it genuinely transparent, including all empty space between the six sprites. Preserve every sprite exactly in its current position, scale, pixel shape, palette, 3-column by 2-row arrangement, and 1536:1024 canvas ratio.
Constraints: change only the background to true alpha transparency; keep the six pixel-art tile dioramas unchanged; preserve hard pixel edges with no halos; no cropping; no resizing; no rearranging; no new objects; no frames; no text; no watermark.
```

## Hero animation strip

```text
Use case: stylized-concept
Asset type: production character animation sprite strip for Rollbound
Input images: Image 1 is the approved game UI mockup and contains the small hooded adventurer design. Image 2 is the approved production tile atlas and defines exact pixel density, dark-plum outline, palette, lighting, and three-quarter viewpoint. Create an original hero matching that established world.
Primary request: Create one genuinely transparent-background horizontal sprite strip arranged as a strict 4-column by 1-row grid with four equally sized cells. Every cell contains the exact same small hooded adventurer at identical scale, anchor position, proportions, palette, and three-quarter top-down facing direction. Frames in reading order:
1. Idle A: neutral stance.
2. Idle B: body raised by one source pixel, cloak hem slightly shifted.
3. Walk A: left foot forward, right arm slightly forward.
4. Walk B: right foot forward, left arm slightly forward.
Subject: compact mysterious traveler in a deep purple hood and short cloak, small warm-tan face visible in the hood, ivory pixel eyes, dark boots, no weapon, no shield, no extra equipment.
Style/medium: authentic hand-authored 16-bit pixel sprite designed inside a 32x48 source-pixel bounding box and enlarged with nearest-neighbor scaling; hard square pixel clusters; limited palette; two-pixel near-black plum outline; no antialiasing; no smooth rendering.
Composition/framing: full body visible, centered in each cell, same baseline and silhouette width in all four frames, generous transparent padding, nothing crosses cell boundaries.
Color palette: near-black plum #0B0712, outline #17111F, cloak purple #4E276B and #5F337E, face #D99A6C, ivory #FFF2DF.
Constraints: true alpha transparency; no ground, no shadow, no tile, no frame, no labels, no numbers, no grid lines, no text, no UI, no weapon, no background glow, no watermark. Character identity and proportions must not change between frames.
```

### Alpha extraction pass

```text
Use case: background-extraction
Asset type: production character animation sprite strip
Input images: Image 1 is the exact four-frame hero animation strip to preserve.
Primary request: Remove only the white and pale checkerboard background and make it genuinely transparent across the entire strip, including all empty space around and between the four character frames. Preserve each hero exactly in its current position, size, baseline, palette, pixel shape, and 4-column by 1-row order.
Constraints: change only the background to true alpha transparency; preserve hard pixel edges with no white halos; no cropping; no resizing; no frame movement; no redesign; no added glow, shadow, ground, text, grid, UI, or watermark.
```
