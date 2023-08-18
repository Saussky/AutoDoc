import { GitHubResponse } from '@/context/codeSlice';
import docify from '../openAI';


async function delay(time: number) {
    await new Promise((resolve) => setTimeout(resolve, time))
}

export default async function addComments(filesArr: GitHubResponse[], fileType: 'JS' | 'TS') {
  const MAX_RETRIES = 5;
  const results = [];

  for (const file of filesArr) {
    let response = null;
    let error = null;

    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        response = await docify(file.code, fileType);
        break; // exit the loop if successful
      } catch (err) {
        error = err;
        console.error(`Error adding ${fileType}Doc to file ${file.path}. Retrying...`, err);
        if (i < MAX_RETRIES - 1) await delay(350); // wait before retrying
      }
    }

    if (response) {
      results.push({
        ...file,
        tsCode: response,
      });
    } else {
      console.error(`Failed to add ${fileType}Doc to file ${file.path} after ${MAX_RETRIES} attempts.`, error);
      results.push({
        ...file,
        tsCode: 'error',
      });
    }

    await delay(350)
  }

  return results;
}
