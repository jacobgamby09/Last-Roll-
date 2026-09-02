# GDD — Rollbound (Dice Track Roguelike)

**Arbejdstitel:** Rollbound
**Genre:** Roguelike / RPG / Boardgame-inspired
**Platform:** TBD (prototype: web, Vite + React + TS)
**Status:** Spilbar prototype med pixel-UI

Dette dokument er GDD v0.1 (originalteksten nederst) plus en løbende ændringslog over besluttede afvigelser. Ved konflikt gælder ændringsloggen over v0.1-teksten, og `AGENTS.md` gælder over begge som arbejdsinstruks. Konkrete balance-tal bor ALTID i `rollbound/src/core/config.ts` (og spejles i `sim/`) — ikke her.

---

## Ændringslog — besluttede afvigelser fra v0.1

### 2026-09-02 · Eksakt combat-pris fjernes (beslutning)

Den eksakte HP-pris pr. kamp ("koster ~9 HP") var en prototype-feature muliggjort af fuldt deterministisk combat. **Den skal helt væk**, når det rigtige combat-flow (combat screen) kommer ind:

- Ingen eksakt HP-pris nogen steder: ikke som chips på boardet, ikke i destinationskort, ikke som boss-pris-panel i HUD'en.
- I stedet: alle synlige combat-felter (Enemy, Elite, Boss) kan **inspiceres via hover/klik** og viser **mob-type og cirka-stats** (fx afrundede eller interval-angivne HP/Damage/Armor) — aldrig en udregnet skades-prognose.
- Konsekvens: spillet må heller ikke auto-markere en kamp som dødelig/sikker (☠-flag) — den vurdering er spillerens, ud fra ca. stats og egen tilstand.
- Bossen viser sine ca. stats fra start (så "byg stærkt nok" kan vurderes), men ingen pris.

### 2026-09-01 · Equipment er ikke-stakkende slots (implementeret)

- Tre reelle slots (Weapon / Armor / Boots) med starter- og upgrade-items; effekter **erstattes pr. slot**, stakker ikke.
- Treasure, drops og shop åbner en sammenligning med Equip/Keep; guld trækkes først ved bekræftet køb; ejede upgrades filtreres fra loot og deaktiveres i shoppen.
- Bevidst ingen inventory, rarity, selling eller duplicate-conversion.
- Planen er mange flere items pr. slot (tiers) plus consumables — item-systemet skal gøres datadrevet, før den batch produceres.
- Sim-verificeret 2026-09-02 (v0.9): balanced bot 55,7 % win med boss 105/10/2 — inden for målbåndet. Kendt issue: shop-boots (18 g ≈ +1 nudge) er domineret af shoppens nudge (8 g); boots-effekten skal differentieres (fx recharge ved Camp).

### 2026-08-31 · Enemy loot drops genindført (implementeret)

v0.1 skar loot fra normale enemies for at gøre dem til ren XP-kilde. Med rotation-levels (se nedenfor) er level-belønningen automatisk, så drops genindførtes: **25 % chance på normale enemies, 100 % på elites** (config: `drops`). Sim viste, at det ikke degenererer ("fight everything" bliver ikke dominant). Anbefaling fra sim (delvist realiseret via equipment-filtrering): normale mobs bør primært droppe utility, elites bør droppe build-pieces.

### 2026-08-31 · Level-ups er rotation uden spillervalg (implementeret som default)

- Default: **rotation ATK → HP → Armor → forfra**, ingen menu. Næste levels bonus er kendt og vises i UI — det gør "når jeg L4 før eliten?" til en board-beslutning.
- Choice-menuen (vælg 1 af 3: +dmg / +maxHP / +armor&maxHP-hybrid) ligger bag config-flag (`levelUpMode`) til A/B-playtest.
- Baggrund: sim viste at +Damage dominerede valgmenuen; repricing (hybrid-armor, +14 HP) løste det, men rotation valgtes som default, fordi equipment nu bærer build-identiteten.

### 2026-08-31 · Talsæt kalibreret via headless simulation

v0.1's tal (sektion 4, 9, 10) var uspilbare (win rate ~0 %). Kalibreret gennem sim-iterationer v0.5 → v0.9 — se `sim/FINDINGS.md` for hele forløbet og `rollbound/src/core/config.ts` for de gældende tal. Nøgleprincipper fundet undervejs:

- Bossens pris skal beregnes baglæns fra forventet ankomst-HP, ikke sættes fremad.
- Fjende-HP må vokse hurtigt; fjende-DAMAGE er den farlige knap (HP→XP-kursen ~0,4 holdes via blød damage-skalering 6→8→11).
- Movement manipulation bærer designet (win rate fordobles med nudges/rerolls) — charge-økonomien ER 70/30-balancen.
- Flat armor er en strukturel knivsæg; rene armor-increments kan ikke balanceres med tuning alene.

