import { createServer } from 'http';

import express from 'express';
import cors from 'cors';
import { Server } from 'ws';

import createGame from './createGame';
import webSocketHandler from './webSocketHandler';

const PORT = 3003;

const httpServerForWebSocket = createServer();
const wss = new Server({ server: httpServerForWebSocket });
webSocketHandler(wss);

const app = express();

app.use(express.json());
app.use(cors());

app.post('/createGame', createGame);

httpServerForWebSocket.listen(3004);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
