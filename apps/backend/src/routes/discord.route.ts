import { Routing, DependsOnMethod } from 'express-zod-api';
import { isInGuild } from '../controllers/discord.controller';

const discordRouter: Routing = {
  discord: {
    ':token': isInGuild
  },
};

export { discordRouter };
