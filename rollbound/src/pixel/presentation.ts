// Al scene- og combat-timing bor her, så playtest-justering er ét sted.
// Værdier i ms. Reglen fra AGENTS.md: en scene må aldrig trække tiden.

export const SCENE_TIMING = {
  enter: 220, // fade/scale ind for alle fullscreen-scener
};

export const COMBAT_TIMING = {
  intro: 550,       // fjenden træder ind, navneskilt
  introBoss: 1100,  // bossens ceremoni-indtræden
  eventBase: 420,   // første udveksling
  eventDecay: 0.82, // accelererende tempo pr. event
  eventMin: 160,    // gulv for tempoet
  outcome: 650,     // pause på sidste slag før payout
};
