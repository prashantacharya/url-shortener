import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

import prisma from '../database/init';
import { createToken } from '../utils/jwt';
import { sendMail, fillMailOptions } from '../utils/mailer';

const ifUserExists = async (email: string) => {
  const user = await prisma.users.findOne({
    where: {
      email,
    },
  });
  return user;
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (await ifUserExists(req.body.email))
      throw createHttpError(400, 'User with the email already exists');

    const { confirmPassword, ...userInfo } = req.body;
    const newUser = await prisma.users.create({
      data: userInfo,
    });

    await sendMail(fillMailOptions(newUser.email, newUser.id));

    const accessToken = await createToken(
      {
        data: {
          id: newUser.id,
          verified: newUser.verified,
        },
        scope: 'auth',
      },
      `${process.env.ACCESS_TOKEN_SECRET}`
    );

    const refreshToken = await createToken(
      {
        data: {
          id: newUser.id,
        },
        scope: 'auth',
      },
      `${process.env.REFRESH_TOKEN_SECRET}`,
      'Refresh Token'
    );

    delete newUser.password;
    res.status(201).send({
      status: 'Success',
      payload: newUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.users.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user || req.body.password !== user.password)
      throw createHttpError(400, 'Email or password do not match');

    if (!user?.verified) throw createHttpError(403, 'Email not verified');

    const accessToken = await createToken(
      {
        data: {
          id: user.id,
          verified: user.verified,
        },
        scope: 'auth',
      },
      `${process.env.ACCESS_TOKEN_SECRET}`
    );

    const refreshToken = await createToken(
      {
        data: {
          id: user.id,
        },
        scope: 'auth',
      },
      `${process.env.REFRESH_TOKEN_SECRET}`,
      'Refresh Token'
    );

    delete user.password;

    res.send({
      status: 'Success',
      payload: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    next(error);
  }
};
