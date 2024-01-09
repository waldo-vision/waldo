import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@server/db/client';
import { retrieveRawUserInfoServer } from '@server/utils/logto';

export async function GET(request: NextApiRequest, response: NextApiResponse) {
  const logto_user = await retrieveRawUserInfoServer(request.cookies);
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
    return response.status(200).json({
      blacklisted: data?.user.blacklisted,
    });
  } catch (err) {
    // handle error
  }
}
