# Combat sprite batch v1 — production and QA

Delivered: 2026-09-02. Base: `66b61de` on `main`.
Contract: [combat-sprite-contract-v1.md](combat-sprite-contract-v1.md).

## Delivery

Seven single-frame enemy sprites in `src/assets/pixel/combat/`, registered in
`src/pixel/combatSpriteAssets.ts`. All face left, have true binary alpha, and
share the bottom canvas edge (last occupied row `y=79`). No platforms, background,
UI, shadow or glow are baked in. No per-sprite CSS is used.

| ID / filename stem | Visible height | Canvas fraction | Alpha bounds (right/bottom exclusive) |
|---|---:|---:|---|
| goblin-v1 | 56 px | 70% | (0, 24, 64, 80) |
| bandit-v1 | 62 px | 77.5% | (9, 18, 55, 80) |
| ogre-v1 | 68 px | 85% | (3, 12, 60, 80) |
| elite-early-v1 | 68 px | 85% | (2, 12, 62, 80) |
| elite-mid-v1 | 72 px | 90% | (6, 8, 58, 80) |
| elite-late-v1 | 76 px | 95% | (2, 4, 61, 80) |
| boss-v1 | 80 px | 100% | (6, 0, 58, 80) |

Every file is a `64 × 80` RGBA PNG. Category colors appear as shaded accents,
not flat recoloring of the whole character. Goblin + Ogre were normalized and
tested first; the remaining five followed after those extremes were checked.
The boss uses the approved ivory bone-plate, red cloak, crown and ceremonial
scepter silhouette. There are no additional enemy types or animation frames.

## Production and provenance

Generated with **built-in ImageGen**, one request per sprite, using the existing
`hero/hero-idle-a-v1.png` and `tiles/combat-v1.png` as style references in that order.
No CLI image-generation fallback or alternative image provider was used.

The raw outputs contained light checkerboard backgrounds despite the alpha
request. `scripts/normalize_combat_asset.py` removes only edge-connected neutral
light background (min RGB >= 210, channel spread <= 28), with manually inspected
flood seeds for enclosed background holes. It then crops to alpha bounds,
resizes with nearest-neighbor, quantizes to 32 colors without dithering while
preserving the mask, and bottom-aligns on the transparent canvas. Final alpha
is strictly 0 or 255. Ivory armor details are protected by their enclosing
outlines; there is no global white-color deletion.

The script refuses to overwrite an existing destination or squeeze a silhouette
wider than the canvas. Raw images remain in the local ImageGen output directory,
not in the production bundle:
`C:/Users/JacobGamby/.codex/generated_images/01a058ae-424f-7b92-9c0a-d92800a4f75a/`.

| Sprite | Raw output basename | Extra raw-coordinate flood seeds |
|---|---|---|
| goblin | exec-d410b32f-1845-482b-8fba-d50610ec96be.png | 840,790 |
| bandit | exec-d95f2f80-fc0f-418d-b2af-63876fc9d743.png | 745,562 |
| ogre | exec-de0db218-7275-4124-a680-9430642dce0e.png | none |
| elite-early | exec-2160eed9-4031-4866-a0bb-10cbfcadc946.png | none |
| elite-mid | exec-86940d91-057e-442d-a2b7-e00e33c459d9.png | 779,587 and 550,566 |
| elite-late | exec-ac9958ca-97a3-4f09-afe0-b169f8c79ebe.png | none |
| boss | exec-ccf24213-d7fc-4ee7-8637-330d544012d9.png | 528,150 |

Example, from `rollbound/` (choose a new version/draft path rather than
overwriting an approved asset):

```text
python scripts/normalize_combat_asset.py <raw-goblin.png> <new-output.png> --height 56 --remove-checkerboard --clear 840 790
python scripts/verify_combat_assets.py
```

Both scripts require Pillow. The verification script checks all seven PNGs for
RGBA mode, dimensions, transparency, bottom alignment and tier height bands.
Facing and visual clarity still require visual inspection.

## Live-scene QA

