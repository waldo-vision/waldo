import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';
import { verify, hash } from 'argon2';
import * as Sentry from '@sentry/nextjs';

// eslint-disable-next-line no-undef
function genApiKey(size = 20, format: BufferEncoding = 'base64') {
  const buffer = randomBytes(size);
  return buffer.toString(format);
}

async function genSecretHash(key: string) {
  const hashStore = await hash(key);

  return hashStore;
}

async function compareKeyAgainstHash(storedKey: string, suppliedKey: string) {
  try {
    if (await verify(storedKey, suppliedKey)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    Sentry.captureException(err);
    return false;
  }
}

export { genApiKey, genSecretHash, compareKeyAgainstHash };
