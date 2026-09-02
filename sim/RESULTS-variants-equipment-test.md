# Last Roll — simulationsresultater
10000 runs pr. konfiguration. Seedet RNG (reproducerbar).


# Variant: v0.9-live-boss105
```json
{"hero":{"dmg":10},"levelUp":{"mode":"rotation","dmg":4,"hp":14,"armor":1,"armorHp":6},"xpCurve":[20,30,40,55,75,100,135],"enemies":{"mid":{"dmg":8},"late":{"dmg":11}},"elites":{"early":{"dmg":9},"mid":{"dmg":12},"late":{"dmg":14}},"camp":{"heal":20},"goldTile":12,"shop":{"heal":{"hp":15,"cost":8}},"equipment":{"weapon":{"dmg":3,"cost":25},"armor":{"armor":1,"cost":20},"boots":{"nudges":1,"cost":18}},"drops":{"normal":0.25,"elite":1},"boss":{"hp":105,"dmg":10,"armor":2}}
```

## Eksperiment 1: Tre bot-strategier
### aggressive
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **33.3%** | 84.0% | 19.6 | 7.1 (1.01) | 5.24 | 39.3 | 54/18 | 4.17/0.52 | 17.0 | 85.5% / 58.0% / 47.6% |
Hero v. boss: 20.0 dmg, 1.65 armor, 81.4 maxHP — bosskamp koster 44.4 HP. HP→XP-kurs: 0.40 HP/XP. Drops: 2.51/run.
Dødsårsager: enemy:791 boss:5066 elite:575 event:147 trap:87

### balanced
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **55.7%** | 94.5% | 20.2 | 5.8 (1.12) | 4.84 | 53.0 | 55/19 | 3.18/0.34 | 25.4 | 89.2% / 65.3% / 58.8% |
Hero v. boss: 19.3 dmg, 1.61 armor, 91.7 maxHP — bosskamp koster 46.3 HP. HP→XP-kurs: 0.44 HP/XP. Drops: 2.28/run.
Dødsårsager: boss:3882 enemy:232 trap:19 elite:269 event:30

### cautious
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **26.2%** | 81.1% | 19.5 | 2.7 (0.06) | 2.94 | 54.8 | 39/13 | 3.14/0.89 | 33.9 | 94.1% / 84.9% / 76.5% |
Hero v. boss: 14.8 dmg, 1.23 armor, 77.7 maxHP — bosskamp koster 68.9 HP. HP→XP-kurs: 0.53 HP/XP. Drops: 0.72/run.
Dødsårsager: boss:5486 elite:1377 enemy:495 event:13 trap:8

## Eksperiment 2: Level-up-dominans (balanced bot, tvunget pick)
### altid +dmg
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **55.7%** | 94.5% | 20.2 | 5.8 (1.12) | 4.84 | 53.0 | 55/19 | 3.18/0.34 | 25.4 | 89.2% / 65.3% / 58.8% |
Hero v. boss: 19.3 dmg, 1.61 armor, 91.7 maxHP — bosskamp koster 46.3 HP. HP→XP-kurs: 0.44 HP/XP. Drops: 2.28/run.
Dødsårsager: boss:3882 enemy:232 trap:19 elite:269 event:30

### altid +hp
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **55.7%** | 94.5% | 20.2 | 5.8 (1.12) | 4.84 | 53.0 | 55/19 | 3.18/0.34 | 25.4 | 89.2% / 65.3% / 58.8% |
Hero v. boss: 19.3 dmg, 1.61 armor, 91.7 maxHP — bosskamp koster 46.3 HP. HP→XP-kurs: 0.44 HP/XP. Drops: 2.28/run.
Dødsårsager: boss:3882 enemy:232 trap:19 elite:269 event:30

### altid +armor
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **55.7%** | 94.5% | 20.2 | 5.8 (1.12) | 4.84 | 53.0 | 55/19 | 3.18/0.34 | 25.4 | 89.2% / 65.3% / 58.8% |
Hero v. boss: 19.3 dmg, 1.61 armor, 91.7 maxHP — bosskamp koster 46.3 HP. HP→XP-kurs: 0.44 HP/XP. Drops: 2.28/run.
Dødsårsager: boss:3882 enemy:232 trap:19 elite:269 event:30

## Eksperiment 3: Uden movement manipulation (balanced, 0 nudges/rerolls)
### balanced uden manipulation
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **31.0%** | 66.6% | 18.3 | 4.6 (0.59) | 4.40 | 49.3 | 43/12 | 0.76/0.00 | 25.9 | 89.9% / 68.6% / 60.4% |
Hero v. boss: 18.4 dmg, 1.40 armor, 84.8 maxHP — bosskamp koster 50.2 HP. HP→XP-kurs: 0.46 HP/XP. Drops: 1.60/run.
Dødsårsager: boss:3565 elite:2421 enemy:852 trap:22 event:44


