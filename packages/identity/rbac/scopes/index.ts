import * as Delete from './delete';
import * as Read from './read';
import * as Update from './update';
import * as Write from './write';

export * as Write from './write';
export * as Update from './update';
export * as Read from './read';
export * as Delete from './delete';

// export master array

const AllActionScopes = [
  Delete.CombinedDeleteScopes,
  Read.CombinedReadScopes,
  Update.CombinedUpdateScopes,
  Write.CombinedWriteScopes,
].reduce<string[]>((acc, scopeObj) => [...acc, ...Object.values(scopeObj)], []);

export const MasterScopeArray = AllActionScopes;
