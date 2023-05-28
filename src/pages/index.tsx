import Header from '@/components/Header'
import Link from 'next/link'


export const Home: React.FC = () => {
  return (
    <>
      <Header LinksChild={() => {
        return (
          <div className="flex items-center md:block">
            <Link className="mr-8 font-semibold hover:text-white" href="/documentation"
            >Documentation</Link>

          </div>
        )
      }} />
      <h1
        className="px-8 mt-16 mb-4 text-5xl font-extrabold leading-tight text-center text-white xl:text-6xl"
      >
        Document less <span className="text-indigo-700">Code more</span>
      </h1>
      <div
        className="flex flex-col justify-center max-w-xs mx-auto mb-4 sm:max-w-full sm:flex-row"
      >
        <Link
          className="rounded w-full mb-4 whitespace-no-wrap bg-indigo-600 btn btn-tall md:w-auto hover:bg-indigo-500 sm:mr-2"
          href="/gui"
        >
          Get started
        </Link>
        <Link
          className="rounded w-full mb-4 whitespace-no-wrap bg-gray-800 btn btn-tall md:w-auto hover:bg-gray-600 sm:ml-2"
          href="https://github.com/TheMetakey/AutoDoc"
        >
          View on Github
        </Link>
      </div>
      <p className="max-w-xl mx-auto mb-20 text-xl text-center xl:max-w-2xl">
        AutoDoc generates codebase documention for git repositories using Large Language Models, like GPT-4, LLaMA or Alpaca
      </p>

      <div>
        <ul
          className="flex flex-col flex-wrap justify-center mb-20 text-center sm:flex-row"
        >
          <li className="w-full px-6 mb-8 sm:mb-16 md:w-1/2 lg:w-1/3">
            <span
              className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-3xl text-white bg-indigo-700 rounded-full"
            >
              <img src="/img/feature-tile-icon-01.svg" alt="" />
            </span>
            <h3 className="mb-2 text-2xl font-bold text-white">Github Workflow</h3>
            <p className="max-w-xs mx-auto text-lg text-gray-500">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat.
            </p>
          </li>
          <li className="w-full px-6 mb-8 sm:mb-16 md:w-1/2 lg:w-1/3">
            <span
              className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-3xl text-white bg-indigo-700 rounded-full"
            >
              <img src="/img/feature-tile-icon-02.svg" alt="" />
            </span>
            <h3 className="mb-2 text-2xl font-bold text-white">Command-line interface</h3>
            <p className="max-w-xs mx-auto text-lg text-gray-500">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat.
            </p>
          </li>
          <li className="w-full px-6 mb-8 sm:mb-16 md:w-1/2 lg:w-1/3">
            <span
              className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-3xl text-white bg-indigo-700 rounded-full"
            >
              <img src="/img/feature-tile-icon-03.svg" alt="" />
            </span>
            <h3 className="mb-2 text-2xl font-bold text-white">Graphical User Interface</h3>
            <p className="max-w-xs mx-auto text-lg text-gray-500">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat.
            </p>
          </li>
        </ul>
      </div>
    </>
  )
}


export default Home