Tested with agent-browser against the actual Vite app at `/?seed=2`:
Roll yields 2, then Nudge +1 reaches the Goblin on field 3. Goblin used its real
mapping; for each other sprite only the Goblin manifest entry was temporarily
aliased to the asset under test, as allowed by the handoff. The displayed name
and combat stats therefore remain Goblin in those QA captures. **All temporary
aliases were removed; the final manifest maps every enemy to its own asset.**
These were sprite/rendering tests, not full elite or boss encounter playthroughs.

| Sprite | Desktop 1280×800 | Mobile 390×844 | Attack / hit / fallen |
|---|---|---|---|
| Goblin | verified | verified | verified |
| Bandit | verified | verified | verified |
| Ogre | verified | verified | verified |
| Goblin-høvding | verified | verified | verified |
| Skyggeridder | verified | verified | verified |
| Trold-konge | verified | verified | verified |
| Boss | verified | verified | verified |

- Natural image dimensions `64×80`; rendered `96×120` desktop and `72×90` mobile.
- Correct asset source, no missing-image fallback and no global horizontal overflow.
- Final canonical manifest verified for all seven config definitions and their
  structured clones; each resolves to its own combat PNG and original fallback tier.
- Observed idle, `is-attacking`, `is-hit`, `is-fallen`; computed attack animation
  `combat-lunge-enemy`, hit animation `combat-shake`, existing fallen fade/grayscale.
- Reviewed desktop/mobile scene screenshots and the lineup on dark plum.
- Reduced-motion mobile run reached static payout directly, with the canonical
  Goblin sprite and no overflow/fallback.
- No browser errors or warnings; Vite connection/HMR and React DevTools info only.
- Local screenshots and temporary QA drivers live under ignored `tmp.local/`.
- `npm run lint`, `npm run build`, `npm test` pass (2 test files, 5 tests).
- `python scripts/verify_combat_assets.py`: 7/7 pass.

### Existing layout observation — not changed in this batch

Sprite canvas baselines are consistent, but the scene's horizontal floor rule
is not the actual foot baseline: `.combat-duel` has 26px bottom padding plus
a 2px border. On desktop the enemy's canvas ends about 28px above that rule.
The existing hero artwork also has transparent bottom padding, so its visible
feet sit higher than the new enemies. Mobile uses the existing stacked duel
rather than a shared horizontal floor. These are scene/hero-layout concerns
for a separately scoped polish pass; no compensating per-enemy margins, CSS
or bitmap ground patches were added. The literal floor-contact QA criterion
is therefore not fully met by the existing scene, although every new sprite
meets the shared asset-baseline contract.

## Scope preserved / next owner

No changes to `src/core/`, config, balance, RNG, combat mapping/fallback logic,
scene/playback components, timing or CSS. No exact-price forecasts were restored.
Next work remains simulation on the real engine, then damage ranges.

## Exact ImageGen prompt set

Each request used the common prefix below, followed by a newline and its
corresponding `Subject:` paragraph. Reference order is documented above.

### Common prefix

```text
Use case: stylized-concept. Asset type: a single production-ready combat character sprite for Rollbound, not concept art. Image 1 is ONLY the reference for crisp dark-fantasy 16-bit pixel grammar, dark plum outlines and simple chunky sprite proportions; Image 2 is ONLY palette/pixel rendering reference, DO NOT include its platform. Create one new enemy, NOT the hooded hero. Full body, battle idle stance, three-quarter SIDE VIEW FACING LEFT, face/nose and weapon aimed toward the left edge. Large distinct pixel clusters, dark near-black plum outline, 3-tone shading, restrained vivid red #ff3b4d cloth accents; no gradients, antialiasing, blur, glow, rim aura or tiny painterly texture. Output genuinely transparent RGBA background, not a checkerboard drawing. Single subject only. All anatomy, weapon and feet entirely in frame, small transparent margin. Composition must fit a tall 4:5 sprite canvas when normalized to 64x80; narrow enough to fit without shrinking intended height. No ground, platform, floor, shadow, border, panel, UI, labels, letters, numbers, health bars, particles or effects.
```

### goblin

