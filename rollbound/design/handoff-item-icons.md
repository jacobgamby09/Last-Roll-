# Rollbound — opgave: Item-ikon-batch (24 gear + 10 consumables)

Handoff-prompt til Codex, 2026-09-02. Læs `AGENTS.md` → `PROGRESS.md` → `rollbound/design/equipment-asset-contract-v1.md` før start.

**Status: udført 2026-09-02.** 34 nye ikoner er produceret og integreret; dækningen er 30/30 gear + 10/10 consumables. Se `item-icon-batch-v1.md` for leverance/proveniens og de to `item-icons-*-qa-v1.md`-rapporter for browser-QA. Opgaveteksten nedenfor bevares som historisk brief.

## Status siden sprite-batchen (alt committet og pushet til `main`)

Claude har bygget item-systemet færdigt i tre slices:

1. **Slice A:** Items er datadrevne i `rollbound/src/core/items.ts` (balance-data; 18-kind effect-vokabular). Combat-mods (firstStrike, doubleHit, armorPen, killHeal, thorns, firstHitBlock, execute) afvikles i `simulateFight` med nye event-kinds, som kampscenen afspiller.
2. **Batch B:** Fuldt gear-roster — **10 våben, 10 armor, 10 boots**. Loot-model: treasure = tier-vægtet vælg-1-af-3, elites dropper garanteret gear, mobs kun utility. Shoppen ruller **5 seedede slots, hvert 100 % tilfældigt**, én-gangs-køb.
3. **Batch C:** **10 consumables, 2 slots** + pre-combat-beatet (bomber/røgbombe før kampen), Skæbneterning (rul to, vælg én) og Teleport-rulle (nye board-faser). Shop-slots ruller nu tredjedele gear/consumable/service.

Balance er sim-kalibreret (balanced 56,4 % / aggressive 41,8 % / cautious 38,4 %, 10k runs, boss 85/8-12/2). **Playtest-gaten er nået** — ikonerne er den sidste polish før playtest.

## Din opgave

Producér **34 ikoner** og registrér dem, så placeholder-glyferne forsvinder:

### Del 1: 24 gear-ikoner (følg `equipment-asset-contract-v1.md` præcist)

`48 × 48` RGBA, ægte alpha, nearest-neighbor, INGEN platform/baggrund/label/tal/glow. Filer: `src/assets/pixel/equipment/<id>-v1.png`. Registrér i `EQUIPMENT_ASSETS` i `src/pixel/equipmentAssets.ts` (samme mønster som de 6 eksisterende). Id'er, navne og effekter står i `src/core/items.ts` — identiteten skal aflæses af silhuetten:

- **Våben (8):** `wild-axe` (Vildøkse — rå, asymmetrisk), `dagger` (Dolk — let, hurtig), `hunting-spear` (Jagtspyd), `twin-daggers` (Tvillingedolke — PAR af små klinger), `war-hammer` (Krigshammer — massiv, tung), `blood-blade` (Blodklinge — rød tone/dryp), `executioner-axe` (Bøddeløkse — bred bue), `rune-blade` (Runeklinge — ivory/cyan runer, top-tier).
- **Armor (8):** `wanderer-coat` (Vandringskofte — stof/rejse), `camp-cloak` (Lejrkappe — grøn tone, lejr-tema), `riveted-harness` (Nitteharnisk), `thorn-mail` (Tornebrynje — pigge!), `shield-vest` (Skjoldvest — tungest udtryk), `duelist-jacket` (Duelistvams — elegant, let), `blood-plate` (Blodpanser — rød tone), `sacrifice-plate` (Ofringsplade — smuk men ildevarslende; tradeoff-item).
- **Boots (8):** `heavy-greaves` (Tunge grever — jern, klodsede), `light-runners` (Letløbere — lette, vingede antydninger), `scout-boots` (Spejderstøvler), `goldthread-shoes` (Guldtrådssko — guld-syninger), `elven-boots` (Elverstøvler — elegante, grønne/cyan), `pilgrim-shoes` (Pilgrimssko — slidte, hellige), `shadow-shoes` (Skyggesko — mørke, magenta-kant), `iron-shod` (Jernskoede — beslåede).

### Del 2: 10 consumable-ikoner (ny familie)

Samme tekniske regler (`48 × 48` RGBA, transparent, ingen baked UI). Consumables er en NY ikon-familie: mindre "udstyr", mere "genstand i hånden" — flasker, sten, ruller, bomber. Filer: `src/assets/pixel/consumables/<id>-v1.png`. Id'er i `src/core/items.ts` (`CONSUMABLES`): `elixir`, `grand-elixir` (større/rigere udgave), `bomb`, `thunder-flask` (elektrisk/cyan), `smoke-bomb` (røg-toner), `whetstone`, `fate-stone` (magisk sten, violet), `gold-pouch`, `fate-die` (terning med skæbne-glød), `teleport-scroll` (rulle med runer).

**Integration for del 2:** opret `src/pixel/consumableAssets.ts` (manifest, `Partial<Record<ConsumableId, ...>>`) og en `ConsumableIcon`-komponent med eksplicit fallback til den eksisterende glyf (`ConsumableGlyph` i `ScenePhases.tsx`) — samme mønster som `EquipmentIcon`. Erstat glyf-brugen i HUD (`PixelHud`), idle-panelet (`PixelActionPanel`), shop/treasure (`ScenePhases`) med den nye komponent. Rør IKKE `ConsumableGlyph` selv — den ER fallbacken.

## QA-krav

- Hvert ikon verificeres i den live UI: shop-række, treasure-valg, HUD-slots (`ITEMS x/2`) og idle-brugsknappen. Deterministiske seeds: `?seed=299` (Bombe i første treasure), `?seed=15`.
- Gear Lab (`?ui=equipment`) skal fortsat være grøn; udvid gerne labben til de nye assets, hvis det er billigt.
- `npm run lint`, `npm run build`, `npm test` grønne. Rør IKKE `src/core/` eller reducer-logik.
- Versionerede filnavne; overskriv aldrig godkendte assets.

## Guardrails

- Ingen pris/label/tal/glow bagt ind i bitmaps.
- Ingen scope-udvidelse: ingen nye items, ingen rarity-farverammer, ingen animationsframes.
- Ingen genindførsel af pris-forecasts eller andre fjernede UI-elementer.

## Når du er færdig

Opdatér `PROGRESS.md` (flyt ikon-opgaven til completed, notér manifest-dækning fx "30/30 gear + 10/10 consumables mapped"), commit og push til `main`.
