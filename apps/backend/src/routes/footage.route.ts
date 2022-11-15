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
    }),
    ':uuid': new DependsOnMethod({
      delete: deleteFootage,
      patch: updateFootage,
      get: getFootage,
    }),
  },
  user: getUserFootage,
  clips: getFootageClips,
};

export { footageRouter };
