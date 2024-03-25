import { Novu } from '@novu/node';

const config = {
  backendUrl: process.env.NEXT_PUBLIC_NOVU_BACKEND_URL,
  socketUrl: process.env.NEXT_PUBLIC_NOVU_WS_URL,
};

const novu = new Novu(process.env.NOVU_API_KEY, config);

export { novu };
