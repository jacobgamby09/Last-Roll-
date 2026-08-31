# Last Roll — simulationsresultater
10000 runs pr. konfiguration. Seedet RNG (reproducerbar).


# Variant: v0.6d-hybrid
```json
{"hero":{"dmg":10},"xpCurve":[20,30,40,55,75,100,135],"enemies":{"mid":{"dmg":8},"late":{"dmg":11}},"elites":{"early":{"dmg":9},"mid":{"dmg":12},"late":{"dmg":14}},"camp":{"heal":20},"goldTile":12,"shop":{"weapon":{"dmg":4,"cost":25},"armor":{"armor":2,"cost":20},"heal":{"hp":15,"cost":8}},"boss":{"hp":95,"dmg":10,"armor":2},"levelUp":{"dmg":4,"hp":14,"armor":1,"armorHp":6}}
```

## Eksperiment 1: Tre bot-strategier
### aggressive
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **35.1%** | 71.1% | 18.7 | 6.1 (0.86) | 4.89 | 31.2 | 49/14 | 2.83/0.58 | 11.4 | 84.3% / 52.2% / 50.9% |
Hero v. boss: 28.4 dmg, 0.00 armor, 58.6 maxHP — bosskamp koster 31.1 HP. HP→XP-kurs: 0.34 HP/XP.
Dødsårsager: boss:3604 event:344 trap:231 enemy:1468 elite:844

### balanced
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **63.4%** | 92.7% | 20.1 | 5.4 (0.90) | 4.68 | 50.6 | 52/16 | 2.34/0.34 | 24.5 | 89.4% / 65.8% / 61.3% |
Hero v. boss: 22.2 dmg, 0.31 armor, 85.7 maxHP — bosskamp koster 40.0 HP. HP→XP-kurs: 0.39 HP/XP.
Dødsårsager: boss:2929 elite:369 enemy:317 event:26 trap:18

### cautious
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **29.0%** | 73.0% | 19.0 | 2.8 (0.05) | 3.02 | 47.5 | 38/11 | 2.56/0.94 | 31.8 | 94.4% / 83.9% / 72.6% |
Hero v. boss: 13.5 dmg, 2.75 armor, 71.6 maxHP — bosskamp koster 54.6 HP. HP→XP-kurs: 0.50 HP/XP.
Dødsårsager: boss:4397 enemy:648 elite:2041 trap:8 event:7

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
| **43.4%** | 86.9% | 19.9 | 4.6 (0.64) | 4.14 | 62.0 | 47/16 | 2.37/0.56 | 37.0 | 90.9% / 73.0% / 65.8% |
Hero v. boss: 15.9 dmg, 0.25 armor, 102.5 maxHP — bosskamp koster 64.7 HP. HP→XP-kurs: 0.54 HP/XP.
Dødsårsager: boss:4348 enemy:642 elite:659 event:8 trap:4

### altid +armor
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **45.4%** | 84.7% | 19.8 | 4.9 (0.68) | 4.29 | 45.5 | 47/16 | 2.34/0.51 | 25.8 | 90.3% / 68.9% / 61.5% |
Hero v. boss: 15.6 dmg, 3.59 armor, 78.6 maxHP — bosskamp koster 44.2 HP. HP→XP-kurs: 0.46 HP/XP.
Dødsårsager: boss:3932 elite:626 enemy:865 event:19 trap:23

## Eksperiment 3: Uden movement manipulation (balanced, 0 nudges/rerolls)
### balanced uden manipulation
| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |
|---|---|---|---|---|---|---|---|---|---|
| **32.6%** | 57.0% | 17.5 | 4.3 (0.48) | 4.33 | 46.0 | 40/9 | 0.11/0.00 | 22.7 | 89.2% / 65.0% / 60.2% |
Hero v. boss: 21.3 dmg, 0.29 armor, 78.2 maxHP — bosskamp koster 41.6 HP. HP→XP-kurs: 0.42 HP/XP.
Dødsårsager: elite:2991 boss:2437 enemy:1248 event:41 trap:18
