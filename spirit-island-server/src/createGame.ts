import { Request, Response } from 'express';

import { createNewGame } from './gameManager';

const createGame = (_req: Request, res: Response) => {
  const gameId = createNewGame();
  res.json({ gameId });
};

export default createGame;
