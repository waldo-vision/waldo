import { APIPartialGuild, Routes } from 'discord-api-types/v10';
import axios from 'axios';
import dotenv from 'dotenv';
import { PrismaClient } from 'database'
import { defaultEndpointsFactory, z } from 'express-zod-api';
dotenv.config()
const IsInGuildReturn = z.object({
  message: z.string(),
  isInGuild: z.boolean(),
});

const DiscordApi = "https://discord.com/api/v10/users/@me/guilds";
const WaldoGuildId = process.env.WALDO_DISCORD_ID;
const prisma = new PrismaClient()
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
    const query = await prisma.account.findFirst({
      where: {
        providerAccountId: discordId
      },
    })
    const access_token = query?.access_token
    try {
      const response = await axios.get<APIPartialGuild[]>(
        DiscordApi,
        {
          headers: {
            "Authorization": `Bearer ${access_token}`,
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
