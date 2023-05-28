import { createSlice } from '@reduxjs/toolkit'

export interface Links {
    self: string,
    git: string,
    html: string
}
// TODO: LOOK FOR LINTER FILE AND APPLY LINT AT END OF AI CALL?
export interface GitHubResponse {
    name: string,
    path: string,
    sha: string,
    size: number,
    url: string,
    html_url: string,
    git_url: string,
    download_url: string,
    type: string,
    _links: Links,
    code: string,
    tsCode?: string
}

export interface CodeState {
    files: Array<GitHubResponse>,
    branch: string,
    gitToken: string
}

const initialState: CodeState = {
    files: [
    ],
    branch: 'blank',
    gitToken: '',
}

export const codeFilesSlice = createSlice({
    name: 'codeFiles',
    initialState,
    reducers: {
        updateCodeFiles: (state, action) => {
            state.files = action.payload;
        },
        updateTsCode: (state, action) => {
            const { index, tsCode } = action.payload;
            state.files[index].tsCode = tsCode;
        },
        updateBranch: (state, action) => {
            state.branch = action.payload;
        },
        updateGitToken: (state, action) => {
            state.gitToken = action.payload;
        }
    }
});