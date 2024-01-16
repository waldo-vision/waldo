import { CombinedDeleteScopes } from './delete/delete_all';
import { CombinedReadScopes } from './read/read_all';
import { CombinedUpdateScopes } from './update/update_all';
import { CombinedWriteScopes } from './write/write_all';
// export master array

const AllActionScopes = [
  CombinedDeleteScopes,
  CombinedReadScopes,
  CombinedUpdateScopes,
  CombinedWriteScopes,
].reduce<string[]>((acc, scopeObj) => [...acc, ...Object.values(scopeObj)], []);

export const MasterScopeArray = AllActionScopes;
