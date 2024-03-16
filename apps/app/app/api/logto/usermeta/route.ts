import { NextApiResponse } from 'next';
import { prisma } from '@server/db/client';
import { retrieveRawUserInfoServer } from 'identity';

export async function GET(request: Request, response: NextApiResponse) {
  const logto_user = await retrieveRawUserInfoServer(
    request.headers.get('cookie'),
  );
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
    return Response.json({
      blacklisted: data?.user.blacklisted,
    });
  } catch (err) {
    return Response.json({ err });
    // handle error
  }
}
