import { Routing } from 'express-zod-api';
import { isInGuild } from '../controllers/discord.controller';

const discordRouter: Routing = {
  discord: {
    ':discordId': isInGuild,
  },
};

export { discordRouter };
