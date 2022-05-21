import jwt from 'jsonwebtoken';

export const signin = (opts?: { id?: number }) => {
  // Build a JWT payload { id, email }
  const payload = { id: opts?.id ?? '123', email: 'test@test.com' };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object { jwt: 'JWT' }
  const session = { jwt: token };

  // Turn session Object into JSON
  const sessionJson = JSON.stringify(session);

  // Encode JSON as base64
  const base64 = Buffer.from(sessionJson).toString('base64');

  // Return cookie with encoded data
  return [`session=${base64}`];
};
