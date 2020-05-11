import { Router } from 'express';
import {
  createUrl,
  getAllUrls,
  editUrl,
  getUrlByShortenedUrl,
} from '../controllers/url.controller';

const urlRouter = Router();

urlRouter.get('/all', getAllUrls);
urlRouter.get('/:shortened_url', getUrlByShortenedUrl);
urlRouter.post('/create', createUrl);
urlRouter.patch('/:id', editUrl);

export default urlRouter;
