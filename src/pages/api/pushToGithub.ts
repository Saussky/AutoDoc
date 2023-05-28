import type { NextApiRequest, NextApiResponse } from 'next'
import createBranchAndUpdateFiles from '@/utils/updateGithub'
import { CodeState, GitHubResponse } from '@/context/codeSlice'



export default async function handler(
    req: NextApiRequest,
    res: any
    // res: NextApiResponse<GithubRepo>
) {
    const files = req.body.files;
    const branch = req.body.branch;
    const token = req.body.token;

    await createBranchAndUpdateFiles(files, branch, token)

    res.status(200).json()
}
