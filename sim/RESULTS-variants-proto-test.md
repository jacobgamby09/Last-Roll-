# Last Roll — simulationsresultater
10000 runs pr. konfiguration. Seedet RNG (reproducerbar).


# Variant: v0.8-prototype
```json
{"hero":{"dmg":10},"levelUp":{"mode":"rotation","dmg":4,"hp":14,"armor":1,"armorHp":6},"xpCurve":[20,30,40,55,75,100,135],"enemies":{"mid":{"dmg":8},"late":{"dmg":11}},"elites":{"early":{"dmg":9},"mid":{"dmg":12},"late":{"dmg":14}},"camp":{"heal":20},"goldTile":12,"shop":{"weapon":{"dmg":4,"cost":25},"armor":{"armor":2,"cost":20},"heal":{"hp":15,"cost":8}},"drops":{"normal":0.25,"elite":1},"boss":{"hp":105,"dmg":10,"armor":2}}
```

## Eksperiment 1: Tre bot-strategier
### aggressive
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **46.2%** | 85.8% | 19.7 | 6.8 (1.02) | 5.15 | 41.1 | 54/19 | 3.33/0.46 | 19.9 | 85.7% / 59.6% / 51.2% |
Hero v. boss: 24.0 dmg, 1.53 armor, 80.1 maxHP — bosskamp koster 37.7 HP. HP→XP-kurs: 0.37 HP/XP. Drops: 2.48/run.
Dødsårsager: enemy:710 boss:3954 event:116 elite:521 trap:76

### balanced
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **63.7%** | 93.8% | 20.2 | 5.9 (1.15) | 4.92 | 49.3 | 56/20 | 2.76/0.31 | 25.5 | 89.3% / 65.2% / 58.2% |
Hero v. boss: 23.5 dmg, 1.71 armor, 86.8 maxHP — bosskamp koster 37.9 HP. HP→XP-kurs: 0.39 HP/XP. Drops: 2.31/run.
Dødsårsager: boss:3011 enemy:283 elite:282 event:30 trap:27

### cautious
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **34.4%** | 80.1% | 19.4 | 3.0 (0.08) | 3.14 | 50.5 | 40/13 | 2.70/0.87 | 33.1 | 94.0% / 83.8% / 74.7% |
Hero v. boss: 14.5 dmg, 3.06 armor, 73.1 maxHP — bosskamp koster 56.0 HP. HP→XP-kurs: 0.47 HP/XP. Drops: 0.80/run.
Dødsårsager: boss:4576 elite:1562 enemy:410 event:9 trap:5

## Eksperiment 2: Level-up-dominans (balanced bot, tvunget pick)
### altid +dmg
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **63.7%** | 93.8% | 20.2 | 5.9 (1.15) | 4.92 | 49.3 | 56/20 | 2.76/0.31 | 25.5 | 89.3% / 65.2% / 58.2% |
Hero v. boss: 23.5 dmg, 1.71 armor, 86.8 maxHP — bosskamp koster 37.9 HP. HP→XP-kurs: 0.39 HP/XP. Drops: 2.31/run.
Dødsårsager: boss:3011 enemy:283 elite:282 event:30 trap:27

### altid +hp
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **63.7%** | 93.8% | 20.2 | 5.9 (1.15) | 4.92 | 49.3 | 56/20 | 2.76/0.31 | 25.5 | 89.3% / 65.2% / 58.2% |
Hero v. boss: 23.5 dmg, 1.71 armor, 86.8 maxHP — bosskamp koster 37.9 HP. HP→XP-kurs: 0.39 HP/XP. Drops: 2.31/run.
Dødsårsager: boss:3011 enemy:283 elite:282 event:30 trap:27

### altid +armor
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **63.7%** | 93.8% | 20.2 | 5.9 (1.15) | 4.92 | 49.3 | 56/20 | 2.76/0.31 | 25.5 | 89.3% / 65.2% / 58.2% |
Hero v. boss: 23.5 dmg, 1.71 armor, 86.8 maxHP — bosskamp koster 37.9 HP. HP→XP-kurs: 0.39 HP/XP. Drops: 2.31/run.
Dødsårsager: boss:3011 enemy:283 elite:282 event:30 trap:27

## Eksperiment 3: Uden movement manipulation (balanced, 0 nudges/rerolls)
### balanced uden manipulation
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **35.9%** | 66.9% | 18.3 | 4.6 (0.58) | 4.43 | 46.6 | 43/12 | 0.40/0.00 | 26.3 | 90.0% / 68.9% / 60.1% |
Hero v. boss: 21.4 dmg, 1.48 armor, 80.8 maxHP — bosskamp koster 43.5 HP. HP→XP-kurs: 0.42 HP/XP. Drops: 1.58/run.
Dødsårsager: elite:2502 boss:3102 enemy:749 trap:26 event:30
