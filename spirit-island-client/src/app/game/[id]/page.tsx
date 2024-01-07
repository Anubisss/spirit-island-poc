'use client';

import { useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'next/navigation';

import Board from '../../board/board';
import Presence from '../../presence/presence';
import { boardA } from '../../board/boards';
import useConnectionHandler from '../use-connection-handler';
import ConnectionStates from '../connection-states';

const Home = () => {
  const params = useParams<{ id: string }>();
  const { id: gameId } = params;

  const { state, clientId, playerId, gameState, joinGame, putPresence } =
    useConnectionHandler();

  useEffect(() => {
    if (gameId && state === ConnectionStates.CONNECTED) {
      joinGame(gameId);
    }
  }, [gameId, state, joinGame]);

  const usedPresenceCount = useMemo(() => {
    return Object.values(gameState.presences).reduce(
      (acc, curr) => acc + (curr[clientId] || 0),
      0
    );
  }, [gameState.presences, clientId]);

  if (state !== ConnectionStates.JOINED_GAME) {
    return 'Connecting...';
  }

  const handleLandAddPresence = (landNumber: number) => {
    putPresence(landNumber);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex justify-center">
        <Board
          board={boardA}
          presences={gameState.presences}
          currentClientId={clientId}
          playerId={playerId}
          handleLandAddPresence={handleLandAddPresence}
        />
      </div>
      <div className="text-center">
        {Array.from({ length: 8 }).map((_, index) => {
          return (
            <Presence
              key={index + 1}
              id={index + 1}
              hidden={usedPresenceCount > index}
              canDrag={usedPresenceCount === index}
              playerId={playerId}
            />
          );
        })}
      </div>
    </DndProvider>
  );
};

export default Home;
