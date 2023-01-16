import { Button, Modal, TextInput } from "@mantine/core";
import { useState } from "react";
import store from "../store";

const AdventureInfo: React.FC<{}> = ({ }) => {
  const adventure = store(state => state.adventure)
  const set = store(state => state.set)

  const [isAdventureModalOpened, setIsAdventureModalOpened] = useState<boolean>(false)

  return (
    <>
      <div className='container'>
        <Button onClick={() => setIsAdventureModalOpened(true)}>
          Edit adventure info
        </Button>
      </div>

      <Modal
        title={"TODO: probably better to place those settings in /editor/"}
        opened={isAdventureModalOpened}
        onClose={() => setIsAdventureModalOpened(false)}
      >
        <TextInput
          value={adventure?.name ?? ""}
          onChange={(event) => set({ adventure: { ...adventure!, name: event.target.value } })}
          placeholder="Adventure name"
        />
        <TextInput
          value={adventure?.description ?? ""}
          onChange={(event) => set({ adventure: { ...adventure!, description: event.target.value } })}
          placeholder="Adventure description"
        />
        isAccessible
        isPublished
      </Modal>

      <style jsx>
        {`
          .container {
            
          }
        `}
      </style>
    </>
  )
}

export default AdventureInfo
