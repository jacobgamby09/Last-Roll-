# AGENTS.md

## Project Overview

**Working title: Rollbound**

Rollbound is a boardgame-inspired roguelike RPG.

The core gameplay loop is:

**Roll → Evaluate → Manipulate → Move → Resolve → Upgrade → Repeat**

The player moves along a long boardgame-like track by rolling a D6. The roll determines movement, but the player has limited tools such as Nudges and Rerolls to manipulate the result.

The player must make the most of imperfect outcomes, manage limited resources, build their hero, and reach the boss strong enough to win.

The prototype should prioritize proving that this core loop is fun before adding content or meta systems.

## Core Design Philosophy

### 1. Adaptation over control

Dice RNG is intentional.

The player should usually have some influence over an outcome, but should not be able to reliably force the perfect destination.

Target feeling:

* ~70% adaptation
* ~30% control

Avoid systems that make dice rolls irrelevant.

### 2. The board is the primary gameplay

Combat is deliberately simple.

Most meaningful decisions should happen through:

* board navigation
* resource management
* deciding when to manipulate a roll
* deciding which risks are worth taking
* choosing upgrades
* building the hero

Do not add combat complexity simply to make combat more interactive.

### 3. Combat is the result of the build

Combat should answer:

> "Was the hero I built strong enough for this encounter?"

Combat is primarily automatic.

The player should not need mechanical skill or constant interaction.

Limited-use active Spells are the main intended exception.

### 4. Simple systems, interesting interactions

Prefer a small number of understandable mechanics that interact with each other.

Avoid adding:

* unnecessary currencies
* large stat lists
* excessive item slots
* complex combat subsystems
* mechanics that duplicate existing systems

Before adding a new system, ask whether an existing system can create the same decision.

### 5. Every board outcome should be situational

There should not be one tile type that is always objectively best.

Examples:

* Enemy = XP, but costs HP
* Treasure = gear
* Gold = future flexibility
* Camp = recovery
* Blank = safety
* Elite = high risk / high reward
* Shop = controlled build improvement

The value of a tile should depend on the current run state.

## Prototype Scope

The first playable prototype should test:

> Is rolling a die, evaluating the possible destination, optionally manipulating the result, and resolving the tile fun for roughly 15–25 rolls?

Do not prioritize long-term progression or large content pools until this works.

## Board

The first prototype uses one mostly linear track.

Target:

* approximately 65–80 tiles
* approximately 15–25 rolls per run
* target average around 20 rolls
* Boss at the end of the track

The exact numbers are tuning targets, not hard rules.

## Board Visibility

The player should be able to see enough upcoming tiles to plan ahead.

Current target:

* approximately 8–12 tiles ahead

Movement should therefore involve short-term planning rather than only reacting to the current roll.

## Dice Movement

Base movement uses:

**1 × D6**

Higher numbers are NOT inherently better.

Skipping tiles can mean skipping upgrades.

### Nudge

A limited resource.

Allows:

* +1 movement
* -1 movement

The player chooses whether to spend it after seeing the roll.

### Reroll

A limited resource.

Discard the current result and roll again.

Default rule:

**The new result must be accepted.**

Rerolls should therefore involve risk.

## Tile Types

Initial prototype tile pool:

* Blank
* Enemy
* Elite
* Gold
* Treasure
* Shop
* Camp
* Event
* Boss

Approximately 35–40% of the board can be Blank / normal road.

Blank tiles are intentional and useful for:

* pacing
* safe outcomes
* movement decisions
* future board-modification mechanics

Do not treat Blank tiles as missing content.

## Hero

Keep the hero sheet compact.

Core stats:

* HP
* Max HP
* Damage
* Armor
* Level
* XP
* Gold

HP persists between encounters.

There is no automatic full heal after combat.

## Level System

The player starts at Level 1.

Enemies are the primary source of XP.

XP required for the next level increases progressively.

There is no hard level cap.

Run length and increasing XP requirements should naturally limit the achievable level.

## Level Up

A level-up should offer a small choice.

Initial upgrade pool can focus on:

* Damage
* Max HP
* Armor

Avoid making the level system overly complicated during the prototype.

Levels should primarily represent raw character power.

## Equipment

Keep equipment slots deliberately limited.

Current slots:

1. Weapon
2. Armor
3. Boots / Utility

Avoid adding helmets, gloves, rings, etc. unless there is a strong design reason.

### Weapon

Primarily defines offensive combat behavior.

Examples:

* higher damage
* armor penetration
* first-hit bonus
* lifesteal
* other simple attack modifiers

### Armor

Primarily defines survivability.

Can influence:

* Armor
* Max HP
* healing
* defensive triggers

### Boots / Utility

This slot should preferably interact with board movement or navigation.

Examples:

* free Nudges under specific conditions
* altered dice behavior
* movement modifiers
* interaction with specific tile types

This slot helps connect RPG progression with board gameplay.

## Spells

Current target:

**2 Spell slots**

Spells may be active abilities.

They should use limited charges rather than a traditional mana system.

Charges persist across encounters and do not automatically refill after each combat.

Examples:

Combat

* direct damage
* heal
* block next attack

Board

* modify movement
* alter a visible tile
* teleport
* manipulate the current roll

Spells should create tactical decisions about when a limited resource is worth spending.

## Relics

Current target:

**3 Relic slots**

Relics should primarily provide rule-changing effects.

Prefer:

> "Blank tiles give Gold"

over:

> "+5% Damage"

Relics should meaningfully alter how the player evaluates the board, dice, combat, or resources.

Relics are one of the main sources of build identity.

## Consumables

Current target:

