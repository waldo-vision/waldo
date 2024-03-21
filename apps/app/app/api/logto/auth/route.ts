import { retrieveRawUserInfoServer } from 'identity';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@server/db/client';
import { Sub } from 'novu';
export async function GET(req: Request, res: NextApiResponse) {
  // WALDO MIGRATION LOGIC START---------START

  const logto_user = await retrieveRawUserInfoServer(req.headers.get('cookie'));
  // get acesstoken from logto response obj
  const identityData =
    logto_user.userInfo.identities[
      Object.keys(logto_user.userInfo.identities)[0]
    ].details;
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
          const data = await prisma.user.update({
            where: {
              id: result.userId,
            },
            data: {
              image: logto_user.userInfo.picture,
              name: identityData.name,
            },
          });
          await prisma.account.delete({
            where: {
              id: result.id,
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

  // if no account exists and no v2account exists then just create a normal V2 Account.

  try {
    const query = await prisma.v2Account.findFirst({
      where: {
        providerAccountId:
          logto_user.userInfo.identities[
            Object.keys(logto_user.userInfo.identities)[0]
          ].userId,
      },
    });

    if (!query || query == null) {
      const data = await prisma.v2Account.create({
        data: {
          provider: Object.keys(logto_user.userInfo.identities)[0],
          providerAccountId: identityData.id,
          logtoId: logto_user.claims.sub,
          user: {
            create: {
              name: identityData.name,
              image: logto_user.userInfo.picture,
            },
          },
        },
      });
    }
  } catch (err) {
    // handle error
  }
  // always update user data on sign-in
  try {
    const result = await prisma.v2Account.findFirst({
      where: {
        providerAccountId:
          logto_user.userInfo.identities[
            Object.keys(logto_user.userInfo.identities)[0]
          ].userId,
      },
    });

    await prisma.user.update({
      where: {
        id: result?.userId,
      },
      data: {
        name: identityData.name,
        image: identityData.avatar,
      },
    });
  } catch (err) {}

  // WALDO MIGRATION LOGIC END---------END

  // Novu Integration START--------START
  const query = await prisma?.v2Account.findFirst({
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
  const user = query?.user;
  try {
    await Sub.createSub(
      user?.id || '',
      user?.email || '',
      user?.name || '',
      user?.image || '',
    );
  } catch (err) {}

  // Novu Integration END--------END

  return Response.redirect(process.env.BASE_URL);
}
