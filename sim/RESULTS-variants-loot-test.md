# Last Roll — simulationsresultater
10000 runs pr. konfiguration. Seedet RNG (reproducerbar).


# Variant: kun-elite-loot
```json
{"hero":{"dmg":10},"levelUp":{"mode":"rotation","dmg":4,"hp":14,"armor":1,"armorHp":6},"xpCurve":[20,30,40,55,75,100,135],"enemies":{"mid":{"dmg":8},"late":{"dmg":11}},"elites":{"early":{"dmg":9},"mid":{"dmg":12},"late":{"dmg":14}},"camp":{"heal":20},"goldTile":12,"shop":{"weapon":{"dmg":4,"cost":25},"armor":{"armor":2,"cost":20},"heal":{"hp":15,"cost":8}},"boss":{"hp":95,"dmg":10,"armor":2},"drops":{"normal":0,"elite":1}}
```

## Eksperiment 1: Tre bot-strategier
### aggressive
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **40.7%** | 81.3% | 19.5 | 6.5 (0.92) | 5.00 | 37.6 | 52/17 | 3.05/0.52 | 18.7 | 85.5% / 59.4% / 50.4% |
Hero v. boss: 22.9 dmg, 1.17 armor, 75.5 maxHP — bosskamp koster 36.7 HP. HP→XP-kurs: 0.39 HP/XP. Drops: 0.92/run.
Dødsårsager: boss:4051 enemy:896 elite:768 trap:90 event:121

### balanced
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **61.1%** | 92.0% | 20.1 | 5.5 (1.09) | 4.73 | 47.4 | 54/19 | 2.55/0.35 | 24.6 | 89.2% / 65.1% / 58.5% |
Hero v. boss: 22.4 dmg, 1.44 armor, 83.2 maxHP — bosskamp koster 37.1 HP. HP→XP-kurs: 0.41 HP/XP. Drops: 1.09/run.
Dødsårsager: boss:3089 event:37 elite:343 enemy:390 trap:32

### cautious
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **29.7%** | 73.2% | 19.0 | 2.8 (0.07) | 3.01 | 46.9 | 38/12 | 2.57/0.94 | 31.4 | 94.4% / 83.8% / 72.7% |
Hero v. boss: 13.8 dmg, 2.82 armor, 70.4 maxHP — bosskamp koster 53.1 HP. HP→XP-kurs: 0.49 HP/XP. Drops: 0.07/run.
Dødsårsager: boss:4343 enemy:691 elite:1972 event:16 trap:6

## Eksperiment 2: Level-up-dominans (balanced bot, tvunget pick)
### altid +dmg
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **61.1%** | 92.0% | 20.1 | 5.5 (1.09) | 4.73 | 47.4 | 54/19 | 2.55/0.35 | 24.6 | 89.2% / 65.1% / 58.5% |
Hero v. boss: 22.4 dmg, 1.44 armor, 83.2 maxHP — bosskamp koster 37.1 HP. HP→XP-kurs: 0.41 HP/XP. Drops: 1.09/run.
Dødsårsager: boss:3089 event:37 elite:343 enemy:390 trap:32

### altid +hp
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **61.1%** | 92.0% | 20.1 | 5.5 (1.09) | 4.73 | 47.4 | 54/19 | 2.55/0.35 | 24.6 | 89.2% / 65.1% / 58.5% |
Hero v. boss: 22.4 dmg, 1.44 armor, 83.2 maxHP — bosskamp koster 37.1 HP. HP→XP-kurs: 0.41 HP/XP. Drops: 1.09/run.
Dødsårsager: boss:3089 event:37 elite:343 enemy:390 trap:32

### altid +armor
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **61.1%** | 92.0% | 20.1 | 5.5 (1.09) | 4.73 | 47.4 | 54/19 | 2.55/0.35 | 24.6 | 89.2% / 65.1% / 58.5% |
Hero v. boss: 22.4 dmg, 1.44 armor, 83.2 maxHP — bosskamp koster 37.1 HP. HP→XP-kurs: 0.41 HP/XP. Drops: 1.09/run.
Dødsårsager: boss:3089 event:37 elite:343 enemy:390 trap:32

## Eksperiment 3: Uden movement manipulation (balanced, 0 nudges/rerolls)
### balanced uden manipulation
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **29.1%** | 58.2% | 17.7 | 4.4 (0.49) | 4.29 | 44.1 | 41/10 | 0.20/0.00 | 25.3 | 89.7% / 68.1% / 59.5% |
Hero v. boss: 20.2 dmg, 1.19 armor, 77.6 maxHP — bosskamp koster 43.2 HP. HP→XP-kurs: 0.44 HP/XP. Drops: 0.49/run.
Dødsårsager: elite:3077 boss:2910 enemy:1031 trap:25 event:48


