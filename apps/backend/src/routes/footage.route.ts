import { Router } from 'express';
import {
  createFootage,
  deleteFootage,
  getAllFootage,
  getUserFootage,
  getFootage,
  getFootageClips,
  updateFootage,
} from '../controllers/footage.controller';

const footageRoute = (): Router => {
  const router = Router();

  router.post('/', createFootage);

  router.get('/', getAllFootage);

  router.get('/:uuid', getFootage);

  router.get('/user/:id', getUserFootage);

  router.get('/clips/:uuid', getFootageClips);

  router.patch('/:uuid', updateFootage);

  router.delete('/:uuid', deleteFootage);

  return router;
};

export { footageRoute };
