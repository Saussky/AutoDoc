import { GitHubResponse } from '@/context/codeSlice';
import docify from '../openAI';


export default async function addComments(filesArr: GitHubResponse[], fileType: 'JS' | 'TS') {
    const DELAY_MS = 350; // adjust this value to control the delay between requests
    const MAX_RETRIES = 5;
    const results = [];


    for (const file of filesArr) {
        let response = null;
        let error = null;

        for (let i = 0; i < 1; i++) {
            try {
                response = await docify(file.code, fileType);
                break; // exit the loop if successful
            } catch (err) {
                error = err;
                i += 1
                console.error(`Error adding ${fileType}Doc to file ${file.path}. Retrying...`, err);
                await new Promise((resolve) => setTimeout(resolve, DELAY_MS)); // wait before retrying
            }
        }

        if (response) {
            results.push({
                ...file,
                tsCode: response
            });
        } else {
            console.error(`Failed to add ${fileType}Doc to file ${file.path} after ${MAX_RETRIES} attempts.`, error);
            results.push({
                ...file,
                tsCode: 'error'
            });
        }

        // wait for a specified delay before making the next request
        await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }

    return results;
}
