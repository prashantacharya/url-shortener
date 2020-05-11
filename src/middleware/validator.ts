import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

export const validation = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, confirmPassword } = req.body;

    const emailRe: RegExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const passwordRe: RegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!emailRe.test(email)) throw createHttpError(400, 'Invalid email');

    if (password !== confirmPassword)
      throw createHttpError(400, 'Password and confirm password do not match');

    if (!passwordRe.test(password)) {
      throw createHttpError(
        400,
        'Password must contain at least 8 characters, ' +
          '1 alphabet 1 special character and 1 number'
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
