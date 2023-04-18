import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';
import { hash, verify } from 'argon2';

// eslint-disable-next-line no-undef
function genApiKey(size = 20, format: BufferEncoding = 'base64') {
  const buffer = randomBytes(size);
  return buffer.toString(format);
}

async function genSecretHash(key: string) {
  const hashStore = await hash(key);

  return hashStore;
}

async function compareKeyAgainstHash(hash_from_db: string, api_key: string) {
  const hashed_api_key = await verify(hash_from_db, api_key);
  return hashed_api_key;
}

export { genApiKey, genSecretHash, compareKeyAgainstHash };
