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

### Current prototype equipment rules

The first functional equipment slice uses exactly one starter and one upgrade per slot:

* Weapon: Trækølle → Slebet klinge (`+3 Damage`)
* Armor: Stoftunika → Jernplade (`+1 Armor`)
* Boots / Utility: Slidte sandaler → Stivinderstøvler (`1 free Nudge charge`)

Treasure, combat drops, and Shops present equipment as an offer. The player compares the equipped item with the new item and explicitly chooses whether to equip it or keep the current item. Shop Gold is spent only when the player confirms `Buy & Equip`.

Equipment effects are fixed per item and are not permanent stat consumables. Equipping replaces the effect in that slot. An already equipped upgrade is removed from future Treasure and drop pools and disabled in Shops; the prototype therefore needs no inventory or duplicate-conversion rule.

The Stivinderstøvler charge pays for the next valid Nudge before the normal Nudge resource is spent. The Boots asset and charge are displayed in the equipment slot, while the normal Nudge count remains a separate resource.

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

## Current Visual Direction

The approved presentation is crisp dark-fantasy pixel art with a near-black plum background and sharp, restrained neon category colors.

Board tiles use an **asset-as-tile** model:

* The visible tile is a frameless miniature diorama on an irregular ground platform.
* Do not place the diorama inside a visible square card, tile frame, or dark rectangular container.
* An invisible `88 × 88` logical cell remains behind each asset for layout, path connections, hit targets, movement, and accessibility.
* Source tile assets use a `64 × 64` transparent RGBA canvas and a shared baseline.
* Tile numbers, labels, costs, rewards, selection states, and accessibility text belong to the UI layer and must not be baked into bitmap assets.
* Candidate and selected destinations should outline or glow around the diorama silhouette rather than display a rectangular selection frame.

Current category colors:

* Enemy — neon red
* Elite — magenta
* Gold — yellow
* Treasure — amber
* Camp — green
* Shop — cyan
* Event — violet
* Trap — purple
* Blank — muted slate
* Boss — ivory and red

Color must not be the only identifier. Every tile family should also have a readable silhouette and a compact text label or consequence chip where necessary.

The board remains the primary visual focus. Decorative effects must not obscure the upcoming path, the hero, possible destinations, or visible HP costs and rewards.

Equipment presentation uses a separate icon grammar:

* Source equipment assets use a `48 × 48` transparent RGBA canvas, a maximum `36 × 36` visible silhouette, and a shared baseline.
* Equipment icons inherit the board palette and hard pixel density, but never use a ground platform or tile frame.
* Weapon, Armor, and Boots / Utility must have distinct silhouettes; color remains a secondary identifier.
* The HUD stores and displays the equipped Weapon, Armor, and Boots / Utility assets. Equipment offers compare current and new items before the player equips or keeps the current item.
* Boots / Utility and Nudge are separate concepts. Stivinderstøvler currently provide one visible free Nudge charge, but a Nudge resource reward must never be presented as Boots or silently replace equipped Boots.
* Item names, effects, prices, comparison states, and rarity treatment belong to the UI layer and must not be baked into bitmap assets.
* The canonical production rules live in `rollbound/design/equipment-asset-contract-v1.md`.

Non-equipment resources use a separate icon grammar:

* Damage, Armor, Life / HP, Gold, Nudge, and Reroll use standalone `48 × 48` transparent HUD assets.
* Damage and Armor stat assets communicate the current numeric stats; they must not reuse the currently equipped Weapon or Armor item art.
* Resource icons never occupy an equipment slot and must not imply that a resource is an equippable item.
* Nudge and Reroll may share a D6 motif, but their arrow silhouettes must remain distinguishable without relying only on color.
* Resource icons have no platform, tile frame, label, number, price, or equipment-slot treatment baked into the bitmap.
* The canonical production and semantic mapping rules live in `rollbound/design/resource-asset-contract-v1.md`.

Readability is a visual-system requirement:

* Runtime functional text must remain at least `9 px`; descriptions use at least `11 px` and item/destination names use at least `12 px`.
* Never scale the complete board with a CSS transform. Narrow layouts preserve the native pixel scale and scroll inside the board panel.
* Disabled choices must state why they are disabled, and only their artwork may be dimmed enough to lose contrast.
* Names, effects, prices and consequences wrap rather than clip or ellipsize.
* Color is never the only state cue; preserve labels, outlines, status text and keyboard focus treatment.
* The canonical cross-component rules and breakpoint QA live in `rollbound/design/readability-contract-v1.md`.

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
