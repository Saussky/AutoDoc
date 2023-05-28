import Link from "next/link"


type Props = {
  LinksChild: React.FC
}

const Header: React.FC<Props> = ({ LinksChild }) => {
  return (
    <div className="flex items-center justify-between py-6">
      <Link
        className="text-2xl font-extrabold leading-tight text-center text-white xl:text-4xl"
        href="/"
      >
        AutoDoc
      </Link>

      <Link href="#">
        <svg
          className="w-6 h-6 fill-current md:hidden"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
        </svg>
      </Link>
      <LinksChild />
    </div>
  )
}

export default Header