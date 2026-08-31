# Last Roll — simulationsresultater
10000 runs pr. konfiguration. Seedet RNG (reproducerbar).


# Variant: 105-felter-30-rolls
```json
{"hero":{"dmg":10},"levelUp":{"mode":"rotation","dmg":4,"hp":14,"armor":1,"armorHp":6},"xpCurve":[20,30,40,55,75,100,135],"enemies":{"mid":{"dmg":8},"late":{"dmg":11}},"elites":{"early":{"dmg":9},"mid":{"dmg":12},"late":{"dmg":14}},"camp":{"heal":20},"goldTile":12,"shop":{"weapon":{"dmg":4,"cost":25},"armor":{"armor":2,"cost":20},"heal":{"hp":15,"cost":8}},"drops":{"normal":0.25,"elite":1},"trackLength":105,"tiles":{"blank":38,"enemy":24,"gold":9,"treasure":9,"camp":6,"event":6,"shop":4,"elite":5,"trap":3},"boss":{"hp":150,"dmg":12,"armor":3}}
```

## Eksperiment 1: Tre bot-strategier
### aggressive
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **36.2%** | 80.3% | 28.8 | 9.8 (1.56) | 6.31 | 48.3 | 82/31 | 4.05/0.54 | 19.3 | 83.0% / 59.9% / 52.7% |
Hero v. boss: 29.0 dmg, 2.22 armor, 92.4 maxHP — bosskamp koster 53.5 HP. HP→XP-kurs: 0.31 HP/XP. Drops: 3.62/run.
Dødsårsager: boss:4409 enemy:828 elite:852 event:171 trap:117

### balanced
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **50.4%** | 90.8% | 29.8 | 9.1 (1.84) | 6.21 | 58.6 | 87/34 | 3.41/0.40 | 25.0 | 87.3% / 64.6% / 57.3% |
Hero v. boss: 28.4 dmg, 2.50 armor, 103.5 maxHP — bosskamp koster 53.4 HP. HP→XP-kurs: 0.32 HP/XP. Drops: 3.65/run.
Dødsårsager: elite:441 boss:4039 enemy:352 trap:53 event:76

### cautious
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **29.4%** | 75.4% | 28.4 | 5.4 (0.35) | 4.58 | 59.6 | 64/24 | 3.21/0.96 | 32.3 | 91.6% / 79.9% / 72.0% |
Hero v. boss: 17.3 dmg, 5.24 armor, 87.8 maxHP — bosskamp koster 71.1 HP. HP→XP-kurs: 0.36 HP/XP. Drops: 1.61/run.
Dødsårsager: boss:4606 elite:1959 enemy:462 event:20 trap:15

## Eksperiment 2: Level-up-dominans (balanced bot, tvunget pick)
### altid +dmg
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **50.4%** | 90.8% | 29.8 | 9.1 (1.84) | 6.21 | 58.6 | 87/34 | 3.41/0.40 | 25.0 | 87.3% / 64.6% / 57.3% |
Hero v. boss: 28.4 dmg, 2.50 armor, 103.5 maxHP — bosskamp koster 53.4 HP. HP→XP-kurs: 0.32 HP/XP. Drops: 3.65/run.
Dødsårsager: elite:441 boss:4039 enemy:352 trap:53 event:76

### altid +hp
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **50.4%** | 90.8% | 29.8 | 9.1 (1.84) | 6.21 | 58.6 | 87/34 | 3.41/0.40 | 25.0 | 87.3% / 64.6% / 57.3% |
Hero v. boss: 28.4 dmg, 2.50 armor, 103.5 maxHP — bosskamp koster 53.4 HP. HP→XP-kurs: 0.32 HP/XP. Drops: 3.65/run.
Dødsårsager: elite:441 boss:4039 enemy:352 trap:53 event:76

### altid +armor
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **50.4%** | 90.8% | 29.8 | 9.1 (1.84) | 6.21 | 58.6 | 87/34 | 3.41/0.40 | 25.0 | 87.3% / 64.6% / 57.3% |
Hero v. boss: 28.4 dmg, 2.50 armor, 103.5 maxHP — bosskamp koster 53.4 HP. HP→XP-kurs: 0.32 HP/XP. Drops: 3.65/run.
Dødsårsager: elite:441 boss:4039 enemy:352 trap:53 event:76

## Eksperiment 3: Uden movement manipulation (balanced, 0 nudges/rerolls)
### balanced uden manipulation
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **30.4%** | 66.0% | 26.9 | 7.2 (1.09) | 5.72 | 56.1 | 69/22 | 0.66/0.00 | 24.2 | 86.8% / 66.1% / 59.1% |
Hero v. boss: 26.7 dmg, 2.16 armor, 96.5 maxHP — bosskamp koster 59.9 HP. HP→XP-kurs: 0.35 HP/XP. Drops: 2.60/run.
Dødsårsager: elite:2546 boss:3559 enemy:752 event:57 trap:41