# Variant: v0.9-boss80
```json
{"hero":{"dmg":10},"levelUp":{"mode":"rotation","dmg":4,"hp":14,"armor":1,"armorHp":6},"xpCurve":[20,30,40,55,75,100,135],"enemies":{"mid":{"dmg":8},"late":{"dmg":11}},"elites":{"early":{"dmg":9},"mid":{"dmg":12},"late":{"dmg":14}},"camp":{"heal":20},"goldTile":12,"shop":{"heal":{"hp":15,"cost":8}},"equipment":{"weapon":{"dmg":3,"cost":25},"armor":{"armor":1,"cost":20},"boots":{"nudges":1,"cost":18}},"drops":{"normal":0.25,"elite":1},"boss":{"hp":80,"dmg":10,"armor":2}}
```

## Eksperiment 1: Tre bot-strategier
### aggressive
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **44.4%** | 84.4% | 19.6 | 7.1 (1.03) | 5.25 | 39.6 | 54/18 | 4.20/0.46 | 17.1 | 85.3% / 57.5% / 47.9% |
Hero v. boss: 20.0 dmg, 1.65 armor, 81.6 maxHP — bosskamp koster 35.2 HP. HP→XP-kurs: 0.40 HP/XP. Drops: 2.56/run.
Dødsårsager: enemy:790 boss:3992 elite:521 event:154 trap:99

### balanced
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **68.6%** | 94.5% | 20.1 | 5.7 (1.14) | 4.83 | 53.1 | 55/19 | 3.20/0.26 | 25.4 | 89.2% / 65.4% / 59.0% |
Hero v. boss: 19.3 dmg, 1.60 armor, 91.9 maxHP — bosskamp koster 37.2 HP. HP→XP-kurs: 0.44 HP/XP. Drops: 2.28/run.
Dødsårsager: boss:2589 enemy:262 elite:249 event:30 trap:13

### cautious
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **42.2%** | 81.1% | 19.4 | 2.7 (0.06) | 2.93 | 54.8 | 39/13 | 3.14/0.85 | 33.9 | 94.1% / 84.9% / 76.3% |
Hero v. boss: 14.8 dmg, 1.22 armor, 77.6 maxHP — bosskamp koster 52.3 HP. HP→XP-kurs: 0.52 HP/XP. Drops: 0.74/run.
Dødsårsager: boss:3889 elite:1435 enemy:441 trap:9 event:9

## Eksperiment 2: Level-up-dominans (balanced bot, tvunget pick)
### altid +dmg
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **68.6%** | 94.5% | 20.1 | 5.7 (1.14) | 4.83 | 53.1 | 55/19 | 3.20/0.26 | 25.4 | 89.2% / 65.4% / 59.0% |
Hero v. boss: 19.3 dmg, 1.60 armor, 91.9 maxHP — bosskamp koster 37.2 HP. HP→XP-kurs: 0.44 HP/XP. Drops: 2.28/run.
Dødsårsager: boss:2589 enemy:262 elite:249 event:30 trap:13

### altid +hp
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **68.6%** | 94.5% | 20.1 | 5.7 (1.14) | 4.83 | 53.1 | 55/19 | 3.20/0.26 | 25.4 | 89.2% / 65.4% / 59.0% |
Hero v. boss: 19.3 dmg, 1.60 armor, 91.9 maxHP — bosskamp koster 37.2 HP. HP→XP-kurs: 0.44 HP/XP. Drops: 2.28/run.
Dødsårsager: boss:2589 enemy:262 elite:249 event:30 trap:13

### altid +armor
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **68.6%** | 94.5% | 20.1 | 5.7 (1.14) | 4.83 | 53.1 | 55/19 | 3.20/0.26 | 25.4 | 89.2% / 65.4% / 59.0% |
Hero v. boss: 19.3 dmg, 1.60 armor, 91.9 maxHP — bosskamp koster 37.2 HP. HP→XP-kurs: 0.44 HP/XP. Drops: 2.28/run.
Dødsårsager: boss:2589 enemy:262 elite:249 event:30 trap:13

## Eksperiment 3: Uden movement manipulation (balanced, 0 nudges/rerolls)
### balanced uden manipulation
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **40.8%** | 66.6% | 18.3 | 4.6 (0.60) | 4.41 | 49.2 | 44/12 | 0.77/0.00 | 25.8 | 89.8% / 68.5% / 60.4% |
Hero v. boss: 18.4 dmg, 1.40 armor, 85.0 maxHP — bosskamp koster 40.1 HP. HP→XP-kurs: 0.46 HP/XP. Drops: 1.61/run.
Dødsårsager: boss:2578 elite:2422 enemy:859 trap:23 event:38