```text
Subject: A small wiry olive-green Goblin: oversized pointed ears and hooked nose facing LEFT, ivory eye, low crouched ready pose, ragged dark leather tunic, small red waist cloth, short rusty dagger held down and toward left. Thin bent legs, feet on one common level. Readable silhouette, quick and scrappy rather than heavily armored. Intended visible silhouette 56 pixels high on 64x80 output canvas.
```

### bandit

```text
Subject: A lean human BANDIT in a dark charcoal hood and fitted worn leather coat, tan visible nose facing LEFT, red face scarf and red sash with sharp crimson highlights. Short curved iron blade aimed down-left held close to body; knees slightly bent in stalking combat stance. Two boots on same level. Dark leather with enough warm highlights to read on near-black plum. Not the purple player hero: angular adult face, red scarf, longer coat, different blade. Full silhouette should be taller than wide, designed for visible 62px high on 64x80 canvas.
```

### ogre

```text
Subject: A massive stocky OGRE: huge square shoulders and barrel belly, desaturated ochre/olive skin, thick forearms, jutting lower tusk, bald hunched head clearly facing LEFT. Worn charcoal leather belt and crude iron shoulder plate, small torn red loincloth accents. Thick legs on same baseline, weighty squat wooden club held diagonally down toward LEFT and close to body. Brutal heavy stat profile, not a knight or a goblin. Compact width; intended visible silhouette 68 pixels high on 64x80 canvas.
```

### elite-early

```text
Subject: A GOBLIN CHIEFTAIN: pointed olive-green ears, hooked nose and face clearly LEFT. Upright commanding goblin with jagged dark iron crown, light bone shoulder ornaments, dark leather armor, vivid magenta #ff2bd6 cloth sash and short cape. One compact ceremonial jagged blade held down-left near his body. Chunky square pixels, expressive recognizable silhouette. Stronger taller relative of ordinary goblin, not a human knight. All feet, crown, blade intact. Intended silhouette 68px high, not wider than 60px when normalized.
```

### elite-mid

```text
Subject: A SHADOW KNIGHT: slender, elongated, stalking armored humanoid, hooded angular helmet in dark slate/plum, narrow vivid magenta eye slit, restrained magenta #ff2bd6 cape lining and armor-edge accents. Face and three-quarter body unequivocally oriented LEFT. Long lean silhouette, one narrow sword held close to body pointing diagonally down-left, fitted asymmetrical short shoulder cape. Not a bulky paladin and not a ghost. Full body with visible boots, no floating wisps. Intended silhouette 72px high and roughly 42px wide when normalized.
```

### elite-late

```text
Subject: A TROLL KING: enormous organic moss-green troll, huge barrel chest, heavy tusked jaw and small head FACING LEFT, muscular hanging arms, thick legs, crude jagged bone-and-dark-metal crown. Magenta #ff2bd6 cloth loincloth and modest royal shoulder mantle, rough stone-textured skin without noisy dithering. A thick short wooden war maul held down-left CLOSE to body, compact footprint. Massive organic anatomy, NOT full plate armor; visibly distinct from a slender shadow knight and an ivory armored ceremonial ruler. Upright enough to make the full silhouette at least 1.25 times taller than wide. Intended visible size 76px high, maximum60px wide.
```

### boss

```text
Subject: The CEREMONIAL RULER OF FATE, Rollbound's boss: tall upright inevitable armored humanoid, deliberately symmetrical armor design, ivory bone-plate cuirass and pauldrons, dark plum underlayers, a deep red ceremonial cape and restrained red #ff3b4d accents. Elevated geometric crown/solid halo-shaped crown attached to helmet, NOT a glowing halo effect. Subtle geometric rune or die-inspired mark worked into the chestplate, no literal large die face, no text or numbers. Slim vertical scepter held close to the body, feet and cloak hem on same ground level. Torso three-quarter view and helmet nose/gaze face LEFT toward opponent, not front-facing. Ceremonial rather than stalking or organic; distinct from troll and shadow knight. Entire crown, scepter, cloak and feet within canvas. Intended silhouette 80px high on64x80; tall not broad. Ivory details must be warm #fff2df, not pure-white background.
```
