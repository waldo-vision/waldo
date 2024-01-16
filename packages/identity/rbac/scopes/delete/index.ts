import { ApiKey } from './apiKey';
import { Gameplay } from './gameplay';
import { GameplayVote } from './gameplayVote';
import { User } from './user';

export const CombinedDeleteScopes = [
  ApiKey,
  Gameplay,
  GameplayVote,
  User,
].reduce<string[]>((acc, scopeObj) => [...acc, ...Object.values(scopeObj)], []);

export { ApiKey, Gameplay, GameplayVote, User };
