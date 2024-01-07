const createNewGame = async (): Promise<null | string> => {
  try {
    const response = await fetch('http://localhost:3003/createGame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Something went wrong. Status code: ${response.status}`);
    }

    const { gameId }: { gameId: string } = await response.json();
    return gameId;
  } catch (error) {
    console.error('Error creating a new game:', error);
  }

  return null;
};

export default createNewGame;
