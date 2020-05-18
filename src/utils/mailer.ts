import { createTransport } from 'nodemailer';
import { sign, verify } from 'jsonwebtoken';
import createHttpError from 'http-errors'

interface mailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendMail = async (options: mailOptions) => {
  let transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail(options);
};

export const mailTokens = async (userId: number) => {
  if (process.env.SMTP_SECRET) {
    const token = sign(
      { data: userId, scope: 'verification' },
      process.env.SMTP_SECRET,
      { expiresIn: '15mins' }
    );
    return token;
  }
};

export const verifyMailTokens = async (token: string) => {
  if (process.env.SMTP_SECRET) {
    try {
      const info: any = verify(token, process.env.SMTP_SECRET)
      if (info.scope === 'verification')
        return info.data;
    } catch (error) {
      if (error.name === 'TokenExpiredError')
        throw createHttpError(401, 'Token Expired');

      if (error.name === 'JsonWebTokenError')
        throw createHttpError(401, 'Token Invalid');

      throw error;
    }
  }
}
