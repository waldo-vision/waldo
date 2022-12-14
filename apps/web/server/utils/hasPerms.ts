export enum Perms {
  isOwner = 0,
  roleMod = 1,
  roleAdmin = 2,
}

export enum Roles {
  User = 0,
  Mod = 1,
  Admin = 2,
}

/**
 * Checks if a user has the proper perms to access the resources of an endpoint
 * @param param0
 * @returns if user has the proper perms
 */
export function hasPerms({
  userId,
  userRole,
  itemOwnerId,
  requiredPerms,
  blacklisted,
}: {
  userId: string;
  userRole: Roles;
  itemOwnerId: string;
  requiredPerms: Perms;
  blacklisted: boolean;
}): boolean {
  // if blacklisted immediately deny
  if (blacklisted) return false;
  // if user owns the item
  else if (userId === itemOwnerId) return true;
  // if userRole is greater than or equal to the required perms
  else if (userRole >= requiredPerms) return true;

  // TODO: blacklist check

  return false;
}
