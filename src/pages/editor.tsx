import { Button, Checkbox, Modal, TextInput } from "@mantine/core";
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

  const [isAdventureCreationModalOpen, setIsAdventureCreationModalOpen] = useState<boolean>(false)

  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [areTitlesHiddenByDefault, setAreTitlesHiddenByDefault] = useState<boolean>(false)
  const [areClickSquaresHiddenByDefault, setAreClickSquaresHiddenByDefault] = useState<boolean>(false)

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

      <Button color="teal" onClick={() => setIsAdventureCreationModalOpen(true)}>
        New Adventure
      </Button>

      {isAdventureCreationModalOpen && (
        <Modal
          opened={isAdventureCreationModalOpen}
          onClose={() => setIsAdventureCreationModalOpen(false)}
          styles={{ header: { position: "absolute", top: 0, right: 0, margin: "5px" } }}
        >
          <TextInput
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
          />
          <TextInput
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description"
          />
          <Checkbox
            label="Hide grid titles when playing by default"
            checked={areTitlesHiddenByDefault}
            onChange={() => setAreTitlesHiddenByDefault(v => !v)}
          />
          <Checkbox
            label="Hide borders around cells with click script by default"
            checked={areClickSquaresHiddenByDefault}
            onChange={() => setAreClickSquaresHiddenByDefault(v => !v)}
          />
          <Button onClick={() => createAdventureMutation.mutate({
            name,
            description
          })}>
            Create Adventure
          </Button>
        </Modal>
      )}

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