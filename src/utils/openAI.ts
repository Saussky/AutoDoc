import axios, { AxiosResponse } from "axios";
import * as dotenv from 'dotenv';
dotenv.config()

interface Message {
    role: string;
    content: string;
}
interface RequestBody {
    model: string;
    messages: Message[];
}


function extractCodeBlock(content: string): string {
    const regex = /```[\s\S]*?```/g;
    const matches = content.match(regex);

    if (matches) {
        const codeBlocks = matches.map(match => match.slice(3, -3)).join('\n');
        return codeBlocks.trim();
    } else {
        console.log(content);
        throw new Error('codeblock issue');
    }
}


export default async function docify(code: string, fileType: 'TS' | 'JS'): Promise<string> {
    try {
        const endpoint: string = 'https://api.openai.com/v1/chat/completions'

        const requestBody: RequestBody = {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system", content:  `
                    Follow these step-by-step instructions.

                    1. Begin your response with three backticks to generate a code block.
                    2. Add all of the imports from the original code at the top of the code block.
                    3. Add the rest of the original code to the code block. Including type and interface definitions.

                    4. Identify all of the places where functions are created.
                    5. To all those functions you identified in step 4, find the line directly above them and add ${fileType}Doc comments.
                    6. End your response with three backticks to close the code block.        
                    ` },
                { role: "user", content: '```\n' + code + '\n```' }
            ],
        };

        const response: AxiosResponse = await axios.post(endpoint, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        })

        let tsDocCode: string = extractCodeBlock(response.data.choices[0].message.content)
        const firstLine: string = tsDocCode.trim().split('\n')[0];

        if (firstLine.startsWith('typescript') || firstLine.startsWith('ts')) {
            const restOfCode = tsDocCode.substring(tsDocCode.indexOf('\n') + 1).trimStart();
            tsDocCode = restOfCode.trim();
        }
        return tsDocCode;
    } catch (error) {
        console.log('here')
        console.log(error)
        throw new Error(`Error adding TSDoc: ${error}`);
    }
}