### Planlagt (besluttet retning, ikke implementeret)

- **Combat screen:** kamp skal udfolde sig visuelt (slag for slag), ikke være en "mist X HP"-loglinje. Reduceren afgør stadig kampen deterministisk og atomisk; UI'et afspiller et combat-script fra core. Den eksakte pris-preview fjernes i samme ombæring (se 2026-09-02).
- **Mange flere items + consumables** (2 slots) — kræver datadrevet item-system og effect-vokabular (armor-pen, first-strike, lifesteal, camp-triggers) først.
- **Shopudvalg skal være begrænset** — shoppen må ikke være en buffet med de bedste items; udvalget skal være smalt/varieret nok til, at guld-beslutninger forbliver situationsbestemte.
- Playtest-gate: combat screen + første item-batch + consumables, derefter første rigtige feel-playtest.

---

# GDD v0.1 (original, 2026-08) — Dice Track Roguelike

## 1. High Concept

Et roguelike RPG bygget omkring et brætspils-lignende track.

Spilleren bevæger sin hero fra start til boss ved at slå en terning. Hvert slag bestemmer, hvor langt spilleren bevæger sig, men spilleren har begrænsede værktøjer til at manipulere resultatet.

Boardet indeholder enemies, treasure, shops, events, camps, elites og tomme felter.

Kernen er ikke at få det perfekte terningeslag, men at:

> **Make the most of what you roll.**

Spilleren skal konstant beslutte, hvornår et middelmådigt resultat skal accepteres, og hvornår værdifulde rerolls, nudges, spells eller andre ressourcer skal bruges for at ændre situationen.

Undervejs bygger spilleren sin hero gennem levels, equipment, spells og rule-bending relics.

Til sidst skal det build, der er blevet skabt undervejs, kunne besejre bossen.

## 2. Design Pillars

### 2.1 Adaptation over perfect control

RNG er en central del af spillet. Spilleren skal ikke kunne vælge præcis hvilket felt, der rammes hver tur.

Det interessante spørgsmål er: *"Jeg slog en 5'er. Hvad kan jeg gøre med den?"* — ikke *"Hvordan får jeg altid det felt, jeg ønsker?"*

Movement manipulation skal derfor være kraftfuld, men begrænset. Designmål: **70 % adaptation / 30 % control.**

### 2.2 Boardet er gameplayet

Combat skal være simpelt. Den primære beslutningsdybde ligger i:

- hvilke felter spilleren forsøger at ramme
- hvornår movement resources bruges
- hvilke fights der accepteres
- hvilke upgrades der vælges
- hvordan HP, Gold, Spells og andre resources forvaltes

Combat er primært resultatet af de beslutninger.

### 2.3 Build → Observe → Adapt

Spilleren bygger sin hero. Derefter ser spilleren, hvordan buildet performer. Boardet giver løbende nye problemer, som spilleren må tilpasse sig. Begrænset mekanisk skill i combat, højere strategisk agency mellem encounters.

### 2.4 Rewards skal konkurrere med hinanden

Der skal ikke findes ét felt, der altid er bedst. Et Enemy-felt kan være godt, fordi spilleren mangler XP. Et Treasure-felt, fordi gear mangler. Et Camp, fordi HP er lav. Et Blank kan være det bedste resultat, fordi spilleren ikke har råd til endnu en kamp. Boardets værdi skal være situationsbestemt.

## 3. Core Loop

1. Se de kommende felter på tracket.
2. Roll D6.
3. Se hvilket felt resultatet fører til.
4. Acceptér resultatet eller brug movement manipulation.
5. Flyt hero.
6. Resolve feltet.
7. Få rewards / tag skade / træf valg.
8. Opgradér hero eller resources.
9. Roll igen — fortsæt mod bossen.
10. Bekæmp boss. Win / lose run.

Følelsesmæssigt loop: **Roll → vurdér → manipulér? → commit → resolve → adapt.**

## 4. Run Structure

**Track:** langt, primært lineært track fra A (start) til B (boss). Målet er ikke at nå bossen hurtigst muligt, men **at nå bossen med et build stærkt nok til at besejre den.**

**Run length:** ca. 15–25 dice rolls pr. run, ~20 som forventet gennemsnit → track på ~65–80 felter. Præcist antal findes via simulation og playtesting. *(Kalibreret: 70 felter — se ændringslog.)*

## 5. Movement

Base die: **1 × D6.** Resultatet bestemmer antal felter. En høj roll er ikke nødvendigvis bedre end en lav — en 6'er kan føre forbi Treasure direkte til en Elite; en 2'er kan ramme en værdifuld Shop. Dette er centralt for designet.

