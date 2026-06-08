import crypto from 'crypto';

const ITERATIONS = 310000;
const KEY_LENGTH = 32;
const DIGEST = 'sha256';
const PREFIX = 'pbkdf2_sha256';

export const hashPassword = (password) => {
  if (typeof password !== 'string' || password.length < 8) {
    throw new Error('La contraseña debe tener al menos 8 caracteres');
  }

  const salt = crypto.randomBytes(16).toString('base64url');
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('base64url');
  return `${PREFIX}$${ITERATIONS}$${salt}$${hash}`;
};

export const verifyPassword = (password, storedHash) => {
  if (typeof password !== 'string' || typeof storedHash !== 'string') return false;

  const [prefix, iterations, salt, hash] = storedHash.split('$');
  if (prefix !== PREFIX || !iterations || !salt || !hash) return false;

  const candidate = crypto
    .pbkdf2Sync(password, salt, Number(iterations), KEY_LENGTH, DIGEST)
    .toString('base64url');

  const expectedBuffer = Buffer.from(hash);
  const candidateBuffer = Buffer.from(candidate);

  if (expectedBuffer.length !== candidateBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, candidateBuffer);
};
