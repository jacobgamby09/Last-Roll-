# Rollbound — playtest-noter (v1, core-loop-gaten)

Formål: besvare AGENTS.md's succeskriterier gennem 5-10 runs. Udfyld ét afsnit pr. run
(kopiér skabelonen), og saml de tværgående svar til sidst. Noter FØLELSER og ØJEBLIKKE,
ikke kun udfald — sim'en kender allerede tallene.

Praktisk: spillet husker seedet (vises i UI og game over). Notér seedet, så interessante
runs kan genspilles og diskuteres. `?seed=X` i URL'en genskaber et run.

---

## Skabelon pr. run

### Run N · seed ____ · resultat: SEJR / DØD (felt __, årsag ____) · rolls __ · level __

- **Bedste beslutningsøjeblik** (det tætteste på "jeg slog en 5'er — fjenden, min sidste nudge eller gamble?"):
- **Kedeligste stræk** (hvor føltes det som at trykke rul uden at tænke?):
- **Nudges/rerolls:** følte du dig presset på dem? Sad du med ubrugte til sidst?
- **Consumables:** brugte du dem? Var pre-combat-beatet et løft eller en afbrydelse?
- **Build-identitet:** kan du beskrive dit build i én sætning? ("Jeg var …")
- **Shoppen:** var det seedede udvalg spændende eller frustrerende?
- **Bossen:** vidste du undervejs, om du var på rette kurs? Føltes udfaldet fortjent?
- Andet (bugs, forvirring, UI-friktion):

---

## Tværgående spørgsmål (efter alle runs) — AGENTS.md's succeskriterier

1. **Er movement i sig selv sjovt?** Rul → vurdér destinationer → manipulér? → commit.
2. **Giver nudges/rerolls nok agency uden at fjerne RNG?** (målet er ~70/30 adaptation/control)
3. **Opsøgte du aktivt kampe for XP?** Og undgik du nogle af frygt for HP-prisen?
4. **Føltes to runs forskellige?** (item-variation, board-variation, build-identitet)
5. **Rytmen:** er scene-tempoet (kamp, loot, shop) rigtigt — for langsomt/hurtigt?
6. **Ca.-stats-inspektionen:** savnede du den eksakte pris, eller bar usikkerheden?
7. **Den vigtigste enkeltting at ændre før næste playtest:**

## Kendte spørgsmål, playtesten skal afgøre (fra design-forløbet)

- Rotation-levels: føles den faste ATK→HP→Armor-rækkefølge som belønning eller tab af kontrol? (choice-mode ligger bag config-flag)
- Equip/Keep-pausen på combat-drops: beriger eller bremser den?
- Vildøksen og de brede ranges: føles varians fair, eller snyder terningen?
- Røgbombens gratis flugt: for stærk?
- Er 5-slots-shoppens "skuffelses-ruller" (kun services) sjove eller irriterende?
