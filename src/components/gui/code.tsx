import { useEffect, useRef, useState } from "react";
import { GitHubResponse } from "@/context/codeSlice";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { useDispatch } from "react-redux";
import { updateTsCode } from "../../context/store";


interface CodeFileProps {
  file: GitHubResponse;
  index: number;
  editable: boolean;
  showOriginalCode: boolean;
  toggleEditable: () => void;
  toggleOriginalCode: () => void;
}

function highlightKeywords(text: string): JSX.Element[] {
  const keywords = ['param', 'returns', 'async', 'function', 'interface', 'throws'];
  const regex = new RegExp(`@(?:${keywords.join('|')})\\b`, 'g');
  const parts = text.split(regex);

  const elements: JSX.Element[] = [];
  let lastIndex = 0;

  text.replace(regex, (match, index) => {
    elements.push(<>{parts.shift()}</>);
    elements.push(<span style={{ color: 'lightgreen' }}>{match}</span>);
    lastIndex = index + match.length;
    return match;
  });

  if (parts.length) {
    elements.push(<>{parts.shift()}</>);
  }

  return elements;
}

function extractTSDocComments(str: string): string[] | null {
  if (!str) return null; // Add this line to check for null or undefined strings

  const regex = /\/\*\*([\s\S]*?)\*\//g;
  const matches = Array.from(str.matchAll(regex), match => match[1].trim());
  if (matches.length > 0) {
    return matches;
  }
  return null;
}

function extractFunctionNames(str: string): string[] | null {
  const regex = /(?<=\*\/)\s*(.*)/g;
  const matches = Array.from(str.matchAll(regex), match => match[1].trim())

  if (matches.length > 0) {
    return matches.map(match => match
      .replace(/async\s+/, '')
      .replace(/const\s+/, '')
      .replace(/let\s+/, '')
      .replace(/function\s+/, '')
      .replace(/default\s+/, '')
      .replace(/export\s+/, '')
      .replace(/class\s+/, '')
      .replace(/(?<=\)\s*):(.*)/, '')
      .replace(';', ''));

  }
  return null;
}

export const Code: React.FC<CodeFileProps> = ({
  file,
  index,
  editable,
  showOriginalCode,
  toggleEditable,
  toggleOriginalCode,
}) => {
  const [originalTsCode, setOriginalTsCode] = useState(file.tsCode); // Store the original value in a ref
  const [isLoading, setIsLoading] = useState(false);

  const [isContentVisible, setContentVisible] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useDispatch();

  const handleCodeEdit = (tsCode: string) => {
    dispatch(updateTsCode({ index, tsCode }))
    setOriginalTsCode(tsCode)
  };

  const handleCancel = () => {
    dispatch(updateTsCode({ index, tsCode: originalTsCode })); // Use the original value from the ref
    toggleEditable();
  };

  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
  };

  const retry = async () => {
    setIsLoading(true)
    try {
      console.log(`refreshing for index: ${index}`)
      const response = await fetch("/api/retry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: file.code }),
      })
      const data = await response.json();
      console.log('updated')
      dispatch(updateTsCode({ index, tsCode: data }));
      setOriginalTsCode(data)
    } catch (error) {
      console.log('oh no')
      console.log(error)
    }
    setIsLoading(false)
  }

  // every time the tsCode gets updated (in the retry function), reload the component to update the text on screen
  useEffect(() => {

  }, [file.tsCode])

  useEffect(() => {
    if (editable && textareaRef.current) {
      adjustHeight(textareaRef.current);
    }
  }, [editable]);

  return (
    <div>
      <div className="my-8 flex items-center">
        <h2 className="text-xl font-bold">{file.path}</h2>
        <button
          onClick={() => setContentVisible(!isContentVisible)}
          className="mx-2 text-xl font-bold "
        >
          {isContentVisible ? "-" : "+"}
        </button>
      </div>

      {isContentVisible && (
        <>
          <div key={file.tsCode!}>
            {extractTSDocComments(file.tsCode!)?.map((comment: string, index: number) => (

              <div key={index} style={{ whiteSpace: 'pre-line', marginBottom: '1.5vh' }}>
                <b>
                  {extractFunctionNames(file.tsCode!)?.[index].replaceAll('{', '').replaceAll('=', '') + '\n'}
                </b>
                {highlightKeywords(comment.replaceAll(/[\*\{]/g, ''))}
              </div>
            ))}
          </div>

          <div className="mb-4">
            {editable && (
              <button
                onClick={handleCancel}
                className="w-1/6 mt-2 mr-4 px-1 py-1 text-white rounded border cursor-pointer hover:bg-red-600 hover:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Cancel
              </button>
            )}

            <button onClick={toggleEditable} className="w-1/6 mt-2 mr-4 px-1 py-1 text-white rounded border cursor-pointer hover:bg-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
              {editable ? "Save Changes" : "Edit Code"}
            </button>

            <button onClick={toggleOriginalCode} className="w-1/6 mt-2 mr-4 px-1 py-1 text-white rounded border cursor-pointer hover:bg-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
              {showOriginalCode ? "AI Code" : "Original Code"}
            </button>

            <button onClick={retry} className="w-1/6 mt-2 mr-4 px-1 py-1 text-white rounded border cursor-pointer hover:bg-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
              Retry
            </button>
          </div>

          {editable ? (
            <textarea
              ref={textareaRef}
              value={file.tsCode!}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
              // style={{ width: "90vw" }}
              onChange={(e) => handleCodeEdit(e.target.value)}
              className="w-11/12 p-5 bg-snow brightness-75 rounded-lg shadow-lg text-black"
            />
          ) : isLoading ? (
            <div className="my-4 text-center text-xl font-bold">Loading...</div>
          ) : (
            <SyntaxHighlighter
              key={index}
              language={"javascript"}
              style={vs2015}
              showLineNumbers={true}
              lineNumberContainerStyle={{ paddingRight: "1em", width: "3em" }}
              customStyle={{ borderRadius: "6px" }}
            >
              {showOriginalCode ? file.code : file.tsCode!}
            </SyntaxHighlighter>
          )}


        </>
      )}
    </div>
  );
};
