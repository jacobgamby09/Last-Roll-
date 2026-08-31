# Last Roll — simulationsresultater
10000 runs pr. konfiguration. Seedet RNG (reproducerbar).


# Variant: v0.1-original
```json
{}
```

## Eksperiment 1: Tre bot-strategier
### aggressive
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **0.0%** | 42.1% | 16.3 | 4.7 (0.58) | 4.05 | 22.1 | 36/10 | 2.71/0.85 | 7.8 | 82.2% / 43.3% / 42.7% |
Hero v. boss: 21.8 dmg, 0.00 armor, 50.4 maxHP — bosskamp koster 82.7 HP. HP→XP-kurs: 0.49 HP/XP.
Dødsårsager: enemy:3640 boss:4204 elite:1190 event:624 trap:340

### balanced
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **0.2%** | 71.4% | 19.1 | 4.0 (0.34) | 3.59 | 35.3 | 38/11 | 2.34/0.79 | 17.6 | 89.3% / 64.2% / 57.7% |
Hero v. boss: 19.1 dmg, 0.26 armor, 63.9 maxHP — bosskamp koster 97.6 HP. HP→XP-kurs: 0.50 HP/XP.
Dødsårsager: enemy:1710 boss:7120 elite:925 event:145 trap:79

### cautious
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **0.0%** | 40.1% | 17.1 | 2.0 (0.02) | 2.32 | 37.7 | 29/8 | 2.53/1.01 | 25.5 | 94.3% / 79.6% / 68.7% |
Hero v. boss: 11.6 dmg, 2.14 armor, 59.2 maxHP — bosskamp koster 171.7 HP. HP→XP-kurs: 0.68 HP/XP.
Dødsårsager: enemy:3801 elite:2075 boss:4009 event:67 trap:48

## Eksperiment 2: Level-up-dominans (balanced bot, tvunget pick)
### altid +dmg
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **0.2%** | 69.0% | 19.0 | 4.0 (0.34) | 3.55 | 32.3 | 37/11 | 2.33/0.79 | 16.2 | 89.6% / 64.2% / 56.6% |
Hero v. boss: 20.4 dmg, 0.27 armor, 60.1 maxHP — bosskamp koster 91.8 HP. HP→XP-kurs: 0.50 HP/XP.
Dødsårsager: enemy:1856 boss:6879 elite:947 event:179 trap:118

### altid +hp
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **0.0%** | 61.9% | 18.6 | 3.3 (0.23) | 3.16 | 44.3 | 34/10 | 2.40/0.88 | 27.1 | 90.9% / 71.2% / 63.3% |
Hero v. boss: 13.4 dmg, 0.21 armor, 76.4 maxHP — bosskamp koster 161.1 HP. HP→XP-kurs: 0.66 HP/XP.
Dødsårsager: elite:1152 boss:6184 enemy:2630 trap:13 event:20

### altid +armor
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **0.0%** | 55.0% | 18.1 | 3.3 (0.23) | 3.14 | 34.0 | 33/10 | 2.34/0.85 | 17.7 | 89.9% / 66.7% / 60.2% |
Hero v. boss: 13.3 dmg, 2.38 armor, 59.4 maxHP — bosskamp koster 140.6 HP. HP→XP-kurs: 0.59 HP/XP.
Dødsårsager: enemy:3129 boss:5501 elite:1176 event:116 trap:78

## Eksperiment 3: Uden movement manipulation (balanced, 0 nudges/rerolls)
### balanced uden manipulation
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **0.0%** | 22.1% | 14.1 | 3.1 (0.28) | 3.53 | 32.0 | 27/5 | 0.09/0.00 | 16.4 | 88.5% / 58.8% / 52.3% |
Hero v. boss: 18.4 dmg, 0.22 armor, 60.6 maxHP — bosskamp koster 100.7 HP. HP→XP-kurs: 0.57 HP/XP.
Dødsårsager: elite:3502 enemy:4003 boss:2213 trap:119 event:162


