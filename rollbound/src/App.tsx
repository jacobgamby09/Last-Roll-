import { useReducer } from 'react';
import { CONFIG } from './core/config';
import { newGame, reducer } from './core/engine';
import { Hud } from './ui/Hud';
import { TrackView } from './ui/TrackView';
import { ActionPanel } from './ui/ActionPanel';
import { LogView } from './ui/LogView';

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, () => newGame(Math.floor(Math.random() * 2 ** 31)));

  return (
    <div className="app">
      <header className="header">
        <h1>ROLLBOUND</h1>
        <div className="header-meta">
          <span>Level-model: {CONFIG.levelUpMode === 'rotation' ? 'Rotation' : 'Valg'}</span>
          <span>Seed {state.seed}</span>
          <button className="btn btn-small" onClick={() => dispatch({ type: 'RESTART' })}>
            Nyt run
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
