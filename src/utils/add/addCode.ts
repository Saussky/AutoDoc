import axios from 'axios'

/**
 * This function takes an array of file objects and downloads their content.
 * The function returns a Promise which resolves to an array containing updated file objects with the downloaded files as a 'code' property.
 * @param {Array} filesArr - An array of file objects.
 * @returns {Promise<Array>} A promise that resolves to an array of updated file objects.
 */
export default async function downloadFilesData(filesArr: Array<any>) {
    return await Promise.all(
        filesArr.map(async (file) => {
            const response = await axios.get(file.download_url);
            return {
                ...file,
                code: response.data
            }
        })
    )
}
