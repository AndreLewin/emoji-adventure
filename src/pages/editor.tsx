import { Button } from "@mantine/core";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";

const Editor: NextPage = () => {
  const [isClientSide, setIsClientSide] = useState<boolean>(false)
  const { data: sessionData } = useSession()
  const userId = sessionData?.user?.id ?? null
  const router = useRouter()

  const allAdventuresQuery = trpc.adventure.findMany.useQuery()
  const allAdventures = allAdventuresQuery.data ?? []
  const ownAdventures = allAdventures.filter(a => a.userId === userId)

  useEffect(() => {
    setIsClientSide(true)
  }, [])

  if (!isClientSide || sessionData === undefined) return <div />
  if (sessionData === null) {
    router.push("/")
    return <div />
  }

  return (
    <div className="container">
      {userId &&
        <Button
          onClick={() => router.push("/")}
        >
          Go to home
        </Button>
      }

      <Button>
        Create a new adventure
      </Button>

      <hr />
      Your adventures:
      {
        ownAdventures.map(pA => (
          <div>
            <Link href={`/adventure-${pA.id}`} key={`/${pA.id}`}>
              {pA.name === "" ? "Unnamed adventure" : pA.name}
            </Link>
          </div>
        ))
      }
      <style jsx>
        {`
          .container {

          }
        `}
      </style>
    </div>
  );
};

export default Editor;