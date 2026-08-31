# Last Roll — sim-findings (2026-08-31)

10.000 runs pr. konfiguration, seedet RNG. Rå tal i [RESULTS.md](RESULTS.md), kode i [simulate.js](simulate.js), talsæt i [variants.js](variants.js).

## Hovedkonklusion

**Det oprindelige talsæt (v0.1) var uspilbart: win rate ~0% for alle strategier.** Regnestykkerne bag forslaget undervurderede bosskampens pris (faktisk 83-172 HP mod en typisk ankomst-HP på 22-43) og overvurderede antal kampe pr. run (3,9-4,7 mod de forventede 6-8). Efter fire kalibreringsrunder lander **v0.5** på målene.

## Det kalibrerede talsæt (v0.5) — ændringer fra forslaget

| Parameter | Forslag | v0.5 | Hvorfor |
|---|---|---|---|
| Hero start-damage | 8 | **10** | Goblin skal dø på 2 hits fra start → HP→XP-kurs ~0,4 |
| Level-up +Damage | +3 | **+4** | Fjende-HP vokser 15→24→36; +3 fulgte ikke med |
| Level-up +MaxHP | +8 | **+10** | Skal konkurrere med +4 dmg |
| XP-kurve | 20/30/45/65/90/125/170 | **20/30/40/55/75/100/135** | Ellers nås L5 aldrig med realistisk kampantal |
| Bandit dmg | 9 | **8** | Mid-run kampe kostede for meget HP |
| Ogre dmg | 13 | **11** | Late-run kampe kostede 30+ HP — langt over 0,4-kursen |
| Elite dmg | 10/13/16 | **9/12/14** | Samme logik |
| Camp heal | 15 | **20** | HP-økonomien var samlet underbudgetteret |
| Gold-felt | 10 | **12** | Indkomst lå på ~36, mål ~50 |
| Shop: våben/armor/heal | 30/25/10 | **25/20/8** | Botten døde med ~34 uspenderet guld |
| Boss | 110 HP / 15 dmg / 3 armor | **95 / 10 / 2** | Den store synder — se nedenfor |

Uændret: 50 start-HP, track 70 felter, tilefordeling, fjende-HP/XP/guld, nudge 2 + reroll 1, trap/event-tal.

## Resultater med v0.5

| Bot | Win rate | Når boss | Kampe | Level v. boss | Boss koster |
|---|---:|---:|---:|---:|---:|
| Balanced | **54,3%** | 90,6% | 5,3 | 4,6 | 40 HP |
| Aggressive | 31,7% | 70,6% | 6,0 | 4,9 | 31 HP |
| Cautious (kamp-sky) | 23,1% | 70,2% | 2,7 | 3,0 | 55 HP |
| Balanced **uden** nudge/reroll | 25,5% | 53,9% | 4,2 | 4,3 | 42 HP |

## Svar på GDD'ens prototype-spørgsmål

**Spm. 3 (blank-andel) & 4 (run-længde):** ~20 rolls pr. run rammes præcist med 70 felter. Ingen grund til at ændre track-strukturen.

**Spm. 6 (HP-pris pr. kamp):** HP→XP-kursen lander på 0,39 HP/XP for balanced — præcis den tilsigtede ~0,4. Men den er kun sund, hvis fjende-damage skaleres blødere end fjende-HP (dmg 6→8→11, ikke 6→9→13). Fjende-HP må gerne vokse hurtigt (det æder heroens tid); fjende-DAMAGE er den farlige knap.

**Spm. 7 (XP-kurve):** Den originale kurve var for stejl til 4-6 kampe pr. run. Med den blødere kurve når balanced L4,6 og aggressive L4,9 — power spikes mærkes stadig (hvert level = +4 dmg eller +10 HP).

## Vigtigste design-findings (ud over tallene)

**1. Bossen skal beregnes baglæns, ikke sættes fremad.** Bossens pris = (hits-til-kill − 1) × (boss-dmg − armor). Den er ekstremt følsom: 110 HP/15 dmg gav 98 HP i pris; 95/10 giver 40. Reglen: *bossens forventede pris skal ligge under den forventede ankomst-HP for et fornuftigt run* (~45 HP). Når rigtige spillere får spells/consumables i v0.2, kan bossen skrues op igen — de systemer er reelt "ekstra HP".

**2. Damage dominerer stadig level-up-valget — GDD-bekymringen er bekræftet.** Tvunget altid-+dmg vinder 47,3%, altid-+HP 29,8%, altid-+armor 24,2%. +4 dmg er ca. dobbelt så meget værd som alternativerne. Skal choose-1-of-3 være et reelt valg, kræver det de armor-breakpoints, der allerede er nævnt i feedbacken (fx "armor X → Goblins giver 1 dmg"), eller at +dmg ikke altid er på menuen.

**3. Movement manipulation er præcis så vigtig som designet ønsker.** Uden nudges/rerolls falder win rate fra 54% til 26%, og kun 54% når overhovedet bossen (mod 91%). Nudges bruges ~2,3 pr. run. Det bekræfter også advarslen om kontrol: manipulationen fordobler win rate, så charge-økonomien ER balancen.

