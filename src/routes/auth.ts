import { Router } from 'express';
import { signUp, login, verifyEmail } from '../controllers/auth.controller';
import { validation } from '../middleware/validator';
const authRouter = Router();

authRouter.post('/signup', validation, signUp);
authRouter.post('/login', login);
authRouter.get('/verify/:token', verifyEmail);

export default authRouter;
