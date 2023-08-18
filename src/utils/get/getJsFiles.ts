import axios from 'axios';

/**
* Returns an array of Javascript files within a GitHub repository at the specified URL.
* @async
* @param {string} baseUrl - The base URL of the repository.
* @param {string} [installToken] - A GitHub authorization token for accessing private repositories.
* @returns {Promise<Array>} An array of Javascript files within the repository.
*/
export default async function getJSFiles(baseUrl: string, headers: any) {
    const response = await axios.get(baseUrl, { headers });
    const content = response.data;
    let jsFiles: any[] = [];

    // Recursively iterate through directory contents until all Javascript files are found
    for (let item of content) {
        if (item.type === 'file' && item.name.endsWith('.js')) {
            jsFiles.push(item);
        } else if (item.type === 'dir') {
            jsFiles = jsFiles.concat(await getJSFiles(item.url, headers));
        }
    }

    return jsFiles;
}



