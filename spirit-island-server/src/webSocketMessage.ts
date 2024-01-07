import { GameState } from './gameState';

export enum WebSocketMessageType {
  JOIN_GAME = 'JOIN_GAME',
  CLIENT_ID = 'CLIENT_ID',
  PUT_PRESENCE = 'PUT_PRESENCE',
  GAME_STATE = 'GAME_STATE',
}

export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: unknown;
}

export interface JoinGamePayload {
  gameId: string;
}

export interface ClientIdPayload {
  clientId: string;
  playerId: number;
}

export interface PutPresencePayload {
  landNumber: number;
}

export interface GameStatePayload extends GameState {}
