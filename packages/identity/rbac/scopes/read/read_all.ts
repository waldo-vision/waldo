import { ApiKey } from './apiKey';
import { Clip } from './clip';
import { Gameplay } from './gameplay';
import { GameplayVote } from './gameplayVote';
import { Infraction } from './Infraction';
import { User } from './user';
import { V2Account } from './V2Account';
import { WaldoPage } from './waldoPage';
import { WaldoSite } from './waldoSite';

export const CombinedReadScopes = [
  ApiKey,
  Clip,
  Gameplay,
  GameplayVote,
  Infraction,
  User,
  V2Account,
  WaldoPage,
  WaldoSite,
].reduce<string[]>((acc, scopeObj) => [...acc, ...Object.values(scopeObj)], []);
