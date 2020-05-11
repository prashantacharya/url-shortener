import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  deleteUser,
} from '../controllers/users.controller';

const userRouter = Router();

userRouter.get('/all', getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.delete('/:id', deleteUser);

export default userRouter;
