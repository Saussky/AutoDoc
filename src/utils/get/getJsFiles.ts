import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config()

/**
* Returns an array of Javascript files within a GitHub repository at the specified URL.
* @async
* @param {string} baseUrl - The base URL of the repository.
* @param {string} [installToken] - A GitHub authorization token for accessing private repositories.
* @returns {Promise<Array>} An array of Javascript files within the repository.
*/
export default async function getTSFiles(baseUrl: string, headers: any) {
    const response = await axios.get(baseUrl, { headers });
    const content = response.data;
    let tsFiles: any[] = [];

    // Recursively iterate through directory contents until all Javascript files are found
    for (let item of content) {
        if (item.type === 'file' && item.name.endsWith('.js')) {
            tsFiles.push(item);
        } else if (item.type === 'dir') {
            tsFiles = tsFiles.concat(await getTSFiles(item.url, headers));
        }
    }

    return tsFiles;
}



