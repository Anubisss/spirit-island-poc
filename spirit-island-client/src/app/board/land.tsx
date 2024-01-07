import { useDrop } from 'react-dnd';

import LandPresence from './land-presence';
import { PlayerLandPresence } from './player-land-presence';

interface LandProps {
  landNumber: number;
  fill: string;
  d: string;
  presences: PlayerLandPresence[];
  canAddPresence: boolean;
  onLandAddPresence: (landNumber: number) => void;
}

const Land = ({
  landNumber,
  fill,
  d,
  presences,
  canAddPresence,
  onLandAddPresence,
}: LandProps) => {
  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: 'presence',
      canDrop: () => canAddPresence,
      drop: (item: { id: number }) => onLandAddPresence(landNumber),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [canAddPresence, onLandAddPresence, landNumber]
  );

  return (
    <g ref={dropRef}>
      <path
        style={{
          fill,
          stroke: '#021e0b',
          strokeWidth: isOver && canAddPresence ? 10 : 1,
          fillOpacity: isOver && canAddPresence ? 0.8 : 1.0,
        }}
        d={d}
      />
      {presences.map((presence, i) => (
        <LandPresence
          key={i}
          count={presence.count}
          pos={presence.pos}
          fillColor={presence.fillColor}
          textColor={presence.textColor}
        />
      ))}
    </g>
  );
};

export default Land;
