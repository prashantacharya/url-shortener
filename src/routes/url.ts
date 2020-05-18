import { Router } from 'express';
import {
  createUrl,
  getAllUrls,
  editUrl,
  getUrlByShortenedUrl,
} from '../controllers/url.controller';
import { authValidation } from '../middleware/authValidation';

const urlRouter = Router();

urlRouter.get('/all', getAllUrls);
urlRouter.get('/:shortened_url', getUrlByShortenedUrl);
urlRouter.post('/create', authValidation, createUrl);
urlRouter.patch('/:id', authValidation, editUrl);

export default urlRouter;
