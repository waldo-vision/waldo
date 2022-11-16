import { APIPartialGuild, Routes } from 'discord-api-types/v10';
import axios from 'axios';
import { defaultEndpointsFactory, z } from 'express-zod-api';
const IsInGuildReturn = z.object({
  message: z.string(),
  isInGuild: z.boolean(),
});
type IsInGuild = z.infer<typeof IsInGuildReturn>;

const DiscordApi = "https://discord.com/api/v10/users/@me/guilds";
const WaldoGuildId = process.env.WALDO_DISCORD_ID;

/**
 * GET /discord/isInGuild/:id
 * @summary Checks if user is in the Waldo guild
 * @return {IsInGuild} 200 - Success response returns whether in guild
 */
export const isInGuild = defaultEndpointsFactory.build({
  method: 'get',
  input: z.object({
    discordId: z.string().optional(),
    token: z.string()
  }),
  output: IsInGuildReturn,
  handler: async ({ input: { discordId, token }, options, logger }) => {
    const accessToken = token;
    try {
      const response = await axios.get<APIPartialGuild[]>(
        DiscordApi,
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        },
      );
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].id === WaldoGuildId)
          return { message: 'Is in Waldo Discord', isInGuild: true };
      }
    } catch (error: any) {
      console.log(error.response.data)
    }

    return { message: 'Please join the Waldo Discord', isInGuild: false};
  },
});
