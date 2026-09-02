# Rollbound boots icon batch v1

Produced 2026-09-02 with built-in ImageGen, one generation per distinct icon. No CLI/API fallback was used. New artwork only; the existing approved Trail Boots and Worn Sandals were not changed.

## Scope and references

Eight Boots / Utility icons, paired footwear in the approved equipment grammar. Inputs were inspected before generation:

- `src/assets/pixel/equipment/trail-boots-v1.png` — pixel, palette, material and paired-footwear reference.
- `src/assets/pixel/equipment/worn-sandals-v1.png` — low footwear silhouette and paired composition reference.

All references were style references, not edit targets. This sub-batch changes PNGs and this production record only, never core, manifests, CSS or effects.

## Normalization

`python scripts/normalize_item_asset.py SOURCE src/assets/pixel/equipment/<id>-v1.png` uses nearest-neighbor sampling into a maximum 36×36 silhouette, centers horizontally, and places the bottom-exclusive alpha boundary at y=42 on a 48×48 RGBA canvas. Alpha is binary (0/255), color quantization uses 32 colors without dithering. All final icons passed these checks. No artwork was redrawn in code.

White/checkerboard sources used `--remove-checkerboard` (edge-connected alpha-only neutral flood, min channel 210 / max spread 28). Light Runners also used `--clear 605 755` for the inspected enclosed white gap between the two shoes. Shadow Shoes and Iron-shod arrived with genuine alpha and needed no background cleanup. All original generated sources were preserved.

| ID | Final alpha bounds (exclusive right/bottom) | Cleanup |
|---|---|---|
| `heavy-greaves` | `(7, 6, 41, 42)` | Edge flood |
| `light-runners` | `(6, 22, 42, 42)` | Edge flood + clear (605,755) |
| `scout-boots` | `(6, 12, 42, 42)` | Edge flood |
| `goldthread-shoes` | `(6, 17, 42, 42)` | Edge flood |
| `elven-boots` | `(9, 6, 38, 42)` | Edge flood |
| `pilgrim-shoes` | `(6, 12, 42, 42)` | Edge flood |
| `shadow-shoes` | `(6, 14, 42, 42)` | Native alpha |
| `iron-shod` | `(6, 12, 42, 42)` | Native alpha |

## Visual checks

Heavy Greaves were generated and normalized first as the sample. Each final icon was inspected individually at native 48×48 size and together on the near-black plum background at 2× nearest-neighbor scale. Checks: no background rectangles, halo, ground, labels or clipped edges; visible paired-footwear silhouette; distinct heavy armor / feather runners / folded scout cuffs / curled gold slippers / tall leaf boots / cloth-bound pilgrim / pointed shadow / studded work-boot identities. Consistent y=42 baseline avoids per-item CSS offsets. Low shoes intentionally occupy less height than tall boots.

The temporary contact sheet is `tmp.local/boots-batch-preview.png` (not a runtime asset). Live HUD/offer/Shop/Gear Lab checks are performed by the integrating agent and recorded in the main batch handoff; asset-level checks here do not claim those runtime checks have already happened.

## Exact prompt set

Every prompt equals the following common prefix plus the corresponding subject text verbatim. Both inspected reference image paths above were supplied for every call.

```text
Use case: stylized-concept.
Asset type: single production Rollbound equipment UI icon, 16-bit dark fantasy pixel art.
Input images: Image 1 trail boots and Image 2 worn sandals are STYLE, palette, pixel-density and paired-footwear composition references only. Make a new item, not a recolor.
Primary request: a compact PAIR of footwear side-by-side in three-quarter view, toes pointing lower-left, full silhouette visible. Flat genuine alpha transparent background; no drawn checkerboard.
Style: sharply stepped hard square pixel clusters, dark near-black plum outline, three-tone materials, limited palette. Must be readable after nearest-neighbor normalization to a 36x36 visible silhouette on a 48x48 transparent canvas. Simple chunky forms and broad highlights instead of detailed texture. Balanced compact composition, generous transparent margin.
Constraints: no ground, platform, floor, cast shadow, background, card, border, label, letters, numbers, badge, frame, external glow, haze, antialiasing, watermark, separate props, person or cropped pixels.
Subject:
```

### heavy-greaves

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a061c7-71ad-7332-b7fa-20872d9cded5/exec-fd99c894-1fde-45a2-a676-a312a005175c.png`

Final: `src/assets/pixel/equipment/heavy-greaves-v1.png`

```text
Tunge grever / heavy greaves: a matching pair of very heavy squat iron-plated boots with tall blocky shin guards, broad squared armored toes and thick black soles. Cool gunmetal planes with tiny pale steel edge highlights; narrow muted green leather straps at ankle. Clumsy angular weight, noticeably broader and stiffer than the reference leather boots. No spikes, gems or wings.
```

### light-runners

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a061c7-71ad-7332-b7fa-20872d9cded5/exec-dc013b14-5a84-4128-89c1-20cd8b17c9f0.png`

