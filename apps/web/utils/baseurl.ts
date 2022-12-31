/**
 * Gets the base url
 * @returns base url (without trailing /)
 */
export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL; // SSR should use nextauth url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};
