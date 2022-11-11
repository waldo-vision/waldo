import { Router } from 'express';
import {
  createClip,
  deleteClip,
  getAllClips,
  getClip,
  downloadClipByID,
} from '../controllers/clip.controller';

const clipRoute = (): Router => {
  const router = Router();

  router.post('/:footage', createClip);

  router.get('/', getAllClips);

  router.get('/:uuid', getClip);

  router.get('/download/:uuid', downloadClipByID);

  // router.patch('/clip/:id', updateClip);

  router.delete('/:uuid', deleteClip);

  return router;
};

export { clipRoute };
