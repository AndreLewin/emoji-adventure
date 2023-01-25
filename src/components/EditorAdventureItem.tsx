import { Adventure } from ".prisma/client"
import { Button, Checkbox, Modal, TextInput } from "@mantine/core"
import Link from "next/link"
import { useCallback, useMemo, useState } from "react"
import { IconSettings, IconTrash } from '@tabler/icons'
import { trpc } from "../utils/trpc"

type AdventurePartial = Omit<Adventure, "data">
const EditorAdventureItem: React.FC<{ adventure: AdventurePartial }> = ({ adventure }) => {

  const [isAdventureModalOpened, setIsAdventureModalOpened] = useState<boolean>(false)
  const [isDeleteConfirmModalOpened, setIsDeleteConfirmModalOpened] = useState<boolean>(false)

  const [savedAdventure, setSavedAdventure] = useState<AdventurePartial>(adventure)
  const [localAdventure, setLocalAdventure] = useState<AdventurePartial>(adventure)

  const isLocalAdventureChanged = useMemo<boolean>(() => {
    return JSON.stringify(savedAdventure) !== JSON.stringify(localAdventure)
  }, [savedAdventure, localAdventure])

  // we need "utils" to respect the rule of hooks
  // because we might want data inside other hooks (useX)
  const utils = trpc.useContext()

  const updateMutation = trpc.adventure.update.useMutation({
    async onSuccess() {
      setSavedAdventure(localAdventure)
      utils.adventure.findMany.invalidate()
      utils.adventure.find.invalidate({ id: adventure.id })
      setIsAdventureModalOpened(false)
    }
  })

  const handleSaveAdventure = useCallback<any>(() => {
    const { name, description, isAccessible, isPublished } = localAdventure
    updateMutation.mutate({
      id: adventure.id ?? "404",
      data: {
        name,
        description,
        isAccessible,
        isPublished
      }
    })
  }, [savedAdventure, localAdventure])

  const updateDeleteMutation = trpc.adventure.delete.useMutation({
    async onSuccess() {
      setIsDeleteConfirmModalOpened(false)
      utils.adventure.findMany.invalidate()
      utils.adventure.find.invalidate({ id: adventure.id })
    }
  })

  const handleDeleteAdventure = useCallback<any>(() => {
    updateDeleteMutation.mutate({
      id: adventure.id ?? "404"
    })
  }, [savedAdventure, localAdventure])

  return (
    <>
      <div className='container'>
        <Link href={`${location?.hostname === "localhost" ? "" : "https://emoji-adventure-retejo.vercel.app"} /editor/${adventure.id}`}>
          <span className='link'>
            {adventure.name === "" ? "Unnamed adventure" : adventure.name}
          </span>
        </Link>
        <Button radius="xl" compact leftIcon={<IconSettings />} onClick={() => setIsAdventureModalOpened(true)}>
          Settings
        </Button>
        <Button
          color="red" radius="xl" compact leftIcon={<IconTrash />}
          onClick={() => setIsDeleteConfirmModalOpened(true)}
        >
          Delete
        </Button>
        {isAdventureModalOpened && (
          <Modal
            opened={isAdventureModalOpened}
            onClose={() => setIsAdventureModalOpened(false)}
            styles={{ header: { position: "absolute", top: 0, right: 0, margin: "5px" } }}
          >
            <TextInput
              value={localAdventure.name}
              onChange={(event) => setLocalAdventure({ ...localAdventure, name: event.target.value })}
              placeholder="Adventure name"
            />
            <TextInput
              value={localAdventure.description}
              onChange={(event) => setLocalAdventure({ ...localAdventure, description: event.target.value })}
              placeholder="Adventure description"
            />
            <Checkbox
              label="Is accessible to everyone via link"
              checked={localAdventure.isAccessible}
              onChange={(event) => setLocalAdventure({ ...localAdventure, isAccessible: event.currentTarget.checked })}
            />
            <Checkbox
              label="Is published on home page"
              checked={localAdventure.isPublished}
              onChange={(event) => setLocalAdventure({ ...localAdventure, isPublished: event.currentTarget.checked })}
            />
            <Button disabled={!isLocalAdventureChanged} onClick={handleSaveAdventure}>
              Save
            </Button>
          </Modal>
        )}
        {isDeleteConfirmModalOpened && (
          <Modal
            opened={isDeleteConfirmModalOpened}
            onClose={() => setIsDeleteConfirmModalOpened(false)}
            title={`Are you sure to delete this adventure (${adventure.name})?`}
          >
            <Button
              color="red"
              onClick={handleDeleteAdventure}
            >
              Delete Grid
            </Button>
          </Modal>
        )}
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

export default EditorAdventureItem