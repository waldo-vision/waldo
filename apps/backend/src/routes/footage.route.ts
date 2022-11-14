import { Router } from 'express';
import {
  createFootage,
  deleteFootage,
  getUserFootage,
  getFootage,
  getFootageClips,
  updateFootage,
} from '../controllers/footage.controller';
import { Routing, DependsOnMethod } from 'express-zod-api';

const footageRouter: Routing = {
  footage: {
    '': new DependsOnMethod({
      post: createFootage,
      get: getFootage,
      patch: updateFootage,
      delete: deleteFootage,
    }),
    user: getUserFootage,
    clips: getFootageClips,
  },
};

export { footageRouter };
