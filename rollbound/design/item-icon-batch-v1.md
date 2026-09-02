# Rollbound item icon batch v1

Completed 2026-09-02 on top of `374f575` (Claude's Batch C). This is a presentation-only batch: **24 new gear icons + 10 consumable icons**, with **30/30 gear and 10/10 consumables mapped**. The six approved original gear files are unchanged.

## Scope and implementation

- Eight weapons, eight armor items and eight Boots / Utility items have distinct silhouettes. No added items, equipment slots, inventory, rarity frames or balance changes.
- Consumables have a separate `consumableAssets.ts` manifest and `ConsumableIcon.tsx` renderer. HUD, idle-use buttons, Shop, Treasure and pre-combat now render their own item art.
- The original `ConsumableGlyph` implementation and effect mapping were moved verbatim into a leaf module and re-exported by `ScenePhases.tsx`, avoiding an import cycle. Missing mappings and failed image loads still render that glyph.
- Icon image-failure state is source-keyed in both renderers, so one failed source does not hide a subsequently equipped/held different item.
- Gear Lab (`/?ui=equipment`) retains the starter pairs and adds all 30 gear + 10 consumables with real data-driven names/effects and HUD/card/lab sizes.
- Two integration defects found in browser QA were corrected with scoped CSS: the sixth HUD child (consumables) now occupies a full-width second row, leaving the five established HUD groups in place; equipment comparison effect text now spans the article rather than squeezing into the 48 px icon column.
- Consumable names remain complete, disabled explanations stay readable, and only disabled artwork is dimmed. No per-item CSS size or offset hacks.
- No changes to `src/core/`, reducer actions, RNG, balance, combat playback or timing.

## Asset production

**Built-in ImageGen mode** was used for all 34 new raster icons, one call per icon. No CLI/API image-generation fallback and no code-drawn substitute artwork. Only technical alpha cleanup, palette reduction and nearest-neighbor normalization were applied afterward.

Final paths:

- `src/assets/pixel/equipment/<id>-v1.png` (24 new files).
- `src/assets/pixel/consumables/<id>-v1.png` (10 new files).

All new outputs are 48×48 RGBA, binary alpha 0/255, maximum 36×36 visible silhouette, horizontally centered and bottom-exclusive y=42 (last occupied row 41). No ground/platform, border, baked label, price or external glow. The magical items use colored highlights inside their objects.

The six legacy approved gear PNGs contain partial-alpha edge pixels. They are preserved, not silently reprocessed. `verify_item_assets.py` enforces dimensions, visible bounds, baseline, centering and uniqueness for all 40, with binary alpha required for the 34 new assets.

Use `scripts/normalize_item_asset.py` for future technical normalization. It refuses to overwrite an existing destination. Edge-connected neutral cleanup defaults to min RGB channel 210 / maximum channel spread 28; alpha is thresholded at 128; RGB quantization is 32 colors without dithering; resizing uses nearest-neighbor. Clear-point coordinates refer to inspected raw images, never arbitrary whole-image color removal.

The main weapon/consumable set used `--remove-checkerboard`; Smoke Bomb additionally used `--clear 780 355` to remove the enclosed pull-ring background. Armor cleanup settings and raw files are in [armor production](item-icons-armor-v1.md); footwear settings and raw files are in [boots production](item-icons-boots-v1.md). Original generations remain at their recorded local paths.

## Verification

- `npm run lint`: pass.
- `npm run build`: pass.
- `npm test`: 4 files, 20 tests pass (including the existing engine/combat tests).
- `python scripts/verify_item_assets.py`: 40/40 distinct assets pass; 34 strict binary-alpha assets + 6 preserved legacy assets.
- Existing combat assets still pass `python scripts/verify_combat_assets.py` (7/7).
- Coverage tests compare manifests against the actual `ITEMS` and `CONSUMABLES` catalogs. Component tests check mapped images, original-glyph fallback and decorative/named accessibility.
- [Gear browser QA](item-icons-gear-qa-v1.md): all 30 IDs in actual Shop, Treasure, comparison and HUD components at 1280×900 and 390×844; real seed 2 Equip and Keep branches.
- [Consumable browser QA](item-icons-consumable-qa-v1.md): complete coverage and real seed 299/15 flows are recorded separately, distinguishing controlled component fixtures from naturally obtained items.
- All broad catalog fixtures and screenshots are ignored local `tmp.local/` artifacts, not production routes or debug controls. Every PNG was visually inspected; contact sheets compare the normalized assets on the plum game background.
- Final independent Gear Lab review at 1280×900 and 390×844: 186 image instances loaded, 30/30 + 10/10 coverage, no fallback, horizontal page overflow or browser error. The glyph function/mapping was compared against the upstream version and is identical.

The playtest gate was reached upstream. This batch does not rerun or alter balance calibration. The next milestone is 5–10 human runs and feedback on the roll/evaluate/manipulate decisions; the documented combat floor-line alignment remains a separate optional presentation task.

## Exact main-agent generation prompts

For each weapon/consumable below, the exact request is the following common prefix, followed by a newline, `Subject: `, and that item's subject text. Both existing PNGs were inspected and supplied as style references for every call, not edit targets:

1. `src/assets/pixel/equipment/rusted-sword-v1.png`
2. `src/assets/pixel/equipment/worn-plate-v1.png`

```text
Use case: stylized-concept
Asset type: one production Rollbound dark-fantasy pixel-art inventory icon.
Input images: Image 1 sword and Image 2 armor are STYLE, palette, outlines and material references ONLY. Do not copy their subjects. Match their hard pixels and readable compact silhouette.
Style: crisp 16-bit pixel art with chunky square pixel clusters, near-black plum outlines, limited 3-tone shading per material, high-contrast edges and restrained saturated accents. NOT painterly, NOT vector, NOT photorealistic. It will be downsampled to a maximum 36x36 visible silhouette on a 48x48 canvas: prioritize a bold recognizable silhouette and a few large details, no tiny noise.
Composition: one isolated centered inventory object, fully visible with generous transparent margin. Genuinely transparent RGBA background, no checkerboard drawing. No surface beneath.
Constraints: no platform, ground, cast shadow, background, card, border, UI, labels, letters, numbers, price, badge, watermark, external glow, aura, particles, blur, gradients or antialiasing. Any magical light is confined to solid colored pixels INSIDE the object; no surrounding effect.
```

### wild-axe

Final: `src/assets/pixel/equipment/wild-axe-v1.png`

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a058ae-424f-7b92-9c0a-d92800a4f75a/exec-eb68cb70-306a-4ef9-8940-2855d058fd3f.png`

```text
Vildøkse: a raw asymmetrical battle axe, jagged single broad iron axehead, battered dark steel, crooked wood haft, a small red cloth grip. Diagonal handle from lower left to upper right, broad recognizable uneven axe silhouette. One axe only.
```

### dagger

Final: `src/assets/pixel/equipment/dagger-v1.png`

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a058ae-424f-7b92-9c0a-d92800a4f75a/exec-90b813e4-10aa-4b81-8a57-52323bae8cbe.png`

```text
Dolk: a single compact light dagger with short sharply tapered pale iron blade, simple small crossguard, dark leather grip and a restrained crimson pommel. Diagonal lower-left handle to upper-right tip. Small agile silhouette, not a full sword.
```

### hunting-spear

Final: `src/assets/pixel/equipment/hunting-spear-v1.png`

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a058ae-424f-7b92-9c0a-d92800a4f75a/exec-042c8293-e55f-43ee-9707-4ad93f516128.png`

```text
Jagtspyd: a single hunting spear, long wooden haft diagonally from lower left to upper right, broad leaf-shaped steel spearhead and one small red binding below the head. Entire butt and spear tip visible, a clear long thin pole silhouette.
```

### twin-daggers

Final: `src/assets/pixel/equipment/twin-daggers-v1.png`

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a058ae-424f-7b92-9c0a-d92800a4f75a/exec-38674f91-8542-42e6-864d-c274b93e8d4e.png`

```text
Tvillingedolke: a PAIR of two distinct small steel daggers, crossed in a shallow X, both blades and both leather handles clearly visible. Equal short blades, restrained red grip ties. Exactly two daggers, one compact inventory icon, no sword.
```

### war-hammer

Final: `src/assets/pixel/equipment/war-hammer-v1.png`

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a058ae-424f-7b92-9c0a-d92800a4f75a/exec-7d18e76e-4abb-4fc3-aefe-52b8e1aeff02.png`

```text
Krigshammer: one massive squat rectangular iron war hammer head on a stout wood and leather haft, diagonal handle lower left to upper right. A very broad blocky heavy head, bright worn iron edges and a small dull red grip binding. Not an axe, no blade.
```

### blood-blade

Final: `src/assets/pixel/equipment/blood-blade-v1.png`

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a058ae-424f-7b92-9c0a-d92800a4f75a/exec-ec92cf78-4922-495d-9d43-cb9031ab324b.png`

```text
Blodklinge: one sinister curved sword with a deep crimson blade inset, steel cutting edge, dark hilt, red droplet-shaped pommel worked into the solid weapon. A few dark-red pixels on blade edge but no detached drops. Diagonal lower-left handle to upper-right point.
```

### executioner-axe

Final: `src/assets/pixel/equipment/executioner-axe-v1.png`

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a058ae-424f-7b92-9c0a-d92800a4f75a/exec-712d5c12-fcea-4c9c-93bd-cf5f6ce1afbb.png`

```text
Bøddeløkse: one imposing executioner's axe with an exceptionally broad clean crescent cutting blade, heavy dark iron body, long straight leather-wrapped haft. Diagonal lower left to upper right. Symmetric clean crescent arc unlike the jagged wild axe; restrained deep red trim.
```

### rune-blade

Final: `src/assets/pixel/equipment/rune-blade-v1.png`

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a058ae-424f-7b92-9c0a-d92800a4f75a/exec-966567ff-5720-4f22-9e37-6bff2cede2e4.png`

```text
Runeklinge: one elegant straight ivory steel longsword with cyan geometric rune inlays along the blade, dark plum handle, sculpted compact guard. Top-tier orderly weapon, diagonal lower left to upper right. Rune marks are geometric material ornament, no readable letters, numbers or external glow.
```

### elixir

Final: `src/assets/pixel/consumables/elixir-v1.png`

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a058ae-424f-7b92-9c0a-d92800a4f75a/exec-7485c932-a45a-46b7-9faf-af226072273a.png`

```text
Helbredende eliksir: one small round-bellied glass healing vial filled with rich red liquid, short narrow neck and simple wooden cork, bright ivory glass edge pixels, plum outline. A simple compact unmistakable potion bottle, no label or cross symbol.
```

### grand-elixir

Final: `src/assets/pixel/consumables/grand-elixir-v1.png`

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a058ae-424f-7b92-9c0a-d92800a4f75a/exec-3d785641-cc34-4d72-b872-502681e8c60a.png`

```text
Stor eliksir: one large broad faceted healing flask filled with rich ruby red liquid, thick glass shoulders and decorative gold neck band with substantial cork. Clearly wider and richer silhouette than a simple round vial. Bright hard glass highlights, no labels or symbols.
```

### bomb

Final: `src/assets/pixel/consumables/bomb-v1.png`

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a058ae-424f-7b92-9c0a-d92800a4f75a/exec-84d92d02-30c9-4c5f-9385-fc4012179c2e.png`

```text
Bombe: one squat round dark iron bomb with a thick short curved rope fuse and a brass fuse collar. Dark plum iron body with steel highlight and tiny solid ember pixels ON the fuse tip, no detached sparks or explosion, no smoke. Strong bomb silhouette.
```

### thunder-flask

Final: `src/assets/pixel/consumables/thunder-flask-v1.png`

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a058ae-424f-7b92-9c0a-d92800a4f75a/exec-46d78b8a-8a7d-4750-b6af-af2a8f3b4c21.png`

```text
Tordenkolbe: one angular faceted cyan glass flask with a brass stopper and cobalt liquid, containing a bold yellow-white zigzag lightning shape confined entirely inside the flask. Tall narrow neck, wide diamond-like lower body. No external electricity, aura or sparks.
```

### smoke-bomb

Final: `src/assets/pixel/consumables/smoke-bomb-v1.png`

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a058ae-424f-7b92-9c0a-d92800a4f75a/exec-dc9f6cf2-238a-45fa-99a2-25067d63a705.png`

```text
Røgbombe: one short squat sealed smoke grenade canister in muted lavender-gray metal, rounded shoulders, small pull-ring and wrapped dark cloth band. Clearly distinct cylindrical canister silhouette from the round iron bomb. Smoky palette only; NO actual smoke cloud or particles.
```

### whetstone

Final: `src/assets/pixel/consumables/whetstone-v1.png`

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a058ae-424f-7b92-9c0a-d92800a4f75a/exec-ca5e8446-684e-4dc0-a9a0-6a12f47d28cc.png`

```text
Slibesten: one oblong rectangular gray-blue sharpening stone at three-quarter angle, beveled bright worn edges and a broad pale streak across its stone surface. Chunky solid stone bar, no weapon, no stand, no platform, no labels.
```

### fate-stone

Final: `src/assets/pixel/consumables/fate-stone-v1.png`

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a058ae-424f-7b92-9c0a-d92800a4f75a/exec-8fce7a96-b102-4fa8-9460-92352146225f.png`

```text
Skæbnesten: one rough faceted violet amethyst-like fate stone, asymmetrical chunky crystal silhouette and a large angular cyan rune inset inside its central face. Bright magenta-violet solid highlights, not a polished bottle, no external glow or particles.
```

### gold-pouch

Final: `src/assets/pixel/consumables/gold-pouch-v1.png`

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a058ae-424f-7b92-9c0a-d92800a4f75a/exec-787c832b-4ef8-48c0-801a-f6502be29727.png`

```text
Guldpose: one small fat brown leather drawstring coin pouch, gathered neck tied with gold cord, slightly open mouth showing two thick gold coin edges. Recognizable sack silhouette, all coins contained inside the pouch, no scattered objects, no numbers or currency sign.
```

### fate-die

Final: `src/assets/pixel/consumables/fate-die-v1.png`

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a058ae-424f-7b92-9c0a-d92800a4f75a/exec-72a2d546-c426-45ad-99b8-e17365a53c84.png`

```text
Skæbneterning: one solid three-quarter view D6 cube of dark plum stone with beveled ivory edges and bold cyan/violet geometric fate-rune inlays INSIDE its faces. Distinct die silhouette, no written numbers and no UI text. Bright internal color pixels only, no aura, glow, shadow or floating objects.
```

### teleport-scroll

Final: `src/assets/pixel/consumables/teleport-scroll-v1.png`

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a058ae-424f-7b92-9c0a-d92800a4f75a/exec-a6a9c104-c178-4b79-b247-e71105d01288.png`

```text
Teleport-rulle: one warm ivory parchment scroll, partially unfurled with curled top and bottom ends, violet bands and bold cyan-violet angular geometric rune strokes on parchment. Compact diagonal scroll silhouette; decorative rune geometry only, no readable text or digits, no glow.
```
