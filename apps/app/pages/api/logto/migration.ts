import { retrieveUserInfoServer } from '@server/utils/logto';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@server/db/client';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const logto_user = await retrieveUserInfoServer(req.cookies);

  // check if there is a nextauth account with logto user info
  // the logto user var isn't typed so use this link for ref
  // on potential outputs. https://docs.logto.io/docs/references/users/social-identities/
  try {
    const result = await prisma?.account.findFirst({
      where: {
        providerAccountId:
          logto_user.userInfo.identities[
            Object.keys(logto_user.userInfo.identities)[0]
          ].userId,
      },
    });

    const identityData =
      logto_user.userInfo.identities[
        Object.keys(logto_user.userInfo.identities)[0]
      ].details;

    // V1 Account exists
    if (result || result !== null) {
      try {
        await prisma.v2Account.create({
          data: {
            provider: Object.keys(logto_user.userInfo.identities)[0],
            providerAccountId: identityData.id,
            logtoId: logto_user.claims.sub,
            userId: result.userId,
          },
        });

        // update user with logto relevant info
        try {
          await prisma.user.update({
            where: {
              id: result.userId,
            },
            data: {
              image: identityData.avatar,
              name: identityData.name,
            },
          });
        } catch (err) {
          // handle error
        }
      } catch (err) {
        // handle error
      }
    }
  } catch (err) {
    // handle error w sentry or something
  }

  // if no account exists then just create a normal V2 Account.

  try {
  } catch (err) {
    // handle error
  }

  return res.status(200).json(logto_user);
}
