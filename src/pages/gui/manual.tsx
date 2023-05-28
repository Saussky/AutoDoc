import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { updateBranch, updateCodeFiles, updateGitToken, updateTsCode } from '../../context/store';
import Header from '@/components/Header';
import Link from 'next/link';

export default function Manual() {
    const [loading, setLoading] = useState<boolean>(false);
    const [textAreaInput, setTextAreaInput] = useState<string>('');
    const [result, setResult] = useState<number>();
    const dispatch = useDispatch();
    const router = useRouter();

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/manual', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: textAreaInput }),
            });

            const data = await response.json();
            if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }

            dispatch(updateCodeFiles([{code: textAreaInput, tsCode: data.codeFiles}]))
            setResult(response.status);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            router.push('/gui/check');
        }
    }

    return (
        <>
            <Header LinksChild={() => {
                return (
                    <div className="flex items-center md:block">
                        <a
                            className="rounded w-full mb-4 whitespace-no-wrap bg-indigo-600 btn btn-tall md:w-auto hover:bg-indigo-500 sm:mr-2"
                            href="/gui"
                        >
                            Connect
                        </a>
                        <a
                            className="rounded w-full mb-4 whitespace-no-wrap bg-gray-800 btn btn-tall md:w-auto hover:bg-gray-600 sm:ml-2"
                            href="https://github.com/TheMetakey/AutoDoc"
                        >
                            Upload
                        </a>
                    </div>
                );
            }} />

            <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl mb-8 font-bold">Paste Your TypeScript Code</h1>

                <form onSubmit={onSubmit} className="w-full max-w-md">
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col items-center">
                            <textarea
                                className="min-w-[60vw] min-h-[60vh] mt-2 px-3 py-2 border rounded"
                                placeholder="Paste your TypeScript code here..."
                                value={textAreaInput}
                                onChange={(e) => setTextAreaInput(e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <input
                            className="w-1/3 mt-8 px-6 py-2 bg-blue-500 text-white rounded border border-blue-500 cursor-pointer hover:bg-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="submit"
                            value="TS-Docify"
                        />
                    </div>
                </form>

                <div className="mt-4">{result}</div>

                {loading && (
                    <div className="my-6">
                        <p className="text-white text-lg font-semibold">Loading...</p>
                    </div>
                )}

                <div className="flex justify-center my-10">
                    <Link href="/gui">
                        <p className="text-blue-500 hover:text-blue-700 cursor-pointer">
                            Get code directly from Github? Click here
                        </p>
                    </Link>
                </div>
            </div>
        </>
    );
}
