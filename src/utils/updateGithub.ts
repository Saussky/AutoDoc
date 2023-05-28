import { CodeState, GitHubResponse } from '@/context/codeSlice';
import axios from 'axios';

function extractPathsAndTsCodes(files: CodeState["files"]) {
    const result: { [key: string]: { tsCode: string, sha: string } } = {};

    for (const key in files) {
        const file = files[key];
        result[file.path] = { tsCode: file.tsCode!, sha: file.sha };
    }

    return result;
}

export default async function createBranchAndUpdateFiles(
    files: GitHubResponse[],
    baseBranch: string,
    accessToken: string,
): Promise<void> {
    console.log(baseBranch)
    // const owner = 'TheMetakey'
    // const repo = 'birthday-bot.discord'
    const newBranchName = 'tsdocify';
    const apiBaseUrl = 'https://api.github.com';

    const githubUrl = files[0].url
    const regex = /\/repos\/([^/]+)\/([^/]+)/;
    const match = githubUrl.match(regex);

    let owner, repo
    if (match) {
        owner = match[1];
        repo = match[2];
    }
    console.log(owner, repo)

    try {

        const filesToUpdate = extractPathsAndTsCodes(files)


        const headers = {
            'Authorization': `token ${accessToken}`,
            'Accept': 'application/vnd.github+json',
        };

        // Get the base branch's latest commit SHA
        const { data: baseBranchData } = await axios.get(
            `${apiBaseUrl}/repos/${owner}/${repo}/branches/${baseBranch}`,
            { headers },
        );
        const baseCommitSha = baseBranchData.commit.sha;
        console.log("🚀 ~ file: updateGithub.ts:24 ~ baseCommitSha:", baseCommitSha)

        // Create a new branch from the base branch
        await axios.post(
            `${apiBaseUrl}/repos/${owner}/${repo}/git/refs`,
            {
                ref: `refs/heads/${newBranchName}`,
                sha: baseCommitSha,
            },
            { headers },
        );

        console.log('new branch made')

        // Update the specified files with the modified code
        for (const filePath in filesToUpdate) {
            const newContent = filesToUpdate[filePath];

            // Update the new branch's reference to the new blob
            await axios.put(
                `${apiBaseUrl}/repos/${owner}/${repo}/contents/${filePath}`,
                {
                    message: `Update ${filePath}`,
                    content: Buffer.from(newContent.tsCode).toString('base64'),
                    sha: newContent.sha,
                    branch: newBranchName,
                },
                { headers },
            );
            console.log('updated one file...')
        }
        console.log('finished updating github branch!')
    } catch (error) {
        console.log('error updating github branch:', error)
        throw new Error("fuck")
    }
}