## 6. Movement Manipulation

**Nudge:** ændr et roll med +1 eller −1. Begrænsede charges.

**Reroll:** kassér resultatet og slå igen. Det nye resultat skal som udgangspunkt accepteres — reroll indeholder derfor selv risiko.

Fremtidige muligheder: roll two choose one, flip die (1↔6, 2↔5, 3↔4), ±2, move backwards, split movement, stored dice, fixed rolls, dice manipulation gennem gear/relics. Proof of concept starter med **Reroll + Nudge.**

## 7. Board Visibility

Spilleren skal kunne se en betydelig del af banen fremad — tentativt **8–12 kommende felter** — så flere rolls kan planlægges. Movement bliver dermed mere end reaktiv RNG.

## 8. Tile Types

Ikke alle felter indeholder encounters. Tentativ fordeling: **~60–65 % aktive felter, ~35–40 % blanks.**

- **Blank:** ingen effekt. Pacing, safe spaces, movement targets, fremtidigt design-space.
- **Enemy:** automatisk combat. Rewards: XP + lidt Gold. Normale enemies er ikke primær loot-kilde. *(Justeret: 25 % drop-chance — se ændringslog.)*
- **Elite:** sværere combat. Høj XP, Gold, stærkere reward, Relic, sjældent equipment/spell. Tydelig risk/reward.
- **Treasure:** primær kilde til gear og build rewards. Fx "choose 1 of 3".
- **Gold:** Gold uden risiko.
- **Shop:** vigtigt build-control point. Gold → upgrades og services.
- **Camp:** safe utility tile. Heal, recharge, recovery. Præcis funktion TBD.
- **Event:** choice-based encounter med trade-offs (fx Shrine: +2 Damage, boss +10 % HP).
- **Trap / negativt felt:** skade, guldtab, debuff m.m. Bruges med måde.
- **Boss:** trackets slutmål — den endelige test af build og resterende resources.

## 9. Hero Stats

- **HP:** persistent gennem hele runnet. Resetter IKKE efter combat. Central run-resource.
- **Damage:** heroens offensive power. Evt. lille range (fx 7–10), men begrænset combat-RNG.
- **Armor:** reducerer indgående skade. `Incoming Damage − Armor = Damage Taken`. Minimum damage TBD.

## 10. Player Levels & XP

Start: Level 1. Enemies er primær XP-kilde — direkte incitament til aktivt at opsøge combat.

**XP-kurve:** requirement stiger pr. level (form: 20/30/45/65/90/125/170 — endelige tal TBD). *(Kalibreret: 20/30/40/55/75/100/135 — se ændringslog.)*

**No level cap:** runlængde, enemies og stigende requirements skaber naturligt soft cap.

**Level up:** choose 1 of 3 (+Damage / +Max HP / +Armor). *(Ændret til rotation som default — se ændringslog.)*

## 11. Progression Layers

Fem primære lag: **Levels** (raw power, fra combat/XP), **Equipment**, **Spells**, **Relics**, **Movement resources**.

## 12. Equipment

Kun få slots — undgå klassisk RPG inventory-bloat:

