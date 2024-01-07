import { useCallback, useEffect, useState } from 'react';

import ConnectionStates from './connection-states';

enum WebSocketMessageType {
  CLIENT_ID = 'CLIENT_ID',
  GAME_STATE = 'GAME_STATE',
}

interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: unknown;
}

interface GameState {
  presences: {
    [landNumber: number]: {
      [clientId: string]: number;
    };
  };
}

interface ClientIdPayload {
  clientId: string;
  playerId: number;
}

interface GameStatePayload extends GameState {}

const useConnectionHandler = () => {
  const [state, setState] = useState(ConnectionStates.IDLE);
  const [socket, setSocket] = useState<null | WebSocket>(null);
  const [clientId, setClientId] = useState('');
  const [playerId, setPlayerId] = useState(0);
  const [gameState, setGameState] = useState<GameState>({ presences: {} });

  useEffect(() => {
    const newSocket = new WebSocket(`ws://localhost:3004`);
    setSocket(newSocket);

    newSocket.onopen = () => {
      newSocket.onerror = (error) => {
        console.error('websocket error', error);
      };

      setState(ConnectionStates.CONNECTED);
    };
    newSocket.onclose = () => {
      setState(ConnectionStates.DISCONNECTED);
    };
    newSocket.onmessage = ({ data }) => {
      const parsed: WebSocketMessage = JSON.parse(data);

      switch (parsed.type) {
        case WebSocketMessageType.CLIENT_ID:
          const { clientId, playerId } = parsed.payload as ClientIdPayload;
          console.log(`received clientId: ${clientId}, playerId: ${playerId}`);

          setClientId(clientId);
          setPlayerId(playerId);
          break;
        case WebSocketMessageType.GAME_STATE:
          setGameState(parsed.payload as GameStatePayload);
          break;
        default:
          console.error(`unhandled message type: ${parsed.type}`);
          break;
      }
    };

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (clientId) {
      setState(ConnectionStates.JOINED_GAME);
    }
  }, [clientId]);

  const joinGame = useCallback(
    (gameId: string) => {
      if (state !== ConnectionStates.CONNECTED) {
        console.error(
          `[joinGame] the connection must have CONNECTED state, state: ${state}`
        );
        return;
      }

      socket!.send(
        JSON.stringify({
          type: 'JOIN_GAME',
          payload: {
            gameId,
          },
        })
      );
      console.log(`[joinGame] joined to game, gameId: ${gameId}`);
    },
    [state, socket]
  );

  const putPresence = (landNumber: number) => {
    if (state !== ConnectionStates.JOINED_GAME) {
      console.error(
        `[putPresence] the connection must have JOINED_GAME state, state: ${state}`
      );
      return;
    }

    socket!.send(
      JSON.stringify({
        type: 'PUT_PRESENCE',
        payload: {
          landNumber,
        },
      })
    );
    console.log(`[putPresence] presence added, landNumber: ${landNumber}`);
  };

  return { state, clientId, playerId, gameState, joinGame, putPresence };
};

export default useConnectionHandler;
