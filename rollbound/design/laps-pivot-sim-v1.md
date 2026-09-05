# Lap-pivot: sim-findings v1 (2026-09-05)

Headless prototype af lap/board-building-pivotet (cirkulært board, boss ved
Start pr. lap, draft efter boss, dieFaces som build-akse, lave ruller = flere
landinger). Engine: `src/laps/engine.ts`, sim: `scripts/simulate-laps.ts`
(`npx vite-node scripts/simulate-laps.ts 2000`). Rå output: `laps-sim-output-v1.md`.
Det spilbare spil er urørt og frosset som git-tag **`track-prototype-v1`**.

**Formål:** besvare pivot-dokumentets konkrete spørgsmål (rolls pr. lap,
HP-attrition, all-1s-degenerering, board-størrelse, grow vs fixed) med 2000
runs pr. celle — 7 board-configs × 5 draft-strategier, finalLap 8.

**Vigtig ramme:** tallene her er IKKE en kalibreret balance — de er
strukturelle signaler. Botterne er grove, og reward-tallene er førsteskud.
Retningen af effekterne (10× forskelle) er dog for stor til at være bot-støj.

## Setup

- Start: board med 1 Start + 7 seed-tiles (2 combat, elite, camp, gold, chest, shop), resten blanks; die `[6,6,6,5,5,5]`; hero HP 30 / ATK 5; 2 nudges + 1 reroll pr. lap.
- Boss ved hver Start-passage, skalerer pr. lap; sejr = besejr final boss (lap 8). Fuld heal efter hver boss (lap = selvstændig eksamen).
- Draft 1 af 3 efter boss: board-tile (45 %) / die-sænkning (25 %) / character (+2 ATK, +10 HP, thorns, killheal) (30 %).
- Roll-gatede kvalitetsfelter pr. dokumentets forslag: Vault (guld = 2×rul), Shrine (+1 ATK kun ved rul ≥ 4).
- Strategier: `lowRoller` (all-1s-testen), `highRoller` (vault/shrine-jagt), `boardEngine`, `charFirst`, `balanced`.

## Nøgletal (2000 runs pr. celle — fuld tabel i laps-sim-output-v1.md)

| Config | lowRoller | highRoller | boardEngine | charFirst | balanced |
|---|---|---|---|---|---|
| fixed 10 | 0,8 % | 5,3 % | 1,6 % | **33,2 %** | 17,1 % |
| fixed 12 | 1,1 % | 7,3 % | 2,5 % | **37,1 %** | 21,3 % |
| fixed 16 | 5,1 % | 16,1 % | 7,2 % | **48,3 %** | 31,3 % |
| fixed 20 | 5,8 % | 18,8 % | 8,1 % | **51,3 %** | 33,5 % |
| grow 12→20 | 0,9 % | 9,3 % | 3,4 % | **40,8 %** | 22,6 % |
| fixed 12 · die×2 | 1,1 % | 7,3 % | 2,3 % | **37,3 %** | 20,9 % |
| fixed 20 · die×2 | 7,8 % | 19,2 % | 8,8 % | **50,8 %** | 36,6 % |

Rolls pr. lap: 1,9-2,0 (size 10) · 2,2-2,3 (size 12) · 3,0-3,1 (size 16) · 3,7-4,0 (size 20).

## Fund

1. **All-1s-frygten er (i denne model) ubegrundet — problemet er det OMVENDTE.**
   `lowRoller` er den dårligste strategi overalt, selv når hvert die-draft
   sænker to faces (die×2). Landinger er simpelthen ikke værdifulde nok til at
   bære en movement-build: én ekstra landing pr. lap er ~+1 ATK-ækvivalent,
   mens et char-draft giver +2 ATK direkte. Terning-aksen skal have markant
   mere kraft (eller landings-værdien op), før den overhovedet er et valg —
   OG det betyder samtidig, at dokumentets modvægte (Vault/Shrine) ikke kan
   evalueres endnu, for der er intet lav-rul-pres at holde imod.

2. **Direkte stats dominerer alle indirekte akser.** `charFirst` vinder hver
   eneste celle med faktor 5-40× over board/die-strategier. Årsag: alle checks
   i modellen (combat, elite, boss) er ATK-checks, og guld→shop→ATK-ruten er
   en ineffektiv omvej. Skal tre-akse-visionen holde, skal enten char-drafts
   nerfes, eller board-værdi skal kunne noget stats ikke kan (synergi/adjacency,
   unikke effekter) — ellers kollapser draften til "tag altid stats".

3. **Board-størrelse er en ren power-knap.** Win rates ca. fordobles fra
   size 10 → 20 for ALLE strategier, fordi flere landinger pr. lap = mere vækst,
   mens bosser kun skalerer pr. lap. Konsekvens for designet: enemy/boss-skalering
   skal koble sig til antal landinger eller board-størrelse (elegant tematik:
   "større verden, større eksamen") — ellers er expansion gratis power.

4. **En lap er meget kortere end frygtet.** Dokumentet frygtede 8-12 rolls
   pr. lap; virkeligheden med start-terningen er 2 (size 10-12) til 4 (size 20).
   Snappiness-problemet er altså lille — det reelle problem er det modsatte:
   på size 10-12 er en lap kun ~2 landinger og føles næppe som en rejse.
   **Size 16-20 ser ud til at være det rigtige leje** (3-4 landinger pr. lap).

5. **Grow 12→20 underperformer fixed 16/20.** Væksten kommer for sent til at
   kompoundere (draft-slots brugt på expansion er drafts, der ikke blev stats).
   Hvis "boardet vokser" skal være en bærende fantasi, skal expansion være
   billig/tidlig (fx gratis +1 felt pr. boss OVENI draften) frem for at
   konkurrere med de andre akser om draft-slots.

6. **HP-attrition:** med fuld heal efter boss ligger HP ved final boss på
   25-35 (af ~40-60 max) — bossen koster, og elites er reelle beslutninger
   undervejs, men intra-lap-attrition er mild. Uden fuld post-boss-heal (v0
   af modellen) var spillet uvindbart (0 % overalt) — heling mellem laps er
   altså en BÆRENDE konstant, ikke en detalje.

## Anbefalede næste eksperimenter (sim v2)

1. **Ny fjende-skalering:** skalér med samlede landinger (eller board-size-
   faktor) i stedet for kun lap — test om det udligner size 10 vs 20.
2. **Nerf char-draften / buf landings-værdi** til akserne krydser: mål er at
   mindst tre strategier ligger inden for ~10 pp af hinanden.
3. **Terning-aksen som KVALITET frem for kun kvantitet:** faces med effekter
   ("6'eren tæller som vault-trigger", "1'eren healer 2") i stedet for rene
   tal-sænkninger — det er formentlig dér, dice-buildet bliver interessant.
4. **Gratis expansion pr. boss** (+1 felt oveni draften) for grow-fantasien.
5. Først DEREFTER er all-1s-spørgsmålet værd at genteste.

## Konklusion

Loopets skelet virker (laps, boss-eksamen, draft), og lap-længden er sund ved
size 16-20. Men tre-akse-balancen — pivotets kerneidé — findes ikke gratis:
i den naive model er stats konge, terningen irrelevant og board-størrelse en
exploit. Alle tre er adresserbare med kendte greb (se ovenfor), og ingen af
dem kræver UI for at teste. Anbefaling: én sim-iteration mere på akse-balancen,
før der overhovedet tegnes skærme.