- **Weapon:** primær offensiv identitet (fx Iron Sword 7–9; Dagger 5–7, first attack double; Warhammer 10–14, ignores Armor).
- **Armor:** primær defensiv identitet (Armor, Max HP, healing, defensive triggers).
- **Boots / Utility:** kobler hero-build til board-gameplay (fx Traveler's Boots: gratis Nudge efter Camp; Heavy Greaves: +Armor, 6 tæller som 5; Winged Boots: once per run, move +1 after landing).

## 13. Spells

Tentativt **2 spell slots**. Ingen mana — begrænsede uses for hele runnet (fx Fireball 2/2). Charges kommer ikke automatisk tilbage; recovery via Camps, Shops eller effects.

- **Combat spells:** Fireball (direct damage), Barrier (block next attack), Heal.
- **Board spells:** Blink (±2 movement), Transmute (Blank → Gold).

Spells skaber valg mellem combat-power og board-control.

## 14. Relics

Tentativt **3 relic slots.** Game-bending rules frem for "+5 % Damage": Golden Idol (Blanks giver Gold), Loaded Die (kan ikke slå 1), Blood Compass (bedre enemy rewards, men manipulation kan ikke undgå Enemy-felter), Mimic Tooth, Scholar's Skull. Central kilde til build diversity.

## 15. Consumables

Tentativt **2 consumable slots.** Healing Potion, Bomb, Smoke Bomb, Loaded Die, Teleport Scroll. Tactical single-use — især attraktive shop-køb.

## 16. Gold

Fleksibel progression. Kilder: Gold-felter, enemies (lidt), elites, events. Spenderes primært i shops.

## 17. Shops

Mere end equipment vendors — steder hvor runnet kan rettes op eller specialiseres. Ca. 4–6 varer/services: weapons, armor, boots, spells, consumables, enkelte relics; services: heal, buy Nudge/Reroll, recharge spell, refresh shop. *(Besluttet: udvalget skal være begrænset — ingen buffet.)*

## 18. Combat Philosophy

**100 % automatisk som udgangspunkt.** Spilleren bygger heroen; combat viser resultatet.

Turn structure: Hero attacks → Enemy attacks → gentag til én side når 0 HP. Ingen attack speed, initiative eller real-time cooldowns. **Hero angriber først** → tydelige damage breakpoints (én upgrade kan fjerne et helt fjende-angreb).

## 19. Combat RNG

> **High board RNG, low combat RNG.**

Mindre damage-range acceptabel (fx 8–10). Undgå som baseline: høj miss/dodge chance, ekstrem crit-RNG, tilfældig initiative, store random swings.

## 20. Persistent HP

HP fortsætter mellem encounters — combat har en reel pris. En Enemy er ikke "kan jeg slå den?" men "hvor meget HP koster den?" Enemy encounters ≈ **HP → XP-konvertering** (fx mist 8 HP, få 18 XP + 3 Gold). Balanceres via testing.

## 21. Enemy Design

Samme simple fundamentals: HP, Damage, Armor, evt. én simpel trait. Variation primært via stat-profiler: Goblin (lav/lav), Ogre (høj/høj), Knight (høj Armor), Assassin (lav HP, first-strike/særregel). Complexity introduceres langsomt.

## 22. Combat Rewards

**Normal enemy:** XP + lidt Gold. Equipment drops sjældne. **Elite:** stor XP, Gold, værdifuld build reward.

## 23. Resource Tension

HP (betaler for combat) · Gold (fleksibel power) · XP (raw power) · Nudges/Rerolls (board outcomes) · Spell charges (combat/board advantage) · Consumables (emergency). Et godt run handler om at vide, hvilken resource der er værd at bruge nu versus senere.

## 24. Run Arc

**Early:** lav risiko, første levels og equipment. **Mid:** buildet får identitet; shops, elites, events vigtigere. **Late:** højere pres; remaining HP, spells og consumables kritiske. **Boss:** endelig build-check.

## 25. Long-Term Direction: Endless Board

A→B er proof of concept. Langsigtet vision: dynamisk endless board (Loop Hero-inspireret) med Board Cards (Forest, Graveyard, Village, Merchant, Shrine, Gold Mine, Monster Camp) med både positive og negative konsekvenser. Spilleren bygger ikke kun sin hero — også den verden, heroen skal overleve i.

## 26. Future Boards

Flere board-typer på sigt: lineært dungeon track, endless loop, branching, collapsing, cursed, interconnected loops. Dice system, hero progression og combat bevares; boardets regler ændres.

## 27. Proof of Concept Scope

**Board:** ~65–80 tiles, ~35–40 % blank, én start, én boss. **Movement:** D6, Nudges, Rerolls. **Tiles:** Blank, Enemy, Elite, Gold, Treasure, Shop, Camp, Event, Boss. **Hero:** HP, Damage, Armor, Level, XP, Gold. **Equipment:** Weapon, Armor, Boots. **Yderligere:** 2 spell slots, 3 relic slots, 2 consumable slots. **Combat:** fuldt automatisk, hero først, skiftevis, persistent HP.

## 28. Primary Prototype Questions

1. Er movement i sig selv sjovt?
2. Er Nudges og Rerolls værdifulde uden at fjerne RNG?
3. Hvor mange Blank tiles føles rigtigt (~35–40 %)? *(Sim-svar: ja, 37 % rammer ~20 rolls.)*
4. Hvor langt skal et run være (~20 rolls)? *(Sim-svar: 70 felter → 20,2 rolls.)*
5. Er Enemy encounters attraktive?
6. Hvor meget HP skal combat koste? *(Sim-svar: ~0,4 HP/XP.)*
7. Hvor hurtigt skal spilleren level? *(Sim-svar: L4,8-5,2 ved boss med kalibreret kurve.)*
8. Er de forskellige progression systems tydelige?
9. Føles bossen som resultatet af hele runnet?

## 29. Current Core Vision

> **Et roguelike RPG, hvor et terningeslag trækker dig gennem et farligt board, og dit egentlige gameplay består i at manipulere oddsene, vælge hvilke risici der er værd at tage og bygge en hero stærk nok til at overleve det board, RNG'en giver dig.**

På længere sigt kan samme system udvikle sig fra et simpelt A→B-track til et levende endless board, som spilleren selv er med til at forme.
