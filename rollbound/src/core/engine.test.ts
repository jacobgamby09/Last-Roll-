// Engine-kontrakter:
// 1) Determinisme: samme seed + samme actions => bit-identisk state.
// 2) Dice-peek: UI'ets preview (peekRoll) SKAL matche det roll, reduceren
//    derefter producerer — inkl. dieTransform-boots. PixelGame afhænger af dette.

import { describe, expect, it } from 'vitest';
import { newGame, peekRoll, reducer, type Action } from './engine';
import type { GameState } from './types';

function policyAction(s: GameState): Action | null {
  switch (s.phase.t) {
    case 'idle': return { type: 'ROLL' };
    case 'rolled': return { type: 'ACCEPT' };
    case 'chooseRoll': return { type: 'CHOOSE_ROLL', index: 0 };
    case 'teleport': return { type: 'TELEPORT_MOVE', steps: 6 };
    case 'preCombat': return { type: 'FIGHT' };
    case 'levelup': return { type: 'PICK_LEVELUP', pick: 'dmg' };
    case 'treasure': return { type: 'PICK_TREASURE', index: 0 };
    case 'equipment': return s.hero.gold >= s.phase.cost ? { type: 'EQUIP_OFFER' } : { type: 'KEEP_EQUIPMENT' };
    case 'shop': return { type: 'LEAVE_SHOP' };
    case 'over': return null;
  }
}

function playOut(seed: number): GameState {
  let s = newGame(seed);
  for (let i = 0; i < 500; i++) {
    const action = policyAction(s);
    if (!action) break;
    s = reducer(s, action);
  }
  return s;
}

describe('engine-kontrakter', () => {
  it('samme seed + samme actions giver identisk slut-state', () => {
    for (const seed of [0, 2, 15, 42, 123456]) {
      const a = playOut(seed);
      const b = playOut(seed);
      expect(a.phase.t, `seed ${seed} skal afslutte runnet`).toBe('over');
      expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    }
  });

  it('dice-peek-kontrakten: næste RNG-træk i idle er præcis ét d6 = det faktiske roll', () => {
    for (const seed of [0, 7, 99]) {
      let s = newGame(seed);
      let checked = 0;
      for (let i = 0; i < 300 && s.phase.t !== 'over'; i++) {
        if (s.phase.t === 'idle') {
          const predicted = peekRoll(s);
          s = reducer(s, { type: 'ROLL' });
          if (s.phase.t === 'rolled') {
            expect(s.phase.roll, `seed ${seed}, roll #${checked + 1}`).toBe(predicted);
            checked++;
          }
        } else {
          const action = policyAction(s);
          if (!action) break;
          s = reducer(s, action);
        }
      }
      expect(checked).toBeGreaterThan(5);
    }
  });
});
