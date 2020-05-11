import { sign, verify } from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { config } from 'dotenv';
import prisma from '../database/init';
config();

export const createToken = async (payload: object, type = 'access token') => {
  let token: string;
  if (type == 'access token') {
    token = sign(payload, 'process.env.ACCESS_TOKEN_SECRET', {
      expiresIn: '1h',
    });
  } else {
    token = sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '30days',
    });

    const saveToken = await prisma.tokens.create({
      data: {
        token: token,
      },
    });
  }

  return token;
};

export const verifyToken = (token: string, secret: string) => {
  try {
    const decodedInfo = verify(token, secret);
    return decodedInfo;
  } catch (error) {
    if (error.name === 'TokenExpiredError')
      throw createHttpError(401, 'Token Expired');

    if (error.name === 'JsonWebTokenError')
      throw createHttpError(401, 'Token Invalid');

    throw error;
  }
};

const token = createToken({ text: 'Hello' });
console.log(token);

const tokenInfo = verifyToken(
  'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXh0IjoiSGVsbG8iLCJpYXQiOjE1ODkwMDE3MTAsImV4cCI6MTU4OTAwMTcyNX0.-rQ2tJ1bdwRNBc_pnWI2yqEQ5CbEf9F9ZcQAMb5N-4M',
  'apple'
);

console.log(tokenInfo);
