import React from 'react';
import { useDrag } from 'react-dnd';

interface PresenceProps {
  id: number;
  hidden: boolean;
  canDrag: boolean;
  playerId: number;
}

const Presence = ({ id, hidden, canDrag, playerId }: PresenceProps) => {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: 'presence',
      item: { id },
      canDrag,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [canDrag, id]
  );

  const fillColor = playerId === 1 ? '#0074cc' : '#ffd700';

  return (
    <span
      ref={dragRef}
      className="inline-block"
      style={{
        cursor: canDrag ? (isDragging ? 'grabbing' : 'grab') : 'not-allowed',
        visibility: hidden ? 'hidden' : 'visible',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <svg viewBox="0 0 100 100" width="80">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000000" />
          </filter>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="#000000"
          strokeWidth="1"
          fill={fillColor}
          filter="url(#shadow)"
        />
      </svg>
    </span>
  );
};

export default Presence;
