import { GameplayVote } from './GameplayVote';
import { User } from './user';
import { V2Account } from './V2Account';
import { Infraction } from './Infraction';

export const CombinedUpdateScopes = [
  User,
  V2Account,
  GameplayVote,
  Infraction,
].reduce<string[]>((acc, scopeObj) => [...acc, ...Object.values(scopeObj)], []);

export { User, V2Account, GameplayVote, Infraction };
