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
          <div>In the preset modals, when the textarea is active, you can press CTRL+ENTER to confirm.</div>
          <div>In the drawer, when the code textarea is active, you can press CTRL+ENTER to save the script and close the drawer.</div>
          <div> </div>
          <div>{`Order of execution of scripts (lifecycle) when starting an adventure: Adventure On Init > Grids On Init > Cells On Init > Grid On View > Cells On View`}</div>
          <div> </div>
          <div>{`Order of execution of scripts when moving to an other grid (_g): Cells On Leave > Grid On Leave > Grid On View > Cells On View`}</div>
          <div> </div>
          <div>{`You have access to "window" inside the scripts. So basically you can do anything a website can do. With the exception of Shorthands, everything is pure real Javascript in the browser context.`}</div>
          <div> </div>
          <div>{`If you need to use a prompt or confirm window just after the visual load of a grid, you can wrap your code in    setTimeout(() => { YOUR_CODE_HERE }, 10)     in the On View script.`}</div>
          <div> </div>
          <div>{`You can await x milliseconds before the execution of the next line of code by using "await _sleep(x)" where x is the number of milliseconds.`}</div>
          <div> </div>
          <div>{`You can generate a random number between min and max (included) using this function: "await _random(min, max)".`}</div>
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