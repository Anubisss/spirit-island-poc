import type { Land } from './types';

const calcLandDistances = (
  startLandNumber: number,
  lands: Land[]
): { [key: number]: number } => {
  const distances = { [startLandNumber]: 0 };

  const queue: number[] = [startLandNumber];

  while (queue.length > 0) {
    const landNumber = queue.shift()!;
    const land = lands.find((land) => land.number === landNumber);

    for (const adjacentLandNumber of land!.adjacentLandNumbers) {
      if (distances[adjacentLandNumber] === undefined) {
        distances[adjacentLandNumber] = distances[landNumber] + 1;
        queue.push(adjacentLandNumber);
      }
    }
  }

  return distances;
};

export default calcLandDistances;
