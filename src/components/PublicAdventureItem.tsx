import { Adventure } from ".prisma/client"
import Link from "next/link"
type AdventurePartial = Omit<Adventure, "data">

const PublicAdventureItem: React.FC<{ adventure: AdventurePartial }> = ({ adventure }) => {

  return (
    <>
      <div className='container'>
        <Link href={location?.hostname === "localhost" ? `/${adventure.id}` : `https://emoji-adventure.vercel.app/${adventure.id}`}>
          <span className='link'>
            {adventure.name === "" ? "Unnamed adventure" : adventure.name}
          </span>
        </Link>
      </div>
      <style jsx>
        {`
          .container {
            
          }

          .link {
            color: darkblue
          }
        `}
      </style>
    </>
  )
}

export default PublicAdventureItem