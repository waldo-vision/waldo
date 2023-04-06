import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';
import { argon2i } from 'argon2-ffi';
const checkURL = (url: string): boolean => {
  const p =
    // eslint-disable-next-line max-len
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

  if (url.match(p)) {
    return true;
  }
  return false;
};

// eslint-disable-next-line no-undef
function genApiKey(size = 20, format: BufferEncoding = 'base64') {
  const buffer = randomBytes(size);
  return buffer.toString(format);
}

async function genSecretHash(key: string) {
  const salt = randomBytes(8).toString('hex');
  const buffer = scryptSync(key, salt, 64);
  const hash = await argon2i.hash(key, buffer);

  return hash;
}

async function compareKeyAgainstHash(storedKey: string, suppliedKey: string) {
  try {
    if (await argon2i.verify(storedKey, suppliedKey)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

export { checkURL, genApiKey, genSecretHash, compareKeyAgainstHash };
