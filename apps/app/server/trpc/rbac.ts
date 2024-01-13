/**
 * 
 * @param userScope 
 * The current logged on users scope;
 * @param requiredScope 
 * The required scope
 * @returns boolean
 */
export const userHasScope = (userScope: Array<string>, requiredScope: Array<string>): boolean => {
    const userHasRequiredScope = requiredScope.some(a => userScope.includes(a));
    return userHasRequiredScope;
}