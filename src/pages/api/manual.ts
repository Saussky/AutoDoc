import type { NextApiRequest, NextApiResponse } from 'next'
import tsDocify from '@/utils/openAI';


export default async function handler(
    req: NextApiRequest,
    res: any
) {
    const code = req.body.code
    const fileType = req.body.fileType

    try {
        const response = await tsDocify(code, fileType);
        res.status(200).json({ codeFiles: response })
    } catch (err) {
        console.error(`Error adding TSDoc to file.`, err);
        res.status(400).json({ error: `Error adding TSDoc to file.` })
    }

}
