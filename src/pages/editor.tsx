import { Button } from "@mantine/core";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import EditorAdventureItem from "../components/EditorAdventureItem";
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

  const createAdventureMutation = trpc.adventure.create.useMutation({
    async onSuccess(data) {
      if (data === -1) return
      router.push(`/editor/${data.id}`)
    }
  })

  if (!isClientSide || sessionData === undefined) return <div />
  if (sessionData === null) {
    router.push("/")
    return <div />
  }

  return (
    <div className="container">
      {userId &&
        <Button onClick={() => router.push("/")}>
          Go to home
        </Button>
      }

      <Button onClick={() => createAdventureMutation.mutate()}>
        Create a new adventure
      </Button>

      <hr />
      Your adventures:
      {ownAdventures.map(pA => <EditorAdventureItem adventure={pA} key={`/adventure-${pA.id}`} />)}
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