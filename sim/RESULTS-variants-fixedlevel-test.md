# Last Roll — simulationsresultater
10000 runs pr. konfiguration. Seedet RNG (reproducerbar).


# Variant: rotation-atk-hp-armor
```json
{"hero":{"dmg":10},"xpCurve":[20,30,40,55,75,100,135],"enemies":{"mid":{"dmg":8},"late":{"dmg":11}},"elites":{"early":{"dmg":9},"mid":{"dmg":12},"late":{"dmg":14}},"camp":{"heal":20},"goldTile":12,"shop":{"weapon":{"dmg":4,"cost":25},"armor":{"armor":2,"cost":20},"heal":{"hp":15,"cost":8}},"boss":{"hp":95,"dmg":10,"armor":2},"levelUp":{"mode":"rotation","dmg":4,"hp":14,"armor":1,"armorHp":6}}
```

## Eksperiment 1: Tre bot-strategier
### aggressive
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **34.3%** | 77.7% | 19.3 | 6.3 (0.86) | 4.90 | 35.8 | 50/16 | 2.87/0.59 | 17.4 | 85.5% / 58.4% / 49.5% |
Hero v. boss: 22.1 dmg, 0.97 armor, 72.6 maxHP — bosskamp koster 38.7 HP. HP→XP-kurs: 0.40 HP/XP.
Dødsårsager: boss:4337 elite:848 enemy:1146 event:148 trap:88

### balanced
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **54.5%** | 90.7% | 20.1 | 5.3 (0.82) | 4.55 | 45.6 | 51/17 | 2.34/0.40 | 25.1 | 89.9% / 68.5% / 59.9% |
Hero v. boss: 21.5 dmg, 1.19 armor, 79.9 maxHP — bosskamp koster 39.9 HP. HP→XP-kurs: 0.41 HP/XP.
Dødsårsager: boss:3616 enemy:448 elite:401 event:49 trap:34

### cautious
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **28.3%** | 73.0% | 19.0 | 2.8 (0.05) | 3.00 | 46.5 | 38/11 | 2.56/0.94 | 31.4 | 94.4% / 83.9% / 72.6% |
Hero v. boss: 13.8 dmg, 2.73 armor, 70.4 maxHP — bosskamp koster 53.7 HP. HP→XP-kurs: 0.50 HP/XP.
Dødsårsager: boss:4469 enemy:669 elite:2006 trap:11 event:13

## Eksperiment 2: Level-up-dominans (balanced bot, tvunget pick)
### altid +dmg
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **54.5%** | 90.7% | 20.1 | 5.3 (0.82) | 4.55 | 45.6 | 51/17 | 2.34/0.40 | 25.1 | 89.9% / 68.5% / 59.9% |
Hero v. boss: 21.5 dmg, 1.19 armor, 79.9 maxHP — bosskamp koster 39.9 HP. HP→XP-kurs: 0.41 HP/XP.
Dødsårsager: boss:3616 enemy:448 elite:401 event:49 trap:34

### altid +hp
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **54.5%** | 90.7% | 20.1 | 5.3 (0.82) | 4.55 | 45.6 | 51/17 | 2.34/0.40 | 25.1 | 89.9% / 68.5% / 59.9% |
Hero v. boss: 21.5 dmg, 1.19 armor, 79.9 maxHP — bosskamp koster 39.9 HP. HP→XP-kurs: 0.41 HP/XP.
Dødsårsager: boss:3616 enemy:448 elite:401 event:49 trap:34

### altid +armor
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **54.5%** | 90.7% | 20.1 | 5.3 (0.82) | 4.55 | 45.6 | 51/17 | 2.34/0.40 | 25.1 | 89.9% / 68.5% / 59.9% |
Hero v. boss: 21.5 dmg, 1.19 armor, 79.9 maxHP — bosskamp koster 39.9 HP. HP→XP-kurs: 0.41 HP/XP.
Dødsårsager: boss:3616 enemy:448 elite:401 event:49 trap:34

## Eksperiment 3: Uden movement manipulation (balanced, 0 nudges/rerolls)
### balanced uden manipulation
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **24.3%** | 54.9% | 17.5 | 4.3 (0.46) | 4.21 | 42.5 | 40/9 | 0.12/0.00 | 24.7 | 89.8% / 68.4% / 59.2% |
Hero v. boss: 19.6 dmg, 1.08 armor, 76.0 maxHP — bosskamp koster 45.0 HP. HP→XP-kurs: 0.44 HP/XP.
Dødsårsager: elite:3266 enemy:1172 boss:3051 event:51 trap:26


