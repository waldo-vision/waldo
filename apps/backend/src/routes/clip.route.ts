import { Router } from 'express';
import { Routing, DependsOnMethod } from 'express-zod-api';
import {
  deleteClip,
  getClip,
  createClip,
  downloadClipById,
} from '../controllers/clip.controller';

const clipRouter: Routing = {
  clip: {
    '': new DependsOnMethod({
      post: createClip,
      get: getClip,
      delete: deleteClip,
    }),
    download: downloadClipById,
  },
};

export { clipRouter };
