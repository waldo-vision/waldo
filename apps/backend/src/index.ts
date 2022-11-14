import dotenv from 'dotenv';
import express, { json } from 'express';
import path from 'path';
import {
  createConfig, Routing, ServeStatic,
  createServer, attachRouting, OpenAPI
} from 'express-zod-api';

import swaggerUi from 'swagger-ui-express';
import { clipRouter } from './routes/clip.route';
import { footageRouter } from './routes/footage.route';
import { connect } from './services/database';

dotenv.config();

const HOST = `http://${process.env.HOST}` || 'http://localhost';
const PORT = parseInt(process.env.PORT || '4500');

const app = express();
const jsonParser = json();
app.use(jsonParser);

export const zodConfig = createConfig({
  app,
  server: {
    listen: PORT, // port or socket
  },
  cors: true,
  logger: {
    level: 'debug',
    color: true,
  },
  inputSources: {
    post: ["body"],
  },
});

const APIRouter: Routing = {
  v1: {
    footage: footageRouter.footage,
    clip: clipRouter.clip,
  },
  '': new ServeStatic(path.join(__dirname, '/../../web/out'), {
    dotfiles: "allow",
    redirect: true,
  }),
};

const openapi = new OpenAPI({
  routing: APIRouter,
  config: zodConfig,
  version: "0.0.1",
  title: "Waldo Backend API Documentation",
  serverUrl: 'http://localhost',
});

const { notFoundHandler, logger } = attachRouting(zodConfig, APIRouter);
app.use('/v1', express.json(), notFoundHandler);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(openapi.rootDoc));
app.use(notFoundHandler);
app.listen(PORT, async () => {
  await connect();

  console.log(`Web application started on URL ${HOST}:${PORT} 🎉`);
});