# Variant: flat-alle-stats
```json
{"hero":{"dmg":10},"xpCurve":[20,30,40,55,75,100,135],"enemies":{"mid":{"dmg":8},"late":{"dmg":11}},"elites":{"early":{"dmg":9},"mid":{"dmg":12},"late":{"dmg":14}},"camp":{"heal":20},"goldTile":12,"shop":{"weapon":{"dmg":4,"cost":25},"armor":{"armor":2,"cost":20},"heal":{"hp":15,"cost":8}},"boss":{"hp":95,"dmg":10,"armor":2},"levelUp":{"mode":"flat","flatDmg":2,"flatHp":7,"flatArmorEvery":2}}
```

## Eksperiment 1: Tre bot-strategier
### aggressive
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **52.4%** | 85.2% | 19.7 | 6.6 (0.99) | 5.06 | 38.9 | 53/16 | 2.88/0.44 | 20.4 | 86.1% / 58.2% / 50.4% |
Hero v. boss: 23.2 dmg, 2.27 armor, 78.4 maxHP — bosskamp koster 31.1 HP. HP→XP-kurs: 0.38 HP/XP.
Dødsårsager: boss:3282 enemy:738 elite:634 trap:44 event:62

### balanced
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **72.2%** | 94.8% | 20.2 | 5.5 (0.90) | 4.68 | 48.8 | 53/17 | 2.34/0.26 | 28.1 | 90.3% / 68.9% / 60.4% |
Hero v. boss: 22.6 dmg, 2.37 armor, 84.6 maxHP — bosskamp koster 32.2 HP. HP→XP-kurs: 0.39 HP/XP.
Dødsårsager: boss:2261 elite:280 enemy:216 event:11 trap:13

### cautious
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **34.4%** | 73.6% | 19.1 | 2.8 (0.07) | 3.03 | 46.5 | 38/12 | 2.55/0.96 | 32.2 | 94.4% / 84.0% / 71.0% |
Hero v. boss: 14.1 dmg, 3.63 armor, 72.4 maxHP — bosskamp koster 48.2 HP. HP→XP-kurs: 0.52 HP/XP.
Dødsårsager: boss:3919 enemy:738 elite:1891 event:6 trap:3

## Eksperiment 2: Level-up-dominans (balanced bot, tvunget pick)
### altid +dmg
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **72.2%** | 94.8% | 20.2 | 5.5 (0.90) | 4.68 | 48.8 | 53/17 | 2.34/0.26 | 28.1 | 90.3% / 68.9% / 60.4% |
Hero v. boss: 22.6 dmg, 2.37 armor, 84.6 maxHP — bosskamp koster 32.2 HP. HP→XP-kurs: 0.39 HP/XP.
Dødsårsager: boss:2261 elite:280 enemy:216 event:11 trap:13

### altid +hp
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **72.2%** | 94.8% | 20.2 | 5.5 (0.90) | 4.68 | 48.8 | 53/17 | 2.34/0.26 | 28.1 | 90.3% / 68.9% / 60.4% |
Hero v. boss: 22.6 dmg, 2.37 armor, 84.6 maxHP — bosskamp koster 32.2 HP. HP→XP-kurs: 0.39 HP/XP.
Dødsårsager: boss:2261 elite:280 enemy:216 event:11 trap:13

### altid +armor
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **72.2%** | 94.8% | 20.2 | 5.5 (0.90) | 4.68 | 48.8 | 53/17 | 2.34/0.26 | 28.1 | 90.3% / 68.9% / 60.4% |
Hero v. boss: 22.6 dmg, 2.37 armor, 84.6 maxHP — bosskamp koster 32.2 HP. HP→XP-kurs: 0.39 HP/XP.
Dødsårsager: boss:2261 elite:280 enemy:216 event:11 trap:13

## Eksperiment 3: Uden movement manipulation (balanced, 0 nudges/rerolls)
### balanced uden manipulation
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **40.1%** | 63.6% | 18.2 | 4.5 (0.53) | 4.35 | 45.6 | 43/10 | 0.11/0.00 | 26.3 | 90.2% / 67.8% / 58.7% |
Hero v. boss: 20.8 dmg, 2.20 armor, 80.1 maxHP — bosskamp koster 36.3 HP. HP→XP-kurs: 0.44 HP/XP.
Dødsårsager: elite:2628 boss:2350 enemy:973 event:22 trap:15
