import { prisma } from '@server/db/client';
import { retrieveRawUserInfoServer } from 'identity';
import { NextApiRequest, NextApiResponse } from 'next';

// this api route returns waldo vision data from a logto userid. Used for session creation.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const logto_user = await retrieveRawUserInfoServer(req.cookies);
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
    return res.status(500).json({
      error: true,
      message: 'An unknown error occured.',
    });
  }
}
