# Armor icon batch v1

Date: 2026-09-02. Built-in ImageGen mode, one call per distinct icon. No CLI/API fallback.

## References and production contract

`worn-plate-v1.png` and `cloth-shirt-v1.png` were inspected and supplied as style/pixel-density references, never as edit targets. All new icons follow `equipment-asset-contract-v1.md`: 48 × 48 RGBA, binary alpha, maximum 36 × 36 visible silhouette, horizontally centered, bottom-exclusive baseline 42. No platform, background, UI text, glow or runtime equipment rules are baked into the images.

Original generations remain in `.codex/generated_images`; project-bound normalized icons live in `src/assets/pixel/equipment/<id>-v1.png`. Technical alpha cleanup and nearest-neighbor normalization do not redraw the artwork.

## Exact prompt set

Each request uses this shared prefix followed by the exact subject below:

```text
Use case: stylized-concept
Asset type: individual Rollbound armor equipment UI sprite, production-ready bitmap.
Input images: Image 1 worn plate and Image 2 cloth shirt are STYLE AND PIXEL DENSITY REFERENCES ONLY, not edit targets. Match their compact dark-fantasy 16-bit pixel-art grammar and muted iron/plum shadows. Create ONE NEW armor icon, not either reference subject.
Composition: centered single torso garment, front view with slight three-quarter depth, no person inside, no head, arms or legs. Generous empty transparent padding; whole silhouette in frame. Designed for a 48x48 canvas with at most 36x36 visible pixels. Use chunky readable pixel clusters and only a few broad material planes, NOT detailed illustration shrunk to icon.
Style: hard square pixels, near-black plum outline, restrained accent pixels, 3-tone material shading, crisp silhouette, high readability on near-black plum UI.
Constraints: genuine transparent RGBA background, never a drawn checkerboard; no background, platform, ground, shadow, tile, card, border, text, letter, number, label, UI, badge, external glow, haze, gradient, antialiasing, watermark, extra equipment or cropped pixel.
Subject:
```

### thorn-mail

```text
Tornebrynje / thorn-mail. A compact charcoal iron chainmail torso with SIX VERY LARGE sharp thorn spikes jutting outward from the two shoulders and side edges, a low neck opening, short chain skirt, two small muted cyan metal highlights. The jagged silhouette is the dominant identity; spikes must stay obvious at 36 pixels. Armor torso only, no wearer, no helmet, no weapon.
```

### wanderer-coat

```text
Vandringskofte / wanderer-coat. A sturdy long traveling wool coat: warm brown rough cloth, open folded collar, broad ragged cuffs and split hem, one simple tan strap and square buckle. Cloth dominates, no metal breastplate. Distinctly longer and fuller than the starter ragged shirt. Whole coat, no wearer or accessories.
```

### camp-cloak

```text
Lejrkappe / camp-cloak. A triangular forest-green hooded camping cloak, broad heavy draped cloth, pointed folded hood with empty dark opening, warm brown inner lining, one small brass clasp at throat. Compact wide triangular cape silhouette, simple two large folds. No wearer, no flame, no tent, no environment.
```

### riveted-harness

```text
Nitteharnisk / riveted-harness. A rugged brown leather torso harness covered by THREE broad horizontal dark steel bands with large visible ivory iron rivets, thick two leather shoulder straps, wide waist buckle. Blocky practical silhouette. The big rivets and leather straps are distinctive, not spikes and not ornate plate. No wearer.
```

### shield-vest

```text
Skjoldvest / shield-vest. The HEAVIEST and widest torso armor in this collection: massive blocky dark gunmetal chestplate shaped like a broad shield, oversized stacked square shoulder guards, thick rim, simple raised central ridge, short plated skirt. Cool steel and muted cyan highlights. Broad dense tank-like silhouette, not a handheld shield, no spikes, no wearer.
```

### duelist-jacket

```text
Duelistvams / duelist-jacket. A slender elegant dark indigo leather duelist doublet, high asymmetric collar, sweeping diagonal ivory piping, narrow cinched waist, two short split coat tails and one small silver fastening. Light agile silhouette, no heavy shoulder pads, no metal breastplate, no wearer.
```

