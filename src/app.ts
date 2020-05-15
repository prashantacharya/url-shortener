import express, { Application, Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import authRouter from './routes/auth';
import userRouter from './routes/users';
import urlRouter from './routes/url';
// import main from './script';

import { config } from 'dotenv';
config();

console.log(process.env.ACCESS_TOKEN_SECRET);

const app: Application = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('App running successfully');
});

app.use('/api/v1/url', urlRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.use('/*', (req: Request, res: Response, next: NextFunction) => {
  next(createHttpError(404, 'Page not found'));
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500).send({
    status: 'Error',
    message: error.message || 'Internal Server Error',
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Application running at http://localhost:${port}`);
});
