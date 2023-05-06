import { Adventure } from ".prisma/client";
import { Button } from "@mantine/core";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import PublicAdventureItem from "../components/PublicAdventureItem";
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

      <div>Emoji Adventure is in alpha test. Your adventures may break at any moment, so export them regularly if you care about them.</div>

      {
        /*
        <div>
          {allAdventuresQuery.isLoading && "Loading adventures..."}
        </div>
        <div>
          {publishedAdventures.map(pA => <PublicAdventureItem adventure={pA} key={`/pb-adventure-${pA.id}`} />)}
        </div>
        */
      }

      {/* Users are not able to connect to emoji-adventure-retejo.vercel.app in order to not share cookies */}
      {location?.host !== "emoji-adventure-retejo.vercel.app" && sessionData !== undefined &&
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