**4. Kamp-sky spil taber — som designet vil have det.** Cautious-botten (2,7 kampe) ender på L3 og vinder 23%. XP-incitamentet virker: man SKAL opsøge kampe. Aggressive taber derimod på HP-udmattelse (min-HP 11), ikke på styrke — dens boss koster kun 31 HP, men den ankommer med 29. Det er en sund akse: grådighed straffes med HP, fejhed straffes med XP.

**5. Sent guld er dødt guld.** Med 3 shops og ~28% lande-sandsynlighed rammes ~1 shop pr. run. Guld tjent efter sidste shop er værdiløst. Selv med billigere priser bruger botten kun ~16 af ~51 guld. Overvej: shop-garanti i sidste tredjedel tæt på bossen ("sidste lejr før bjerget"), eller at Camp kan sælge heals. Det er nok den svageste del af økonomien lige nu.

**6. Track-attrition var v0.1's skjulte morder.** I v0.1 døde flere på tracket (enemy+elite-tvangskampe) end mod bossen for 2 af 3 bots. Med fuld synlighed og deterministisk combat kan spillet altid VISE prisen — men når nudges er brugt, kan man stadig tvinges ind i en dødelig kamp. Det er den reelle rolle for consumables/spells i v0.2 (Smoke Bomb, Blink = escape hatches).

## Forbehold

- Botten er en heuristik, ikke optimal. En rigtig spiller spiller bedre → reelle win rates ligger formentlig 5-15 pp over bottens. 54% for balanced-botten svarer altså nok til ~60-70% for en kompetent spiller — hvilket er i målbåndet.
- Combat er 100% deterministisk i sim (ingen damage-range) — det gør fjende-prisen perfekt forudsigelig for botten. Med 8-10-ranges bliver tallene let blødere, men strukturen holder.
- Spells, relics, consumables og rigtige events er IKKE med (bevidst v0.1-scope). De er alle "power tilføjet spilleren" → når de kommer på, skal boss/fjender op, ikke ned.

## Opfølgning: Damage-dominans løst med repricing (v0.7)

Testet 2026-08-31 med tvungne level-up-policies (10.000 runs pr. konfiguration, balanced bot):

| Level-up-menu | altid +dmg | altid +HP | altid +armor |
|---|---:|---:|---:|
| v0.5: +4 dmg / +10 HP / +1 armor | 47,3% | 29,8% | 24,2% |
| +2 armor i stedet | 47,3% | 29,8% | **62,2% (dominerer!)** |
| +14 HP i stedet | 47,3% | 43,4% | 24,2% |
| **v0.7: +4 dmg / +14 HP / +1 armor & +6 HP** | **47,3%** | **43,4%** | **45,4%** |

**Konklusion:** Dominansen var et prissætningsproblem, ikke et systemproblem. Med v0.7-menuen er de tre picks jævnbyrdige (spread på 4 pp), og den blandede smart-strategi (63,4%) slår alle rene strategier — valget er reelt og situationsbestemt.

**Strukturel indsigt om armor:** Flat armor mod flat fjende-damage er en knivsæg — +1 pr. level er for svag (24%), +2 løber løbsk (62%, fordi 6-7 armor næsten nuller normale fjender og skærer bossen til 21 HP). Rene armor-increments kan derfor ikke balanceres med tuning alene; hybrid-picket (+1 armor & +6 maxHP) løser det. Fremtidig vagt: når equipment/relics OGSÅ giver armor, kan stakning genskabe v0.6a-problemet — modtræk er fjender med armor-piercing eller høj single-hit-damage (passer i "one simple special trait"-rammen).

v0.7 er det nye kanoniske talsæt i [variants.js](variants.js). Balanced bot: 63,4% win (mennesker formentlig højere — evt. skal bossen en tand op i v0.2-sim).

## Opfølgning 2: Faste level-ups uden spillervalg (testet 2026-08-31)

To modeller testet oven på v0.7 (10.000 runs, kode i variants-fixedlevel-test.js, `levelUp.mode` i simulate.js):

| Model | Aggressive | Balanced | Cautious |
|---|---:|---:|---:|
| v0.7 valgmenu (reference) | 35,1% | 63,4% | 29,0% |
| **Rotation** ATK→HP→Armor (v0.7-increments) | 34,3% | 54,5% | 28,3% |
| **Flat** +2 dmg / +7 HP hvert level, +1 armor hvert andet | 52,4% | 72,2% | 34,4% |

Begge er levedygtige og trivielle at tune. Bemærkelsesværdigt: **flat udjævner forskellen mellem spillestile** (alle får en balanceret statline, så aggressive straffes mindre for aldrig at vælge HP), mens **rotation bevarer mærkbare, forudsigelige spikes**. Rotation har en unik kvalitet: næste levels bonus er kendt på forhånd, så "tager jeg kampen nu og når +Armor-levelet FØR eliten?" bliver en board-beslutning — det flytter beslutningsindhold fra menu til bræt.