# Variant: v0.9-boss70-dmg9
```json
{"hero":{"dmg":10},"levelUp":{"mode":"rotation","dmg":4,"hp":14,"armor":1,"armorHp":6},"xpCurve":[20,30,40,55,75,100,135],"enemies":{"mid":{"dmg":8},"late":{"dmg":11}},"elites":{"early":{"dmg":9},"mid":{"dmg":12},"late":{"dmg":14}},"camp":{"heal":20},"goldTile":12,"shop":{"heal":{"hp":15,"cost":8}},"equipment":{"weapon":{"dmg":3,"cost":25},"armor":{"armor":1,"cost":20},"boots":{"nudges":1,"cost":18}},"drops":{"normal":0.25,"elite":1},"boss":{"hp":70,"dmg":9,"armor":2}}
```

## Eksperiment 1: Tre bot-strategier
### aggressive
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **60.3%** | 83.9% | 19.5 | 7.1 (1.02) | 5.23 | 39.6 | 54/18 | 4.17/0.38 | 17.2 | 85.5% / 57.9% / 48.0% |
Hero v. boss: 20.0 dmg, 1.65 armor, 81.3 maxHP — bosskamp koster 24.2 HP. HP→XP-kurs: 0.40 HP/XP. Drops: 2.52/run.
Dødsårsager: enemy:843 boss:2361 elite:529 trap:94 event:147

### balanced
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **82.8%** | 94.7% | 20.1 | 5.8 (1.13) | 4.83 | 53.3 | 55/19 | 3.19/0.19 | 25.6 | 89.2% / 65.3% / 59.4% |
Hero v. boss: 19.3 dmg, 1.60 armor, 91.8 maxHP — bosskamp koster 25.7 HP. HP→XP-kurs: 0.44 HP/XP. Drops: 2.28/run.
Dødsårsager: boss:1187 enemy:263 trap:23 event:31 elite:214

### cautious
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **60.2%** | 82.3% | 19.4 | 2.7 (0.06) | 2.91 | 54.9 | 39/13 | 3.12/0.82 | 34.0 | 94.1% / 85.0% / 76.2% |
Hero v. boss: 14.7 dmg, 1.22 armor, 77.4 maxHP — bosskamp koster 39.0 HP. HP→XP-kurs: 0.53 HP/XP. Drops: 0.72/run.
Dødsårsager: boss:2208 elite:1307 enemy:447 trap:9 event:6

## Eksperiment 2: Level-up-dominans (balanced bot, tvunget pick)
### altid +dmg
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **82.8%** | 94.7% | 20.1 | 5.8 (1.13) | 4.83 | 53.3 | 55/19 | 3.19/0.19 | 25.6 | 89.2% / 65.3% / 59.4% |
Hero v. boss: 19.3 dmg, 1.60 armor, 91.8 maxHP — bosskamp koster 25.7 HP. HP→XP-kurs: 0.44 HP/XP. Drops: 2.28/run.
Dødsårsager: boss:1187 enemy:263 trap:23 event:31 elite:214

### altid +hp
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **82.8%** | 94.7% | 20.1 | 5.8 (1.13) | 4.83 | 53.3 | 55/19 | 3.19/0.19 | 25.6 | 89.2% / 65.3% / 59.4% |
Hero v. boss: 19.3 dmg, 1.60 armor, 91.8 maxHP — bosskamp koster 25.7 HP. HP→XP-kurs: 0.44 HP/XP. Drops: 2.28/run.
Dødsårsager: boss:1187 enemy:263 trap:23 event:31 elite:214

### altid +armor
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **82.8%** | 94.7% | 20.1 | 5.8 (1.13) | 4.83 | 53.3 | 55/19 | 3.19/0.19 | 25.6 | 89.2% / 65.3% / 59.4% |
Hero v. boss: 19.3 dmg, 1.60 armor, 91.8 maxHP — bosskamp koster 25.7 HP. HP→XP-kurs: 0.44 HP/XP. Drops: 2.28/run.
Dødsårsager: boss:1187 enemy:263 trap:23 event:31 elite:214

## Eksperiment 3: Uden movement manipulation (balanced, 0 nudges/rerolls)
### balanced uden manipulation
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **52.4%** | 67.2% | 18.3 | 4.6 (0.60) | 4.42 | 49.1 | 43/11 | 0.76/0.00 | 25.8 | 89.8% / 68.4% / 60.3% |
Hero v. boss: 18.4 dmg, 1.40 armor, 84.9 maxHP — bosskamp koster 28.3 HP. HP→XP-kurs: 0.46 HP/XP. Drops: 1.62/run.
Dødsårsager: boss:1475 elite:2387 enemy:823 trap:32 event:42
