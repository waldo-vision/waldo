import { Novu } from '@novu/node';

const config = {
  backendUrl: process.env.NOVU_BACKEND_URL,
  socketUrl: process.env.NOVU_WS_URL,
};

const novu = new Novu(process.env.NOVU_API_KEY, config);

export { novu };
