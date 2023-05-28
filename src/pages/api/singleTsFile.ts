import type { NextApiRequest, NextApiResponse } from 'next'
import addCode from "@/utils/add/addCode"
import addComments from '@/utils/add/addEditedCode';
import getDefaultBranch from '@/utils/get/getBranch';
import generateInstallToken from '@/utils/auth/install-id';
import getSingleTSFile from '@/utils/get/getSingleTsFile';
import getSingleJsFile from '@/utils/get/getSingleJsFile';


export default async function handler(
  req: NextApiRequest,
  res: any
  // res: NextApiResponse<GithubRepo>
) {
  // Basic Github details
  const owner = req.body.ownerInput
  const repo = req.body.repoInput
  const filePath = req.body.filePath
  const fileType: 'TS' | 'JS' = req.body.fileType

  if (!owner || !repo || !filePath) res.status(400).json({error: 'Please enter an owner, repo name and file path.'})

  const url = `https://api.github.com/repos/${owner}/${repo}/contents`
  const fileUrl = `${url}${filePath}`

  // Github API token and data to be passed in with each API call
  const token: string = await generateInstallToken()!;
  const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json'
  };

  const branch = await getDefaultBranch(url, headers);

  const page = fileType === 'TS' ? await getSingleTSFile(fileUrl, headers) : await getSingleJsFile(url, headers)
  const pageWithCode = await addCode([page])
  const pageWithAddedComments = await addComments(pageWithCode, fileType)

  res.status(200).json({codeFiles: pageWithAddedComments, branch: branch, token: token})
}