**2 Consumable slots**

Examples:

* Healing Potion
* Bomb
* Smoke Bomb
* Dice manipulation item
* Teleport item

Consumables are tactical single-use resources.

## Combat

Combat is primarily automatic.

Base combat flow:

1. Hero attacks
2. Enemy attacks
3. Hero attacks
4. Enemy attacks
5. Repeat until one reaches 0 HP

Hero attacks first by default.

There is no Attack Speed system.

There is no real-time cooldown combat.

## Combat Stats

Prototype combat should focus on:

* HP
* Damage
* Armor

Damage may use a small range.

Example:

`7–10 Damage`

Board RNG should be significantly higher than combat RNG.

Avoid excessive:

* miss chance
* dodge chance
* random initiative
* extreme crit variance
* large damage swings

Design principle:

**High board RNG, low combat RNG.**

## Armor

Default model:

`Damage Taken = Incoming Damage - Armor`

Minimum damage can be tuned later.

Keep this easy for the player to understand.

## Enemy Design

Enemies should use the same simple combat fundamentals.

Base enemy properties:

* HP
* Damage
* Armor
* optionally one simple special trait

Variation should initially come from clear stat profiles.

Examples:

* Goblin: low HP / low Damage
* Ogre: high HP / high Damage
* Knight: high Armor
* Assassin: low HP / dangerous special rule

Avoid adding many status effects during the first prototype.

## Combat Rewards

Normal enemies primarily reward:

* XP
* small amounts of Gold

Normal enemies should NOT be a major source of gear.

This gives combat a distinct purpose:

**HP is converted into XP.**

Treasure and Shops should remain the primary sources of equipment and controlled build progression.

## Elite Rewards

Elites can provide:

* higher XP
* Gold
* stronger build rewards
* Relics
* rare gear or Spells

Elites should feel meaningfully riskier than normal enemies.

## Shops

Shops use Gold.

They should provide controlled access to progression.

Possible inventory:

* Weapons
* Armor
* Boots
* Spells
* Consumables
* occasional Relics

Possible services:

* Heal
* Buy Nudge
* Buy Reroll
* Recharge Spell
* Refresh Shop

The Shop should help the player correct weaknesses in their current run.

## Run Resource Economy

Important resources include:

**HP** — Spent indirectly through combat.

**XP** — Converts combat into raw character power.

**Gold** — Flexible buying power.

**Nudges / Rerolls** — Board-control resources.

**Spell Charges** — Rare tactical interventions.

**Consumables** — Single-use emergency tools.

The game should create tension around spending resources now versus saving them for later.

## UI / UX Priorities

The player should always be able to quickly understand:

* current position
* current dice result
* possible landing tile
* upcoming board tiles
* HP
* XP / Level
* Gold
* remaining Nudges
* remaining Rerolls
* Spell charges

The board and current movement decision are the primary visual focus.

Avoid UI clutter.

Information hierarchy matters more than visual polish during the prototype.

## Long-Term Direction

The linear track is only the first proof of concept.

The long-term concept may evolve into an Endless Board where the player helps construct or modify the board during the run.

Potential future inspiration:

* Loop Hero-like board modification
* tiles that create both benefits and downsides
* multiple board layouts
* boards with different rules
* branching tracks
* loops
* evolving terrain

Example:

**Gold Mine**

Provides significant Gold.

Downside:

Spawns Bandits nearby.

The long-term concept is:

> The player builds both the hero and the world the hero must survive.

Do NOT build these systems before the core linear-track prototype is proven.

## Development Priorities

When choosing what to implement next, prioritize in this order:

1. Dice roll
2. Track movement
3. Tile resolution
4. Nudge / Reroll
5. Hero HP / stats
6. Automatic combat
7. XP / Level Up
8. Gold
9. Treasure / Equipment
10. Shop
11. Spells
12. Relics
13. Elites / Events
14. Content expansion
15. Meta progression / Endless Board concepts

## Prototype Success Criteria

The prototype succeeds if players experience decisions such as:

> "I rolled a 5. Do I accept the Enemy, spend my last Nudge to hit the Treasure, or gamble on a Reroll?"

> "I could fight this enemy for enough XP to level, but I may need the HP for the Elite ahead."

> "The Shop is eight tiles away. Should I try to hit the Gold tile first?"

> "I can win this fight without using Fireball, but it may cost me enough HP to lose later."

If these decisions are interesting, the core concept is working.

If they are not interesting, adding more content is not the solution.

## Agent Guidelines

When implementing or proposing changes:

1. Preserve the simplicity of the core loop.
2. Do not introduce new mechanics without explaining what gameplay problem they solve.
3. Prefer modifying existing systems over adding new systems.
4. Keep combat automatic unless explicitly instructed otherwise.
5. Do not add Attack Speed.
6. Do not add unnecessary RPG equipment slots.
7. Do not remove Blank tiles just because they appear uneventful.
8. Preserve persistent HP between encounters.
9. Keep normal Enemy loot limited.
10. Treat all balance numbers as easily configurable data.
11. Avoid hardcoding content where practical.
12. Optimize for rapid iteration and playtesting over production polish.
13. If a design decision is unclear, implement the simplest version that preserves future flexibility.
14. Do not silently expand prototype scope.

## Non-Goals for the Initial Prototype

Do not prioritize:

* meta progression
* permanent account upgrades
* classes
* multiple heroes
* crafting
* large inventories
* equipment rarity systems
* dozens of status effects
* large enemy pools
* procedural endless boards
* multiplayer
* monetization
* narrative systems
* complex animation systems

These may be explored later.

The current goal is to prove the core run.
