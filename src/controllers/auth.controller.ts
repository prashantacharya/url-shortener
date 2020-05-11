import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

import prisma from '../database/init';

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

    res.status(201).send({
      status: 'Success',
      payload: newUser,
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

    if (!user?.verified) throw createHttpError(403, 'Email not verified');

    if (!user || req.body.password !== user.password)
      throw createHttpError(400, 'Email or password do not match');

    res.send(user);
  } catch (error) {
    next(error);
  }
};
