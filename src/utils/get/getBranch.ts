import axios from 'axios';

export default async function getDefaultBranch(url: string, headers: any): Promise<string> {
    try {
        const response = await axios.get(url.replace('/contents', ''), { headers });
        const defaultBranch = await response.data.default_branch;
        return defaultBranch;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to get default branch.');
    }
}
