import { Button, Modal } from "@mantine/core"
import { useState } from "react"

const UploadTips: React.FC<{}> = ({ }) => {

  const [isModalOpened, setIsModalOpened] = useState<boolean>(false)

  const text = `
How to upload your game to itch.io

- Export your adventure (click the button at the bottom of the editor)

- Create an account on itch.io if you don't already have one

- Go to https://itch.io/game/new

- Choose a title for your game

- For "Kind of project", choose "HTML"

- Upload the .zip you exported 

- Activate the checkbox "This file will be played in the browser"

- For the "Viewport dimensions", choose 400px for the width. For the height, choose 400px or more depending on how much vertical space your adventure uses (titles, inventory etc).

- Activate the checkbox "Automatically start on page load"

- Save and View Page  
  `

  return (
    <>
      <span className='container'>
        <Button onClick={() => setIsModalOpened(true)} color="gray">Upload to itch.io</Button>
        <Modal
          opened={isModalOpened}
          onClose={() => { setIsModalOpened(false) }}
          fullScreen
          styles={{ header: { position: "absolute", top: 0, right: 0, margin: "5px" } }}
        >
          <div>
            How to upload your game to itch.io
          </div>
          <div></div>
          <div>- Export your adventure (click the button at the bottom of the editor)</div>
          <div></div>
          <div>- Create an account on itch.io if you don't already have one</div>
          <div></div>
          <div>- Go to https://itch.io/game/new</div>
          <div></div>
          <div> - Choose a title for your game</div>
          <div></div>
          <div>- For "Kind of project", choose "HTML"</div>
          <div></div>
          <div>- Upload the .zip you exported</div>
          <div></div>
          <div>- Activate the checkbox "This file will be played in the browser"</div>
          <div></div>
          <div>- For the "Viewport dimensions", choose 400px for the width. For the height, choose 400px or more depending on how much vertical space your adventure uses (titles, inventory etc).</div>
          <div></div>
          <div>- Activate the checkbox "Automatically start on page load"</div>
          <div></div>
          <div>- Save and View Page</div>
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

export default UploadTips