**Trade-off:** Uden level-valg falder antal build-beslutninger pr. run fra ~8 til ~3-4 (kun treasure + shop). Equipment skal så bære hele build-identiteten — hvilket kræver at "sent guld er dødt guld"-problemet løses, og at gear har identitet (ikke kun +stats). Begge modeller ligger som config-flag (`levelUp.mode: 'choice' | 'rotation' | 'flat'`), så prototypen kan A/B-teste det.

## Opfølgning 3: Enemy loot drops oven på rotation (testet 2026-08-31)

Drop = 1 tilfældigt treasure-item (intet valg). Basis = v0.7 + rotation-levels. 10.000 runs (variants-loot-test.js):

| Model | Aggressive | Balanced | Cautious | Kampe/run (bal) | Drops/run (bal) |
|---|---:|---:|---:|---:|---:|
| Ingen drops (reference) | 34,3% | 54,5% | 28,3% | 5,3 | 0 |
| Kun elite (100%) | 40,7% | 61,1% | 29,7% | 5,5 | 1,1 |
| Normal 25% + elite 100% | 51,2% | 68,8% | 41,7% | 5,9 | 2,3 |
| Normal 50% (stresstest) | 61,3% | 74,9% | 52,9% | 6,6 | 3,9 |

**Konklusioner:**
- **Elite-loot er en ren gevinst:** elite-kampe pr. run stiger 0,82 → 1,09 (botten opsøger dem aktivt), strategi-spredningen bevares, og det matcher GDD'ens "stronger build rewards". Bør adopteres.
- **25% på normale mobs er spilbart og ikke degenereret** — rækkefølgen aggressive < balanced holder, og kampantallet nærmer sig GDD-målet på 6-8. MEN: 2,3 drops/run overstiger Treasure-landinger (~1,7), så fjender bliver største gear-kilde — det strider mod tile-identiteten ("normal enemies should NOT be a major source of gear").
- **Anbefalet form:** to loot-pools. Normale mobs dropper småting fra en utility-pool (guld, potion, nudge) ved ~20-25%; elites dropper rigtige build-pieces (gear/spell/relic) garanteret. Treasure beholder choose-1-of-3 som den *kontrollerede* gear-kilde — kontrol-gradienten bliver: Shop (fuld kontrol) > Treasure (vælg 1 af 3) > Elite (garanteret, tilfældigt) > mob-drop (lotteri).
- Win rates inflaterer (~69% ved 25%): bossen skal en tand op igen, hvis drops adopteres (fx 105 HP).

## Opfølgning 4: Længere runs (testet 2026-08-31)

Track-længde, tredjedele og genereringsregler er nu parameteriseret i simulate.js. Testet med v0.7 + rotation + drops 25%/100% (variants-length-test.js), tile-fordeling skaleret proportionalt, boss skaleret manuelt:

| Balanced bot | 70 felter (~20 rolls) | 105 (~30 rolls) | 140 (~40 rolls) |
|---|---:|---:|---:|
| Kampe pr. run | 5,9 | 9,1 | 12,3 |
| Level v. boss | 4,9 | 6,2 | 7,1 |
| Build-touchpoints (drops) | 2,3 | 3,7 | 4,8 |
| Guld brugt | 20 | 34 | 52 |
| **HP→XP-kurs** | **0,39** | **0,32** | **0,26** |
| HP% sidste tredjedel | 58% | 57% | 64% |

**Hovedfund: et længere run kan ikke bare være "mere af det samme".** Med kun 3 statiske fjende-tiers outskalerer heroen banen — HP→XP-kursen falder fra 0,39 til 0,26, og sidste tredjedel bliver *lettere* i stedet for hårdere (HP% stiger). Spændingskurven flader ud. Længde kræver eskalering: flere fjende-tiers (4-5) eller act-struktur med stigende sværhedsgrad.

**Til gengæld leverer længden det ønskede:** flere kampe (12,3 nærmer sig "rigtig roguelike"-tæthed), dobbelt så mange build-touchpoints, rotationen når 2+ hele cyklusser, og guld-økonomien får luft (52 brugt — "dødt guld"-problemet skrumper med flere shops). Min-HP og HP-kurve holder — tension kollapser ikke.

**Advarsel:** cautious/armor-stacking styrkes markant på lange runs (7,5 armor ved 140 → 46% win) — armor-knivsæggen genopstår over længere horisonter. Endnu en grund til eskalerende fjende-damage eller armor-piercing traits i late game.

**Anbefaling:** Prototypen bør stadig teste 70 felter først (hurtigst at playteste), men track-længde er nu ren data — en act-baseret 105-140-version (2-3 segmenter med egen tier + mini-boss) er den oplagte form for "længere", fordi eskalering følger gratis med.

## Næste skridt

1. **v0.2-sim:** spells (Fireball/Heal) + consumables + rigtige events med trade-offs; boss skrues op tilsvarende.
2. **Armor-breakpoints:** test level-up-menuer hvor +dmg ikke altid er tilgængelig, eller hvor armor har tydelige nul-damage-breakpoints.
3. **Spilbar HTML-prototype** af core-loopet (Roll → Evaluate → Manipulate → Resolve) med v0.5-tallene — spørgsmål 1 og 2 ("er det sjovt?") kan kun besvares i hånden.
