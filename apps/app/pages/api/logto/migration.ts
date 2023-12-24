import { retrieveUserInfo } from '@server/utils/logto';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const logto_user_information = await retrieveUserInfo();

  return res.status(200).json(logto_user_information);
}
