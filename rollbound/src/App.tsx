import { PixelGame } from './pixel/PixelGame';
import { EquipmentLab } from './pixel/EquipmentLab';
import { ResourceLab } from './pixel/ResourceLab';
import { TileLab } from './pixel/TileLab';
import { ClassicGame } from './ui/ClassicGame';

export default function App() {
  const ui = new URLSearchParams(window.location.search).get('ui');
  if (ui === 'classic') return <ClassicGame />;
  if (ui === 'tiles') return <TileLab />;
  if (ui === 'equipment') return <EquipmentLab />;
  if (ui === 'resources') return <ResourceLab />;
  return <PixelGame />;
}
