import axios from 'axios';


/**
* Returns an array of TypeScript files within a GitHub repository at the specified URL.
* @async
* @param {string} baseUrl - The base URL of the repository.
* @param {string} [installToken] - A GitHub authorization token for accessing private repositories.
* @returns {Promise<Array>} An array of TypeScript files within the repository.
*/
export default async function getTSFiles(baseUrl: string, headers: any) {
    const response = await axios.get(baseUrl, { headers });
    const content = response.data;
    let tsFiles: any[] = [];

    // Recursively iterate through directory contents until all TypeScript files are found
    for (let item of content) {
        if (item.type === 'file' && item.name.endsWith('.ts')) {
            tsFiles.push(item);
        } else if (item.type === 'dir') {
            tsFiles = tsFiles.concat(await getTSFiles(item.url, headers));
        }
    }

    return tsFiles;
}



