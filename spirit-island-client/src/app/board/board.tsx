import { useState, useMemo } from 'react';

import type { Board } from './types';
import calcLandDistances from './calc-land-distances';

interface Props {
  board: Board;
  presences: {
    [landNumber: number]: {
      [clientId: string]: number;
    };
  };
  currentClientId: string;
  playerId: number;
  handleLandAddPresence: (landNumber: number) => void;
}

const Board = ({
  board,
  presences,
  currentClientId,
  playerId,
  handleLandAddPresence,
}: Props) => {
  const landDistances = useMemo(() => {
    const myPresences = Object.fromEntries(
      board.lands.map((land) => [
        land.number,
        presences?.[land.number]?.[currentClientId] ?? 0,
      ])
    );

    const noPresence = Object.values(myPresences).every((value) => value === 0);
    if (noPresence) {
      return null;
    }

    const distances: { [key: number]: number } = {};
    for (const landNumber in myPresences) {
      if (myPresences[landNumber] === 0) {
        continue;
      }
      const currentDistances = calcLandDistances(+landNumber, board.lands);
      for (const currentDistanceLandNumber in currentDistances) {
        if (distances[currentDistanceLandNumber] === undefined) {
          distances[currentDistanceLandNumber] =
            currentDistances[currentDistanceLandNumber];
        } else if (
          currentDistances[currentDistanceLandNumber] <
          distances[currentDistanceLandNumber]
        ) {
          distances[currentDistanceLandNumber] =
            currentDistances[currentDistanceLandNumber];
        }
      }
    }

    return distances;
  }, [presences, board.lands, currentClientId]);

  return (
    <div className="my-10">
      <h3 className="text-center mb-10">Board {board.variation}</h3>
      <div>
        <board.MapComponent
          landDistances={landDistances}
          presences={presences}
          currentClientId={currentClientId}
          playerId={playerId}
          onLandAddPresence={handleLandAddPresence}
        />
      </div>
    </div>
  );
};

export default Board;