# Variant: 140-felter-40-rolls
```json
{"hero":{"dmg":10},"levelUp":{"mode":"rotation","dmg":4,"hp":14,"armor":1,"armorHp":6},"xpCurve":[20,30,40,55,75,100,135],"enemies":{"mid":{"dmg":8},"late":{"dmg":11}},"elites":{"early":{"dmg":9},"mid":{"dmg":12},"late":{"dmg":14}},"camp":{"heal":20},"goldTile":12,"shop":{"weapon":{"dmg":4,"cost":25},"armor":{"armor":2,"cost":20},"heal":{"hp":15,"cost":8}},"drops":{"normal":0.25,"elite":1},"trackLength":140,"tiles":{"blank":51,"enemy":32,"gold":12,"treasure":12,"camp":8,"event":8,"shop":6,"elite":6,"trap":4},"boss":{"hp":200,"dmg":13,"armor":3}}
```

## Eksperiment 1: Tre bot-strategier
### aggressive
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **41.1%** | 84.2% | 38.5 | 13.1 (2.02) | 7.17 | 59.6 | 111/49 | 4.97/0.48 | 21.8 | 82.6% / 64.3% / 60.0% |
Hero v. boss: 34.5 dmg, 2.86 armor, 99.4 maxHP — bosskamp koster 62.5 HP. HP→XP-kurs: 0.26 HP/XP. Drops: 4.79/run.
Dødsårsager: enemy:694 boss:4302 elite:631 trap:105 event:155

### balanced
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **58.2%** | 93.7% | 39.8 | 12.3 (2.28) | 7.05 | 72.9 | 116/52 | 4.14/0.33 | 28.8 | 87.1% / 69.1% / 64.4% |
Hero v. boss: 33.7 dmg, 3.16 armor, 113.7 maxHP — bosskamp koster 62.4 HP. HP→XP-kurs: 0.26 HP/XP. Drops: 4.80/run.
Dødsårsager: boss:3545 elite:277 event:55 enemy:267 trap:35

### cautious
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **45.9%** | 84.1% | 38.4 | 8.0 (0.72) | 5.66 | 74.8 | 91/41 | 3.86/0.88 | 33.4 | 90.2% / 79.6% / 75.1% |
Hero v. boss: 19.3 dmg, 7.48 armor, 100.7 maxHP — bosskamp koster 70.9 HP. HP→XP-kurs: 0.28 HP/XP. Drops: 2.53/run.
Dødsårsager: boss:3820 enemy:355 elite:1204 event:20 trap:15

## Eksperiment 2: Level-up-dominans (balanced bot, tvunget pick)
### altid +dmg
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **58.2%** | 93.7% | 39.8 | 12.3 (2.28) | 7.05 | 72.9 | 116/52 | 4.14/0.33 | 28.8 | 87.1% / 69.1% / 64.4% |
Hero v. boss: 33.7 dmg, 3.16 armor, 113.7 maxHP — bosskamp koster 62.4 HP. HP→XP-kurs: 0.26 HP/XP. Drops: 4.80/run.
Dødsårsager: boss:3545 elite:277 event:55 enemy:267 trap:35

### altid +hp
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **58.2%** | 93.7% | 39.8 | 12.3 (2.28) | 7.05 | 72.9 | 116/52 | 4.14/0.33 | 28.8 | 87.1% / 69.1% / 64.4% |
Hero v. boss: 33.7 dmg, 3.16 armor, 113.7 maxHP — bosskamp koster 62.4 HP. HP→XP-kurs: 0.26 HP/XP. Drops: 4.80/run.
Dødsårsager: boss:3545 elite:277 event:55 enemy:267 trap:35

### altid +armor
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **58.2%** | 93.7% | 39.8 | 12.3 (2.28) | 7.05 | 72.9 | 116/52 | 4.14/0.33 | 28.8 | 87.1% / 69.1% / 64.4% |
Hero v. boss: 33.7 dmg, 3.16 armor, 113.7 maxHP — bosskamp koster 62.4 HP. HP→XP-kurs: 0.26 HP/XP. Drops: 4.80/run.
Dødsårsager: boss:3545 elite:277 event:55 enemy:267 trap:35

## Eksperiment 3: Uden movement manipulation (balanced, 0 nudges/rerolls)
### balanced uden manipulation
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **38.5%** | 76.5% | 37.0 | 10.1 (1.53) | 6.62 | 69.5 | 98/38 | 0.94/0.00 | 25.5 | 85.4% / 67.8% / 64.2% |
Hero v. boss: 31.2 dmg, 2.85 armor, 108.0 maxHP — bosskamp koster 70.5 HP. HP→XP-kurs: 0.30 HP/XP. Drops: 3.65/run.
Dødsårsager: boss:3799 elite:1706 enemy:565 event:46 trap:36
