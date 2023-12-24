import { retrieveUserInfoServer } from '@server/utils/logto';
import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const logto_user_information = await retrieveUserInfoServer(req.cookies);

  // check if there is a nextauth user / account with logto user info

  // if user / account exists, migrate to logto account.

  return res.status(200).json(logto_user_information);
}
