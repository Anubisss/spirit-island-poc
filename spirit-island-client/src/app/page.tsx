'use client';

import { useRouter } from 'next/navigation';

import createNewGame from './game/create-new-game';

const Home = () => {
  const router = useRouter();

  const handleCreateNewGame = async () => {
    const gameId = await createNewGame();
    if (gameId) {
      router.push(`game/${gameId}`);
    }
  };

  return (
    <div className="mt-8 text-center">
      <h1 className="text-6xl mb-12">Spirit Island</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
        onClick={handleCreateNewGame}
      >
        Create new game
      </button>
    </div>
  );
};

export default Home;
