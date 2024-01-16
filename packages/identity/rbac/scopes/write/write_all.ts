import { ApiKey } from './apiKey';
import { Gameplay } from './gameplay';
import { GameplayVote } from './gameplayVote';
import { Infraction } from './infraction';

export const CombinedWriteScopes = [
  ApiKey,
  Gameplay,
  GameplayVote,
  Infraction,
].reduce<string[]>((acc, scopeObj) => [...acc, ...Object.values(scopeObj)], []);
