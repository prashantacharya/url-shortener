import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization && process.env.ACCESS_TOKEN_SECRET) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const userInfo = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
      res.locals.id = userInfo.id;
    } catch (error) {
      next(error);
    }
  }

  next();
};