# Variant: normal-25pct
```json
{"hero":{"dmg":10},"levelUp":{"mode":"rotation","dmg":4,"hp":14,"armor":1,"armorHp":6},"xpCurve":[20,30,40,55,75,100,135],"enemies":{"mid":{"dmg":8},"late":{"dmg":11}},"elites":{"early":{"dmg":9},"mid":{"dmg":12},"late":{"dmg":14}},"camp":{"heal":20},"goldTile":12,"shop":{"weapon":{"dmg":4,"cost":25},"armor":{"armor":2,"cost":20},"heal":{"hp":15,"cost":8}},"boss":{"hp":95,"dmg":10,"armor":2},"drops":{"normal":0.25,"elite":1}}
```

## Eksperiment 1: Tre bot-strategier
### aggressive
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **51.2%** | 85.6% | 19.7 | 6.8 (1.01) | 5.14 | 40.7 | 54/19 | 3.32/0.43 | 19.9 | 85.8% / 59.9% / 51.0% |
Hero v. boss: 24.1 dmg, 1.54 armor, 79.9 maxHP — bosskamp koster 33.3 HP. HP→XP-kurs: 0.37 HP/XP. Drops: 2.49/run.
Dødsårsager: enemy:693 boss:3437 event:121 elite:550 trap:77

### balanced
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **68.8%** | 94.3% | 20.2 | 5.9 (1.14) | 4.91 | 49.3 | 56/20 | 2.76/0.27 | 25.8 | 89.2% / 65.7% / 58.4% |
Hero v. boss: 23.5 dmg, 1.71 armor, 86.9 maxHP — bosskamp koster 34.0 HP. HP→XP-kurs: 0.39 HP/XP. Drops: 2.32/run.
Dødsårsager: boss:2547 elite:275 enemy:233 trap:34 event:30

### cautious
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **41.7%** | 80.0% | 19.4 | 3.0 (0.08) | 3.12 | 50.7 | 40/13 | 2.71/0.86 | 33.3 | 94.0% / 83.9% / 74.8% |
Hero v. boss: 14.5 dmg, 3.05 armor, 73.0 maxHP — bosskamp koster 49.4 HP. HP→XP-kurs: 0.46 HP/XP. Drops: 0.81/run.
Dødsårsager: boss:3833 elite:1528 enemy:452 trap:7 event:8

## Eksperiment 2: Level-up-dominans (balanced bot, tvunget pick)
### altid +dmg
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **68.8%** | 94.3% | 20.2 | 5.9 (1.14) | 4.91 | 49.3 | 56/20 | 2.76/0.27 | 25.8 | 89.2% / 65.7% / 58.4% |
Hero v. boss: 23.5 dmg, 1.71 armor, 86.9 maxHP — bosskamp koster 34.0 HP. HP→XP-kurs: 0.39 HP/XP. Drops: 2.32/run.
Dødsårsager: boss:2547 elite:275 enemy:233 trap:34 event:30

### altid +hp
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **68.8%** | 94.3% | 20.2 | 5.9 (1.14) | 4.91 | 49.3 | 56/20 | 2.76/0.27 | 25.8 | 89.2% / 65.7% / 58.4% |
Hero v. boss: 23.5 dmg, 1.71 armor, 86.9 maxHP — bosskamp koster 34.0 HP. HP→XP-kurs: 0.39 HP/XP. Drops: 2.32/run.
Dødsårsager: boss:2547 elite:275 enemy:233 trap:34 event:30

### altid +armor
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **68.8%** | 94.3% | 20.2 | 5.9 (1.14) | 4.91 | 49.3 | 56/20 | 2.76/0.27 | 25.8 | 89.2% / 65.7% / 58.4% |
Hero v. boss: 23.5 dmg, 1.71 armor, 86.9 maxHP — bosskamp koster 34.0 HP. HP→XP-kurs: 0.39 HP/XP. Drops: 2.32/run.
Dødsårsager: boss:2547 elite:275 enemy:233 trap:34 event:30

## Eksperiment 3: Uden movement manipulation (balanced, 0 nudges/rerolls)
### balanced uden manipulation
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **40.0%** | 66.8% | 18.3 | 4.6 (0.58) | 4.43 | 46.8 | 43/12 | 0.40/0.00 | 26.3 | 90.0% / 69.0% / 60.2% |
Hero v. boss: 21.4 dmg, 1.49 armor, 80.9 maxHP — bosskamp koster 39.2 HP. HP→XP-kurs: 0.42 HP/XP. Drops: 1.58/run.
Dødsårsager: elite:2511 boss:2687 enemy:750 event:30 trap:25


