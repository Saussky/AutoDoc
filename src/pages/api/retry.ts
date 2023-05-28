import type { NextApiRequest, NextApiResponse } from 'next'
import tsDocify from '@/utils/openAI';


export default async function handler(
  req: NextApiRequest,
  res: any
  // res: NextApiResponse<GithubRepo>
) {
  const code = req.body.code
  const codeWithAddedComments = await tsDocify(code, 'TS')

  res.status(200).json(codeWithAddedComments)
}
