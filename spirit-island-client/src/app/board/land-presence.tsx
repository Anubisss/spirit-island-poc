import { PlayerLandPresence } from './player-land-presence';

interface LandPresenceProps extends PlayerLandPresence {}

const LandPresence: React.FC<LandPresenceProps> = ({
  count,
  pos,
  fillColor,
  textColor,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <circle
          key={index}
          cx={pos.x - index * 5}
          cy={pos.y - index * 5}
          r={50 - index * (count > 3 ? 0.5 : 2)}
          stroke="#000000"
          strokeWidth="1"
          fill={fillColor}
          filter="url(#shadow)"
        />
      ))}
      <text
        x={pos.x - (count - 1) * 5}
        y={pos.y - (count - 1) * 5}
        fontSize="40"
        fontFamily="Arial"
        fill={textColor}
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {count}
      </text>
    </>
  );
};

export default LandPresence;
