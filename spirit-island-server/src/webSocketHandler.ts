import { Server, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

import {
  addPresence,
  getGame,
  getGameByClientId,
  getPlayerCount,
  joinGame,
  sendClientIdAndPlayerId,
  sendGameStateToEveryClientOfTheGame,
} from './gameManager';
import {
  addNewClient,
  kickClient,
  removeClient,
} from './webSocketClientManager';
import {
  WebSocketMessage,
  WebSocketMessageType,
  JoinGamePayload,
  PutPresencePayload,
} from './webSocketMessage';

const webSocketHandler = (wss: Server) => {
  wss.on('connection', (ws) => {
    const clientId = uuidv4();
    console.log(`[${clientId}] new connection`);
    addNewClient(clientId, ws);

    ws.on('message', (message) => {
      const parsedMessage: WebSocketMessage = JSON.parse(message.toString());
      console.log(`[${clientId}] new message, type: ${parsedMessage.type}`);

      switch (parsedMessage.type) {
        case WebSocketMessageType.JOIN_GAME:
          joinGameHandler(clientId, parsedMessage.payload as JoinGamePayload);
          break;
        case WebSocketMessageType.PUT_PRESENCE:
          putPresenceHandler(
            clientId,
            parsedMessage.payload as PutPresencePayload
          );
          break;
        default:
          console.error(
            `[${clientId}] unhandled message type: ${parsedMessage.type}`
          );
          break;
      }
    });

    ws.on('close', () => {
      console.log(`[${clientId}] client disconnected`);
      removeClient(clientId);
    });
  });
};

const joinGameHandler = (clientId: string, payload: JoinGamePayload) => {
  const { gameId } = payload;
  console.log(`[joinGameHandler] clientId: ${clientId}, gameId: ${gameId}`);

  const game = getGame(gameId);
  if (!game) {
    console.log(
      `[joinGameHandler] game doesn't exist, kicking client... clientId: ${clientId}, gameId: ${gameId}`
    );
    kickClient(clientId, `game doesn't exist`);
    return;
  }

  joinGame(game, clientId);
  sendClientIdAndPlayerId(clientId, getPlayerCount(gameId));
};

const putPresenceHandler = (clientId: string, payload: PutPresencePayload) => {
  const { landNumber } = payload;
  console.log(
    `[putPresenceHandler] clientId: ${clientId}, landNumber: ${landNumber}`
  );

  const game = getGameByClientId(clientId);
  if (!game) {
    console.log(
      `[putPresenceHandler] game doesn't exist, kicking client... clientId: ${clientId}`
    );
    kickClient(clientId, `game doesn't exist`);
    return;
  }

  addPresence(clientId, game, landNumber);

  sendGameStateToEveryClientOfTheGame(game);
};

export default webSocketHandler;
