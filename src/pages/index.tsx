import { Adventure } from ".prisma/client";
import { Button } from "@mantine/core";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data: sessionData } = useSession()
  const userId = sessionData?.user?.id ?? null
  const router = useRouter()

  const allAdventuresQuery = trpc.adventure.findMany.useQuery()
  const allAdventures = allAdventuresQuery.data ?? []
  const publishedAdventures = allAdventures.filter(a => a.isPublished)

  return (
    <div className="container">
      {userId &&
        <Button
          onClick={() => router.push("/editor")}
        >
          Go to the editor
        </Button>
      }

      <div>Public adventures:</div>
      <div>
        {allAdventuresQuery.isLoading && "Loading adventures..."}
      </div>
      <div>
        {
          publishedAdventures.map(pA => (
            <div key={`/adventure-${pA.id}`}>
              <Link href={`/adventure-${pA.id}`}>
                {pA.name === "" ? "Unnamed adventure" : pA.name}
              </Link>
            </div>
          ))
        }
      </div>

      {sessionData !== undefined &&
        <Button onClick={sessionData ? () => signOut() : () => signIn()}>
          {sessionData ? "Sign out" : "Sign in"}
        </Button>
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

export default Home;