import { Button, Modal } from "@mantine/core"
import { useState } from "react"

const Tips: React.FC<{}> = ({ }) => {

  const [isModalOpened, setIsModalOpened] = useState<boolean>(false)

  return (
    <>
      <span className='container'>
        <Button onClick={() => setIsModalOpened(true)} color="gray">Tips</Button>
        <Modal
          opened={isModalOpened}
          onClose={() => { setIsModalOpened(false) }}
          size="xl"
          styles={{ header: { position: "absolute", top: 0, right: 0, margin: "5px" } }}
        >
          <div>In the grid, you can CTRL+LEFTCLICK-DRAG to duplicate a cell.</div>
          <div>In the grid, you can CTRL+RIGHTCLICK to place a message script.</div>
          <div>In the grid, you can ALT+RIGHTCLICK to place a move script.</div>
          <div>In the grid, you can ALT+LEFTCLICK to execute the script of the cell.</div>
          <div>In the drawer, you can use TAB and ENTER to quickly select a preset.</div>
          <div>In the preset modals, when the textarea is active, you can press CTRL+ENTER to confirm.</div>
          <div>In the drawer, when the code textarea is active, you can press CTRL+ENTER to save the script and close the drawer.</div>
        </Modal>
      </span>
      <style jsx>
        {`
          .container {
            
          }
        `}
      </style>
    </>
  )
}

export default Tips