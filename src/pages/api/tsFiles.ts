// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import addCode from "@/utils/add/addCode"
import addComments from '@/utils/add/addEditedCode';
import generateInstallToken from '@/utils/auth/install-id';
import getDefaultBranch from '@/utils/get/getBranch';
import getJsFiles from '@/utils/get/getJsFiles';
import getTSFiles from '@/utils/get/getTsFiles';


type GithubRepo = {
  owner: string,
  repo: string
}

export default async function handler(
  req: NextApiRequest,
  res: any
  // res: NextApiResponse<GithubRepo>
) {
  // Basic Github details
  const owner = req.body.ownerInput
  const repo = req.body.repoInput
  const accessToken = req.body.accessToken
  const fileType: 'TS' | 'JS' = req.body.fileType

  if (!owner || !repo) res.status(400).json({ error: 'Please enter an owner and repo name.' })
  
  const url = `https://api.github.com/repos/${owner}/${repo}/contents`
  // If user has logged in via oauth, use their access token, otherwise use the github app token
  const token = accessToken ? accessToken : await generateInstallToken()!;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
  };

  const branch = await getDefaultBranch(url, headers);
  const pages = fileType === 'TS' ? await getTSFiles(url, headers) : await getJsFiles(url, headers)
  const pagesWithCode = await addCode(pages)
  const pagesWithAddedComments = await addComments(pagesWithCode, fileType)

  res.status(200).json({ codeFiles: pagesWithAddedComments, branch: branch, token: token })
}
