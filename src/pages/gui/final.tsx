import { useSelector } from "react-redux";
import { RootState } from "@/context/store";
import { useEffect, useState } from "react";
import Link from "next/link";


export default function Final() {
  const [responseStatus, setResponseStatus] = useState<number>(0);
  const { files, branch, gitToken } = useSelector((state: RootState) => state);

  const githubPush = async () => {
    try {
      const response = await fetch("/api/pushToGithub", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ files: files, branch: branch, token: gitToken }),
      });
      setResponseStatus(response.status)
    } catch (error) {
      console.log(error)
      setResponseStatus(500)
    }
  }

  useEffect(() => {
    githubPush()
  }, [])

  const handleRetry = () => {
    githubPush();
  };

  let message;
  if (responseStatus === 200) {
    message = (
      <>
        <h1>Success! Your files have been pushed to Github</h1>
        <Link href="/">Back to home</Link>
      </>
    );
  } else if (responseStatus === 0) {
    message = <h1>Loading...</h1>;
  } else {
    message = (
      <>
        <h1>Something went wrong. Please try again.</h1>
        <button onClick={githubPush}>Retry</button>
      </>
    );
  }

  return (
    <div className="container">

      <div className="">
        {message}
      </div>
    </div>
  )
}
