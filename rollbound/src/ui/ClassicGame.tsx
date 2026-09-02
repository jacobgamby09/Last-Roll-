import { useReducer } from 'react';
import { CONFIG } from '../core/config';
import { newGame, reducer } from '../core/engine';
import { ActionPanel } from './ActionPanel';
import { Hud } from './Hud';
import { LogView } from './LogView';
import { TrackView } from './TrackView';

export function ClassicGame() {
  const [state, dispatch] = useReducer(reducer, undefined, () => newGame(Math.floor(Math.random() * 2 ** 31)));

  return (
    <div className="app">
      <header className="header">
        <h1>ROLLBOUND</h1>
        <div className="header-meta">
          <a href={window.location.pathname} className="btn btn-small">Pixel UI</a>
          <span>Level model: {CONFIG.levelUpMode === 'rotation' ? 'Rotation' : 'Choice'}</span>
          <span>Seed {state.seed}</span>
          <button className="btn btn-small" onClick={() => dispatch({ type: 'RESTART' })}>
            New run
          </button>
        </div>
      </header>
      <Hud state={state} />
      <TrackView state={state} />
      <ActionPanel state={state} dispatch={dispatch} />
      <LogView state={state} />
    </div>
  );
}
