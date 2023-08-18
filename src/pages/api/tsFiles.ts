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
};

interface RequestBody {
  ownerInput: string;
  repoInput: string;
  accessToken?: string;
  fileType: 'TS' | 'JS';
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
  //res: NextApiResponse<GithubRepo>
) {
  try {
    const { ownerInput: owner, repoInput: repo, accessToken, fileType }: RequestBody = req.body;
    if (!owner || !repo || !fileType) {
      return res.status(400).json({ error: 'Please enter an owner, repo name and file type.' });
    }
    
    const url = `https://api.github.com/repos/${owner}/${repo}/contents`;
    const token = accessToken || await generateInstallToken()!;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
    };

    const branch = await getDefaultBranch(url, headers);
    const pages = fileType === 'TS' ? await getTSFiles(url, headers) : await getJsFiles(url, headers);
    const pagesWithCode = await addCode(pages);
    const pagesWithAddedComments = await addComments(pagesWithCode, fileType);

    res.status(200).json({ codeFiles: pagesWithAddedComments, branch: branch, token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
}