Final: `src/assets/pixel/equipment/light-runners-v1.png`

```text
Letloebere / light runners: a compact matching pair of low-cut light soft leather running shoes, slim low ankles and curved upward toes. Weathered tan-brown leather, ivory wrapped insteps and a small ivory feather-shaped fin integrated into each outer ankle cuff as a winged hint. Two small green stitches. Light supple silhouette clearly unlike tall armored boots, no detached wings or speed lines.
```

### scout-boots

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a061c7-71ad-7332-b7fa-20872d9cded5/exec-af65c709-914f-4078-891e-6ed4ef1ea363.png`

Final: `src/assets/pixel/equipment/scout-boots-v1.png`

```text
Spejderstoevler / scout boots: a compact matching pair of practical medium-height folded-cuff leather scouting boots. Warm dark brown leather, wide moss-green fold-over cuffs, two clear crossing tan straps on each front and flat quiet soles. Rounded toes, slightly asymmetric staggered pair. No wings, metal armor, coins or gems; ranger utility identity, distinct silhouette from reference.
```

### goldthread-shoes

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a061c7-71ad-7332-b7fa-20872d9cded5/exec-e2ad0028-5d82-4b46-bc2d-9724c26a3765.png`

Final: `src/assets/pixel/equipment/goldthread-shoes-v1.png`

```text
Guldtraadssko / goldthread shoes: a compact matching pair of low-cut dark plum velvet merchant shoes with turned-up curled toes. Bold gold embroidered seam follows each outer edge and a gold diamond buckle on each instep. Mostly dark leather, limited warm gold highlights, visibly low elegant slippers rather than armored boots. No coins, separate items, glows or sparkles.
```

### elven-boots

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a061c7-71ad-7332-b7fa-20872d9cded5/exec-22a337c6-d413-424b-938f-44feb560974c.png`

Final: `src/assets/pixel/equipment/elven-boots-v1.png`

```text
Elverstoevler / elven boots: a compact matching pair of tall slender forest-green suede boots with sharply pointed toes and leaf-shaped scalloped split cuffs. Narrow layered leaf panels edged in restrained cyan thread and pale green highlights. Graceful elongated silhouette rather than heavy soles; tiny cyan clasp, no wings, armor, runes as text, glow or particles.
```

### pilgrim-shoes

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a061c7-71ad-7332-b7fa-20872d9cded5/exec-9976c4a8-d045-40ff-816e-70234a515f1f.png`

Final: `src/assets/pixel/equipment/pilgrim-shoes-v1.png`

```text
Pilgrimssko / pilgrim shoes: a compact matching pair of humble worn ankle shoes with broad round toes, dusty brown patched leather, thick ivory cloth bindings crisscrossing each ankle and one simple small ivory sun-shaped sewn emblem on the front binding. Ochre soles and frayed cloth end integrated into outline. Worn yet sacred traveling shoes, no separate charms, shiny armor, wings or glow.
```

### shadow-shoes

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a061c7-71ad-7332-b7fa-20872d9cded5/exec-71064fa9-5781-4747-b166-c4850ece8475.png`

Final: `src/assets/pixel/equipment/shadow-shoes-v1.png`

```text
Skyggesko / shadow shoes: a compact matching pair of stealthy near-black plum soft ankle boots, thin flexible soles, sharp pointed toes and a low angular split ankle collar. One restrained hard magenta stitched stripe follows each collar and diagonal seam, with muted lavender highlights defining dark leather planes. Very slim ninja-like silhouette, no smoke, aura, transparency inside leather, metal armor or wings.
```

### iron-shod

Raw source: `C:/Users/JacobGamby/.codex/generated_images/01a061c7-71ad-7332-b7fa-20872d9cded5/exec-36a2d937-9116-467e-b685-965155d90423.png`

Final: `src/assets/pixel/equipment/iron-shod-v1.png`

```text
Jernskoede / iron-shod boots: a compact matching pair of rugged low ankle brown work boots wrapped in broad riveted iron bands. Clearly visible square pale steel toe caps, thick studded soles and small squat ankle cuffs; iron studs protrude just enough to give outline an uneven nailed silhouette. Weathered warm leather between cool gray bands. Low wide silhouette, NOT tall armored greaves, no shin plates, spikes, wings, glow or ground.
```
