// Al scene- og combat-timing bor her, så playtest-justering er ét sted.
// Værdier i ms. Reglen fra AGENTS.md: en scene må aldrig trække tiden.

export const SCENE_TIMING = {
  enter: 220, // fade/scale ind for alle fullscreen-scener
};

export const COMBAT_TIMING = {
  intro: 700,       // fjenden træder ind, navneskilt
  introBoss: 1300,  // bossens ceremoni-indtræden
  eventBase: 800,   // første udveksling — roligt nok til at aflæse rullet
  eventDecay: 0.92, // blidt accelererende tempo pr. event
  eventMin: 420,    // gulv for tempoet
  outcome: 950,     // pause på sidste slag før payout
};