### blood-plate

```text
Blodpanser / blood-plate. A blood-red enameled steel torso breastplate with rounded crimson pauldrons, three dark wine-red overlapping belly plates, one strong red droplet-shaped enamel recess in the chest, small pale steel edges. Compact muscular armor silhouette, threatening but not ornate; no wearer and no loose droplets outside object.
```

### sacrifice-plate

```text
Ofringsplade / sacrifice-plate. Beautiful but ominous ceremonial ivory bone-metal breastplate, a sharply narrow corset-like waist, tall inward-curving collar tips, two angular small shoulder plates, dark plum seams and one deep red inset shard at the sternum. Pale ivory faceplates form a spare rib-like geometry, an elegant dangerous silhouette. Armor only, no wearer, no skull, no text, no magical aura.
```

## Normalization and checks

All eight final assets passed dimensions/mode/binary-alpha/bounding-box checks. Settings: `python scripts/normalize_item_asset.py <raw> <destination> --remove-checkerboard`; defaults `--max-visible 36 --colors 32 --neutral-min 210 --neutral-spread 28`. Nearest-neighbor sampling and no-dither palette quantization preserve hard pixels. The bottom-most opaque row is 41 (bottom-exclusive baseline 42).

The Wanderer coat additionally used `--clear 766 528` after inspecting the enclosed transparent gap beside its right sleeve in the raw output. No other interior cleanup seeds were needed. Existing genuinely transparent pixels were preserved; flood cleanup only removes connected neutral background regions.

| Asset ID | Final alpha bbox (right/bottom exclusive) | Raw filename |
|---|---|---|
| `thorn-mail` | `(6, 7, 41, 42)` | `exec-fcf5da1e-ee67-4a2a-b9bd-13c9afb333ab.png` |
| `wanderer-coat` | `(12, 6, 35, 42)` | `exec-9946e2fb-2c76-47c9-b728-d51e891f467c.png` |
| `camp-cloak` | `(8, 6, 39, 42)` | `exec-8dc63c5d-fa5e-4131-bb2d-307fd834d3b1.png` |
| `riveted-harness` | `(8, 6, 40, 42)` | `exec-306ec434-9926-4f27-a2bc-5bc00b63ae6e.png` |
| `shield-vest` | `(6, 11, 42, 42)` | `exec-d7a52869-e030-46e1-9857-ff22540455ad.png` |
| `duelist-jacket` | `(10, 6, 37, 42)` | `exec-925b42b5-563a-4d61-a15d-8d1ca9d76ed0.png` |
| `blood-plate` | `(7, 6, 41, 42)` | `exec-191984e9-7cba-4797-a41f-253af55d1340.png` |
| `sacrifice-plate` | `(8, 6, 40, 42)` | `exec-9d05c4fa-b762-4c9c-b268-943a5c433d16.png` |

All raw files are preserved in `C:/Users/JacobGamby/.codex/generated_images/01a061c7-3b22-7b40-837c-85da7f043b34/`.

## Visual checks

- Inspected each original generation, then each normalized icon at native 48 × 48 and together at nearest-neighbor 3× on plum, alongside approved worn-plate and cloth-shirt references.
- Thorn-mail was the initial normalized sample: shoulder/side spikes remain clear without an outline panel. The mail is jagged and dark, unlike the broad solid Shield vest.
- Cloth identities stay distinct: Wanderer is long brown fabric; Camp is triangular green with a hood; Duelist is narrow indigo with diagonal pale piping and split tails.
- Metal identities stay distinct: Riveted harness has large bright rivets and leather straps; Shield vest is broad and dense; Blood plate is rounded crimson; Sacrifice plate is narrow ivory with tall collar tips and a red inset.
- No residual checkerboard, crop, ground, rectangular backing, text, UI treatment or external glow detected after normalization.
- Native-size readability is driven by silhouette as well as color. Item names/effects remain necessary runtime text and are not baked into assets.
- Live HUD/offer/shop QA and manifest integration are owned by the main batch contributor; this document records asset-production checks only.
