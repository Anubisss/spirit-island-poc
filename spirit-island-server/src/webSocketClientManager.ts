import { WebSocket } from 'ws';
import { WebSocketMessage } from './webSocketMessage';

interface Client {
  rawClient: WebSocket;
}

const clients: { [clientId: string]: Client } = {};

export const addNewClient = (clientId: string, client: WebSocket) => {
  console.log(`[addNewClient] client addded: ${clientId}`);

  clients[clientId] = {
    rawClient: client,
  };
};

const getClient = (clientId: string): undefined | Client => {
  return clients[clientId];
};

const doesClientExist = (clientId: string) => {
  return !!clients[clientId];
};

const getRawClient = (clientId: string) => {
  return getClient(clientId)!.rawClient;
};

export const removeClient = (clientId: string) => {
  delete clients[clientId];
  console.log(`[removeClient] clientId: ${clientId}`);
};

export const kickClient = (clientId: string, reason: string) => {
  if (!doesClientExist(clientId)) {
    console.error(`[kickClient] client doesn't exist: ${clientId}`);
    return;
  }

  console.log(
    `[kickClient] client kicked, clientId: ${clientId}, reason: ${reason}`
  );

  getRawClient(clientId).close(4000, reason);
  removeClient(clientId);
};

export const sendMessage = (clientId: string, message: WebSocketMessage) => {
  getRawClient(clientId).send(JSON.stringify(message));
};