# Variant: normal-50pct-stresstest
```json
{"hero":{"dmg":10},"levelUp":{"mode":"rotation","dmg":4,"hp":14,"armor":1,"armorHp":6},"xpCurve":[20,30,40,55,75,100,135],"enemies":{"mid":{"dmg":8},"late":{"dmg":11}},"elites":{"early":{"dmg":9},"mid":{"dmg":12},"late":{"dmg":14}},"camp":{"heal":20},"goldTile":12,"shop":{"weapon":{"dmg":4,"cost":25},"armor":{"armor":2,"cost":20},"heal":{"hp":15,"cost":8}},"boss":{"hp":95,"dmg":10,"armor":2},"drops":{"normal":0.5,"elite":1}}
```

## Eksperiment 1: Tre bot-strategier
### aggressive
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **61.3%** | 88.8% | 19.8 | 7.1 (1.10) | 5.28 | 44.1 | 55/20 | 3.59/0.34 | 21.9 | 85.8% / 61.0% / 52.1% |
Hero v. boss: 25.3 dmg, 1.87 armor, 84.6 maxHP — bosskamp koster 30.1 HP. HP→XP-kurs: 0.36 HP/XP. Drops: 4.10/run.
Dødsårsager: enemy:542 boss:2753 elite:427 event:87 trap:63

### balanced
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **74.9%** | 94.4% | 20.1 | 6.6 (1.11) | 5.12 | 52.1 | 57/21 | 3.09/0.23 | 27.4 | 87.2% / 65.7% / 58.5% |
Hero v. boss: 24.6 dmg, 2.03 armor, 90.8 maxHP — bosskamp koster 30.6 HP. HP→XP-kurs: 0.36 HP/XP. Drops: 3.86/run.
Dødsårsager: boss:1949 elite:264 enemy:245 trap:23 event:27

### cautious
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **52.9%** | 85.5% | 19.6 | 3.1 (0.09) | 3.19 | 53.9 | 40/14 | 2.81/0.78 | 34.6 | 93.8% / 84.1% / 76.5% |
Hero v. boss: 15.1 dmg, 3.34 armor, 75.3 maxHP — bosskamp koster 46.0 HP. HP→XP-kurs: 0.44 HP/XP. Drops: 1.60/run.
Dødsårsager: boss:3257 elite:1079 enemy:361 trap:7 event:5

## Eksperiment 2: Level-up-dominans (balanced bot, tvunget pick)
### altid +dmg
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **74.9%** | 94.4% | 20.1 | 6.6 (1.11) | 5.12 | 52.1 | 57/21 | 3.09/0.23 | 27.4 | 87.2% / 65.7% / 58.5% |
Hero v. boss: 24.6 dmg, 2.03 armor, 90.8 maxHP — bosskamp koster 30.6 HP. HP→XP-kurs: 0.36 HP/XP. Drops: 3.86/run.
Dødsårsager: boss:1949 elite:264 enemy:245 trap:23 event:27

### altid +hp
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **74.9%** | 94.4% | 20.1 | 6.6 (1.11) | 5.12 | 52.1 | 57/21 | 3.09/0.23 | 27.4 | 87.2% / 65.7% / 58.5% |
Hero v. boss: 24.6 dmg, 2.03 armor, 90.8 maxHP — bosskamp koster 30.6 HP. HP→XP-kurs: 0.36 HP/XP. Drops: 3.86/run.
Dødsårsager: boss:1949 elite:264 enemy:245 trap:23 event:27

### altid +armor
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **74.9%** | 94.4% | 20.1 | 6.6 (1.11) | 5.12 | 52.1 | 57/21 | 3.09/0.23 | 27.4 | 87.2% / 65.7% / 58.5% |
Hero v. boss: 24.6 dmg, 2.03 armor, 90.8 maxHP — bosskamp koster 30.6 HP. HP→XP-kurs: 0.36 HP/XP. Drops: 3.86/run.
Dødsårsager: boss:1949 elite:264 enemy:245 trap:23 event:27

## Eksperiment 3: Uden movement manipulation (balanced, 0 nudges/rerolls)
### balanced uden manipulation
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **50.7%** | 72.8% | 18.6 | 4.9 (0.66) | 4.58 | 50.4 | 46/14 | 0.62/0.00 | 27.3 | 90.2% / 69.3% / 60.9% |
Hero v. boss: 22.7 dmg, 1.75 armor, 84.6 maxHP — bosskamp koster 35.7 HP. HP→XP-kurs: 0.40 HP/XP. Drops: 2.78/run.
Dødsårsager: boss:2204 enemy:552 elite:2126 event:32 trap:14
