import { v4 as uuidv4 } from 'uuid';
import { sendMessage } from './webSocketClientManager';
import {
  ClientIdPayload,
  GameStatePayload,
  WebSocketMessage,
  WebSocketMessageType,
} from './webSocketMessage';
import { GameState } from './gameState';

interface Game {
  gameId: string;
  clientIds: string[];
  state: GameState;
}

interface Games {
  [gameId: string]: Game;
}

const games: Games = {};

export const createNewGame = () => {
  const gameId = uuidv4();
  console.log(`Game is created: ${gameId}`);

  games[gameId] = {
    gameId,
    clientIds: [],
    state: { presences: {} },
  };

  return gameId;
};

export const getGame = (gameId: string): undefined | Game => {
  return games[gameId];
};

export const getGameByClientId = (clientId: string) => {
  for (const game of Object.values(games)) {
    if (game.clientIds.includes(clientId)) {
      return game;
    }
  }
  return null;
};

export const doesGameExist = (gameId: string) => {
  return !!getGame(gameId);
};

export const getPlayerCount = (gameId: string) => {
  return getGame(gameId)!.clientIds.length;
};

export const joinGame = (game: Game, clientId: string) => {
  console.log(`[joinGame] gameId: ${game.gameId}, clientId: ${clientId}`);
  game.clientIds.push(clientId);
};

export const sendClientIdAndPlayerId = (clientId: string, playerId: number) => {
  sendMessage(clientId, {
    type: WebSocketMessageType.CLIENT_ID,
    payload: { clientId, playerId } as ClientIdPayload,
  });
};

export const addPresence = (
  clientId: string,
  game: Game,
  landNumber: number
) => {
  console.log(
    `[addPresence] gameId: ${game.gameId}, landNumber: ${landNumber}`
  );

  if (game.state.presences[landNumber] === undefined) {
    game.state.presences[landNumber] = {};
  }

  if (game.state.presences[landNumber][clientId] === undefined) {
    game.state.presences[landNumber][clientId] = 1;
  } else {
    ++game.state.presences[landNumber][clientId];
  }
};

export const sendGameStateToEveryClientOfTheGame = (game: Game) => {
  console.log(`[sendGameStateToEveryClientOfTheGame] gameId: ${game.gameId}`);

  const message: WebSocketMessage = {
    type: WebSocketMessageType.GAME_STATE,
    payload: game.state as GameStatePayload,
  };

  for (const clientId of game.clientIds) {
    sendMessage(clientId, message);
  }
};
