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
          fullScreen
          styles={{ header: { position: "absolute", top: 0, right: 0, margin: "5px" } }}
        >
          <div>In the grid, you can CTRL+LEFTCLICK-DRAG to duplicate a cell.</div>
          <div>In the grid, you can CTRL+RIGHTCLICK to place a message script.</div>
          <div>In the grid, you can ALT+RIGHTCLICK to place a move script.</div>
          <div>In the grid, you can ALT+LEFTCLICK to execute the script of the cell.</div>
          <div>In the drawer, you can use TAB and ENTER to quickly select a preset.</div>
          <div>In the preset modals, when the textarea is active, you can press CTRL+ENTER to confirm.</div>
          <div>In the drawer, when the code textarea is active, you can press CTRL+ENTER to save the script and close the drawer.</div>
          <div> </div>
          <div>{`Order of execution of scripts (lifecycle): Adventure On Init > Grids On Init > Cells On Init > Grid on View > Cells on View`}</div>
          <div> </div>
          <div>{`You have access to "window" inside the scripts. So basically you can do anything a website can do. With the exception of Shorthands, everything is pure real Javascript in the browser context.`}</div>
          <div> </div>
          <div>{`Map variables are variables visible under the grid. You can subscribe to a map variable with a callback that will be executed when the value of the variable changes. If you don't need this kind of reactivity, prefer global variables.`}</div>
          <div> </div>
          <div>{`You can prevent a map variable from being visible by starting its name with _`}</div>
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