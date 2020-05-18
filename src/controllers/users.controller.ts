import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import prisma from '../database/init';

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.users.findMany();

    users.forEach((user) => {
      delete user.password;
    });

    res.status(200).send({
      status: 'Success',
      payload: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.users.findOne({
      where: {
        id: +req.params.id,
      },
      include: {
        Urls: true,
      },
    });

    if (!user) throw createHttpError(404, 'User not found');

    delete user.password;
    res.status(200).send({
      status: 'Success',
      payload: user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.users.findOne({
      where: {
        id: +req.params.id,
      },
    });

    if (!user) throw createHttpError(404, 'User not found');

    const deletedUser = await prisma.users.delete({
      where: {
        id: +req.params.id,
      },
    });

    res.status(204).send({
      status: 'Success',
      payload: deletedUser,
    });
  } catch (error) {
    next(error);
  }
};
