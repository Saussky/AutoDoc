import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { updateBranch, updateCodeFiles, updateGitToken } from '../../context/store';
import Header from '@/components/Header';
import Link from 'next/link';
import { useAccessToken } from '@/hooks/useAccessToken';



export default function GUI() {
  const [isPrivateRepo, setIsPrivateRepo] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // Add loading state
  const [ownerInput, setOwnerInput] = useState<string>("");
  const [repoInput, setRepoInput] = useState<string>("");
  const [fileInput, setFileInput] = useState<string>("");
  const [result, setResult] = useState<number>();
  const [fileType, setFileType] = useState<'TS' | 'JS'>('TS');

  const dispatch = useDispatch();
  const router = useRouter();
  const accessToken = useAccessToken();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const requestBody = {
      ownerInput,
      repoInput,
      fileType,
      ...(accessToken && isPrivateRepo && { accessToken }),
    };

    try {
      let data
      let response

      console.log('rrr', requestBody)


      if (!fileInput) {
        // API call for entire repositories
        response = await fetch("/api/tsFiles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
      } else {
        // API call for single files
        response = await fetch("/api/singleTsFile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...requestBody, filePath: fileInput }),
        });
      }

      data = await response.json();

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

            <div className="flex flex-col items-center">
              <label htmlFor="owner" className="block mb-3 text-lg font-semibold"><p>Owner</p></label>
              <input
                type="text"
                name="owner"
                placeholder="TheMetakey"
                value={ownerInput}
                onChange={(e) => setOwnerInput(e.target.value)}
                className="w-3/5 mt-2 px-3 py-2 border rounded text-center"
              />
            </div>

            <div className="flex flex-col items-center">
              <label htmlFor="repository" className="block mb-3 text-lg font-semibold"><p>Repository Name</p></label>
              <input
                type="text"
                name="repository"
                placeholder="metakey-db"
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                className="w-3/5 mt-2 px-3 py-2 border rounded text-center"
              />
            </div>

            <div className="flex flex-col items-center">
              <label htmlFor="repository" className="block mb-3 text-lg font-semibold"><p>Path <small>(optional)</small></p></label>
              <input
                type="text"
                name="filePath"
                placeholder="src/index.ts"
                value={fileInput}
                onChange={(e) => setFileInput(e.target.value)}
                className="w-3/5 mt-2 px-3 py-2 border rounded text-center"
              />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <label htmlFor="fileType" className="block mb-3 text-lg font-semibold"><p>File Type</p></label>
            <div className="relative inline-block w-10 align-middle select-none transition-duration-200 ease-in">
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
            <div className="flex items-center ml-3">
              <span className='font-bold'>TSDoc</span>
              <span className="mx-2">/</span>
              <span className='font-bold'>JSDoc</span>
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



