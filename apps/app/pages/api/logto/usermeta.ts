import { prisma } from '@server/db/client';
import { retrieveRawUserInfoServer } from '@server/utils/logto';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const logto_user = await retrieveRawUserInfoServer(req.cookies);
  let userMeta;
  // retrieve user data from db
  try {
    const data = await prisma.v2Account.findFirst({
      where: {
        providerAccountId:
          logto_user.userInfo.identities[
            Object.keys(logto_user.userInfo.identities)[0]
          ].userId,
      },
      include: {
        user: true,
      },
    });
    return res.status(200).json({
      blacklisted: data?.user.blacklisted,
    });
  } catch (err) {
    // handle error
  }
}
