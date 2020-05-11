import { Router } from 'express';
import { signUp, login } from '../controllers/auth.controller';
import { validation } from '../middleware/validator';
const authRouter = Router();

authRouter.post('/signup', validation, signUp);
authRouter.post('/login', login);

export default authRouter;
