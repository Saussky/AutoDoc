import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { InputField } from '@/components/gui/InputField';
import { updateBranch, updateCodeFiles, updateGitToken } from '../../context/store';
import Header from '@/components/Header';
import Link from 'next/link';
import { useAccessToken } from '@/hooks/useAccessToken';


async function makeApiCall(requestBody: any, fileInput: any) {
  let url = "/api/tsFiles";
  if (fileInput) {
    requestBody.filePath = fileInput;
    url = "/api/singleTsFile";
  }
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  return response;
}

export default function GUI() {
  const [loading, setLoading] = useState(false);
  const [isPrivateRepo, setIsPrivateRepo] = useState(false);
  const [ownerInput, setOwnerInput] = useState("");
  const [repoInput, setRepoInput] = useState("");
  const [fileInput, setFileInput] = useState("");
  const [result, setResult] = useState<number>();
  const [fileType, setFileType] = useState<'TS' | 'JS'>('TS');

  const dispatch = useDispatch();
  const router = useRouter();
  const accessToken = useAccessToken();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const requestBody = {
      ownerInput,
      repoInput,
      fileType,
      ...(accessToken && isPrivateRepo && { accessToken }),
    };

    try {
      const response = await makeApiCall(requestBody, fileInput);
      const data = await response.json();

      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      dispatch(updateCodeFiles(data.codeFiles));
      dispatch(updateBranch(data.branch));
      dispatch(updateGitToken(data.token));

      setResult(response.status);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      router.push("/gui/check");
    }
  }

  return (
    <>
      <Header LinksChild={() => {
        return (
          <div className="flex items-center md:block">
            <Link
              className="rounded w-full mb-4 whitespace-no-wrap bg-indigo-600 btn btn-tall md:w-auto hover:bg-indigo-500 sm:mr-2"
              href="/gui"
            >
              Connect
            </Link>
            <Link
              className="rounded w-full mb-4 whitespace-no-wrap bg-gray-800 btn btn-tall md:w-auto hover:bg-gray-600 sm:ml-2"
              href="https://github.com/TheMetakey/AutoDoc"
            >
              Upload
            </Link>

          </div>
        )
      }} />

      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl mb-8 font-bold">Enter Github Repository Details</h1>

        <form onSubmit={onSubmit} className="w-full max-w-md">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col items-center">
              <label htmlFor="privateRepo" className="mb-3 text-lg font-semibold">
                <input
                  type="checkbox"
                  name="privateRepo"
                  id="privateRepo"
                  checked={isPrivateRepo}
                  onChange={(e) => setIsPrivateRepo(e.target.checked)}
                />
                <span className="ml-2">Private Repository</span>
              </label>
            </div>

            <InputField
              label="Owner"
              placeholder="TheMetakey"
              value={ownerInput}
              onChange={(e) => setOwnerInput(e.target.value)}
            />

            <InputField
              label="Repository Name"
              placeholder="metakey-db"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
            />

            <InputField
              label="Path"
              placeholder="src/index.ts"
              value={fileInput}
              onChange={(e) => setFileInput(e.target.value)}
            />

            <div className="flex flex-col items-center">
              <label htmlFor="fileType" className="block mb-5 text-lg font-semibold"><p>File Type</p></label>
              <div className="flex items-center">
                <span className='font-medium'>TSDoc</span>
                <div className="relative inline-block w-10 align-middle select-none transition-duration-200 ease-in mx-2">
                  <input
                    type="checkbox"
                    name="toggle"
                    id="toggle"
                    checked={fileType === 'JS'}
                    onChange={() => setFileType((prev) => prev === 'TS' ? 'JS' : 'TS')}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
                <span className='font-medium'>JSDoc</span>
              </div>
            </div>
          </div>


          <div className="flex justify-center">
            <input
              className="w-1/3 mt-8 px-6 py-2 bg-blue-500 text-white rounded border border-blue-500 cursor-pointer hover:bg-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="submit"
              value="Docify"
            />
          </div>

        </form >


        <div className="mt-4">{result}</div>
        {
          loading && (
            <div className="my-6">
              <p className="text-white text-lg font-semibold">Loading...</p>
            </div>
          )
        }

        <div className="my-10">
          <Link href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=repo%20workflow`}>
            Private repository? Login to Github
          </Link>
        </div>

        <div>
          <Link href="/gui/manual">
            <p className="text-blue-500 hover:text-blue-700 cursor-pointer">
              Prefer to paste text? Click here
            </p>
          </Link>
        </div>
      </div >
    </>
  );
}