# Variant: v0.5-final
```json
{"hero":{"dmg":10},"levelUp":{"dmg":4,"hp":10},"xpCurve":[20,30,40,55,75,100,135],"enemies":{"mid":{"dmg":8},"late":{"dmg":11}},"elites":{"early":{"dmg":9},"mid":{"dmg":12},"late":{"dmg":14}},"camp":{"heal":20},"goldTile":12,"shop":{"weapon":{"dmg":4,"cost":25},"armor":{"armor":2,"cost":20},"heal":{"hp":15,"cost":8}},"boss":{"hp":95,"dmg":10,"armor":2}}
```

## Eksperiment 1: Tre bot-strategier
### aggressive
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **31.7%** | 70.6% | 18.7 | 6.0 (0.84) | 4.87 | 29.2 | 49/14 | 2.82/0.60 | 11.3 | 84.4% / 52.0% / 50.4% |
Hero v. boss: 28.5 dmg, 0.00 armor, 56.0 maxHP — bosskamp koster 31.1 HP. HP→XP-kurs: 0.34 HP/XP.
Dødsårsager: boss:3889 event:356 trap:217 enemy:1467 elite:902

### balanced
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **54.3%** | 90.6% | 20.0 | 5.3 (0.87) | 4.62 | 45.0 | 51/16 | 2.34/0.41 | 22.3 | 89.4% / 64.8% / 59.5% |
Hero v. boss: 22.1 dmg, 0.32 armor, 77.7 maxHP — bosskamp koster 40.2 HP. HP→XP-kurs: 0.39 HP/XP.
Dødsårsager: boss:3631 enemy:447 elite:436 trap:21 event:35

### cautious
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **23.1%** | 70.2% | 18.9 | 2.7 (0.04) | 2.95 | 43.5 | 38/11 | 2.55/0.95 | 29.3 | 94.3% / 83.8% / 71.7% |
Hero v. boss: 13.5 dmg, 2.72 armor, 66.1 maxHP — bosskamp koster 54.8 HP. HP→XP-kurs: 0.50 HP/XP.
Dødsårsager: boss:4715 enemy:966 elite:1980 event:11 trap:21

## Eksperiment 2: Level-up-dominans (balanced bot, tvunget pick)
### altid +dmg
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **47.3%** | 85.0% | 19.7 | 5.3 (0.85) | 4.58 | 33.0 | 50/16 | 2.33/0.44 | 15.3 | 89.4% / 63.4% / 56.4% |
Hero v. boss: 29.3 dmg, 0.33 armor, 59.5 maxHP — bosskamp koster 30.2 HP. HP→XP-kurs: 0.36 HP/XP.
Dødsårsager: boss:3773 enemy:787 event:161 trap:109 elite:442

### altid +hp
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **29.8%** | 81.4% | 19.7 | 4.5 (0.60) | 4.06 | 53.2 | 46/15 | 2.36/0.64 | 31.6 | 90.7% / 71.1% / 64.2% |
Hero v. boss: 15.9 dmg, 0.25 armor, 89.4 maxHP — bosskamp koster 65.1 HP. HP→XP-kurs: 0.53 HP/XP.
Dødsårsager: boss:5159 enemy:1025 elite:814 event:9 trap:8

### altid +armor
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **24.2%** | 72.4% | 19.2 | 4.5 (0.57) | 4.02 | 34.9 | 44/15 | 2.32/0.66 | 16.5 | 89.3% / 64.6% / 59.9% |
Hero v. boss: 15.5 dmg, 3.33 armor, 59.4 maxHP — bosskamp koster 46.2 HP. HP→XP-kurs: 0.45 HP/XP.
Dødsårsager: boss:4819 enemy:1696 elite:832 event:144 trap:88

## Eksperiment 3: Uden movement manipulation (balanced, 0 nudges/rerolls)
### balanced uden manipulation
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **25.5%** | 53.9% | 17.3 | 4.2 (0.47) | 4.27 | 41.1 | 40/9 | 0.11/0.00 | 21.4 | 89.1% / 64.5% / 58.9% |
Hero v. boss: 21.2 dmg, 0.27 armor, 71.7 maxHP — bosskamp koster 41.9 HP. HP→XP-kurs: 0.42 HP/XP.
Dødsårsager: elite:3072 boss:2839 enemy:1456 trap:35 event:45
