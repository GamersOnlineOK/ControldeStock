import crypto from 'crypto';

const encodeJson = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');

const getSecret = () => process.env.JWT_SECRET || 'dev-secret';

const sign = (data) => crypto
  .createHmac('sha256', getSecret())
  .update(data)
  .digest('base64url');

export const createAuthToken = (user, expiresInSeconds = 8 * 60 * 60) => {
  const now = Math.floor(Date.now() / 1000);
  const header = encodeJson({ alg: 'HS256', typ: 'JWT' });
  const payload = encodeJson({
    sub: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
    iat: now,
    exp: now + expiresInSeconds,
  });
  const data = `${header}.${payload}`;

  return `${data}.${sign(data)}`;
};

export const verifyAuthToken = (token) => {
  if (typeof token !== 'string') {
    throw new Error('Token invalido');
  }

  const [header, payload, signature] = token.split('.');
  if (!header || !payload || !signature) {
    throw new Error('Token invalido');
  }

  const data = `${header}.${payload}`;
  const expectedSignature = sign(data);
  const expectedBuffer = Buffer.from(expectedSignature);
  const signatureBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== signatureBuffer.length || !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) {
    throw new Error('Token invalido');
  }

  const parsedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  if (parsedPayload.exp && parsedPayload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token vencido');
  }

  return parsedPayload;
};
