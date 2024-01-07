import type React from 'react';

export enum TerrainType {
  Mountain,
  Wetland,
  Jungle,
  Sands,
}

export interface Land {
  number: number;
  terrainType: TerrainType;
  isCoastal?: boolean;
  adjacentLandNumbers: number[];
}

export interface BoardProps {
  landDistances: null | { [key: number]: number };
  presences: {
    [landNumber: number]: {
      [clientId: string]: number;
    };
  };
  currentClientId: string;
  playerId: number;
  onLandAddPresence: (landNumber: number) => void;
}

export interface Board {
  variation: 'A' | 'B' | 'C' | 'D';
  lands: Land[];
  MapComponent: React.FC<BoardProps>;
}
