import { Request, Response, NextFunction } from 'express';
import prisma from '../database/init';

export const createUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { url, shortened_url, user_id } = req.body;
    const newUrl = await prisma.urls.create({
      data: {
        url,
        shortened_url,
        Users: { connect: { id: user_id } },
      },
    });

    res.status(201).send({
      status: 'Success',
      payload: newUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUrls = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const urls = await prisma.urls.findMany();

    res.send({
      status: 'Success',
      payload: urls,
    });
  } catch (error) {
    next(error);
  }
};

export const getUrlByShortenedUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const url = await prisma.urls.findOne({
      where: {
        shortened_url: req.params.shortened_url,
      },
    });

    res.send({
      status: 'Success',
      payload: url,
    });
  } catch (error) {
    next(error);
  }
};

export const editUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const editedUrl = await prisma.urls.update({
      where: { id: +req.params.id },
      data: req.body,
    });

    res.send({
      status: 'Success',
      payload: editedUrl,
    });
  } catch (error) {
    next(error);
  }
};
