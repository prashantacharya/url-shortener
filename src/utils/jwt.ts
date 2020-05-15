import { sign, verify } from 'jsonwebtoken';
import createHttpError from 'http-errors';
import prisma from '../database/init';

export const createToken = async (
  payload: object,
  secret: string,
  type = 'access token'
) => {
  let token: string;
  if (type == 'access token') {
    token = sign(payload, secret, {
      expiresIn: '1h',
    });
  } else {
    token = sign(payload, secret, {
      expiresIn: '30days',
    });
    try {
      const saveToken = await prisma.tokens.create({
        data: {
          token: token,
        },
      });
    } catch (error) {
      throw error;
    }
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
