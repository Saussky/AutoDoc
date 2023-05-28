import { GitHubResponse } from "@/context/codeSlice";
import { RootState } from "@/context/store";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Code } from "../../components/gui/code";
import router from "next/router";
import Header from '@/components/Header';
import Link from "next/link";

export default function Check() {
  const codeFiles = useSelector((state: RootState) => state.files);
  const [editable, setEditable] = useState<boolean[]>(
    codeFiles.map(() => false)
  );
  const [showOriginalCode, setShowOriginalCode] = useState<boolean[]>(
    codeFiles.map(() => false)
  );

  const toggleEditable = (index: number) => {
    const newEditable = [...editable];
    newEditable[index] = !newEditable[index]; // if it's false make it true and vice versa
    setEditable(newEditable);
  };

  const toggleOriginalCode = (index: number) => {
    const newOriginal = [...showOriginalCode];
    newOriginal[index] = !newOriginal[index];
    setShowOriginalCode(newOriginal);
  };

  const handleClick = () => {
    router.push('/gui/final');
  }


  return (
    <>
      <Header LinksChild={() => {
        return (
          <div className="flex items-center md:block mb-4">
            <Link
              className="rounded w-full mb-4 whitespace-no-wrap bg-indigo-600 btn btn-tall md:w-auto hover:bg-indigo-500 sm:mr-2"
              href="/gui"
            >
              Connect
            </Link>
            <Link
              className="rounded w-full mb-4 whitespace-no-wrap bg-gray-800 btn btn-tall md:w-auto hover:bg-gray-600 sm:ml-2"
              href="https://github.com/Saussky/AutoDoc"
            >
              Upload
            </Link>

          </div>
        )
      }} />

      <div className="container">
        {codeFiles.map((file: GitHubResponse, index: number) => (
          <Code
            key={index}
            file={file}
            index={index}
            editable={editable[index]}
            showOriginalCode={showOriginalCode[index]}
            toggleEditable={() => toggleEditable(index)}
            toggleOriginalCode={() => toggleOriginalCode(index)}
          />
        ))}

        <div className="flex items-center">
          <button
            onClick={handleClick}
            className="m-auto w-1/3 mt-8 px-6 py-2 bg-blue-500 text-white rounded border border-blue-500 cursor-pointer hover:bg-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Push to New Branch
          </button>
        </div>
      </div>
    </>
  );
}
