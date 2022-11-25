import dotenv from 'dotenv';
import express, { json } from 'express';
import path from 'path';
import {
  createConfig,
  Routing,
  ServeStatic,
  attachRouting,
  OpenAPI,
} from 'express-zod-api';

import swaggerUi from 'swagger-ui-express';
import { clipRouter } from './routes/clip.route';
import { discordRouter } from './routes/discord.route';
import { footageRouter } from './routes/footage.route';
import { connect } from './services/database';

dotenv.config();

const HOST = `http://${process.env.HOST}` || 'http://localhost';
const PORT = parseInt(process.env.PORT || '4500');

const app = express();
const jsonParser = json();
app.use(jsonParser);

const zodConfig = createConfig({
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
    post: ['body'],
    patch: ['body'],
  },
});

const APIRouter: Routing = {
  v1: {
    footage: footageRouter.footage,
    clip: clipRouter.clip,
    discord: discordRouter.discord,
  },
};

if (process.env.NODE_ENV === 'production') {
  APIRouter[''] = new ServeStatic(path.join(__dirname, '/../../web/out'), {
    dotfiles: 'allow',
    redirect: true,
  });
}

const openapi = new OpenAPI({
  routing: APIRouter,
  config: zodConfig,
  version: '0.0.1',
  title: 'Waldo Backend API Documentation',
  serverUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://waldo.vision'
      : 'http://localhost',
});

openapi.addLicense({
  name: 'Mozilla Public License 2.0',
  url: 'https://www.mozilla.org/en-US/MPL/2.0/',
});

const { notFoundHandler } = attachRouting(zodConfig, APIRouter);
app.use('/v1', express.json(), notFoundHandler);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(openapi.rootDoc));
app.use(notFoundHandler);
app.listen(PORT, async () => {
  await connect();

  console.log(`Web application started on URL ${HOST}:${PORT} 🎉`);
});
