export interface GameState {
  presences: {
    [landNumber: number]: {
      [clientId: string]: number;
    };
  };
}
