import { APIPartialGuild, Routes } from 'discord-api-types/v10';
import axios from 'axios';
import { defaultEndpointsFactory, z } from 'express-zod-api';

const IsInGuildReturn = z.object({
  message: z.string(),
  isInGuild: z.boolean(),
});
type IsInGuild = z.infer<typeof IsInGuildReturn>;

const DiscordApi = 'https://discord.com/api/v10';
const WaldoGuildId = '903349717323382814';

/**
 * GET /discord/isInGuild/:id
 * @summary Checks if user is in the Waldo guild
 * @return {IsInGuild} 200 - Success response returns whether in guild
 */
export const isInGuild = defaultEndpointsFactory.build({
  method: 'get',
  input: z.object({
    discordId: z.string(),
  }),
  output: IsInGuildReturn,
  handler: async ({ input: { discordId }, options, logger }) => {
    const accessToken = '';

    try {
      const response = await axios.get<APIPartialGuild[]>(
        DiscordApi + Routes.userGuilds(),
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        },
      );

      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].id === WaldoGuildId)
          return { message: 'Is in Waldo Discord', isInGuild: true };
      }
    } catch (error) {
      logger.error(error);
    }

    return { message: 'Not in Waldo Discord', isInGuild: false };
  },
});
