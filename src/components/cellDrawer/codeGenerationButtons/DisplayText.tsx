import { Button, Modal, Textarea } from "@mantine/core"
import { Dispatch, SetStateAction, useCallback, useState } from "react"

const DisplayText: React.FC<{ setScript: Dispatch<SetStateAction<string>> }> = ({ setScript }) => {

  const [isModalOpened, setIsModalOpened] = useState<boolean>(false)
  const [textToDisplay, setTextToDisplay] = useState<string>("")

  const handleConfirm = useCallback<any>(() => {
    setScript(s => `${s}${s === "" ? "" : "\n"}window.alert(\`${textToDisplay}\`)`)
    setIsModalOpened(false)
    setTextToDisplay("")
  }, [textToDisplay])

  return (
    <>
      <span className='container'>
        <Button onClick={() => setIsModalOpened(true)}>Display text</Button>
        <Modal
          opened={isModalOpened}
          onClose={() => { setIsModalOpened(false), setTextToDisplay("") }}
          styles={{ header: { position: "absolute", top: 0, right: 0, margin: "5px" } }}
        >
          <Textarea
            data-autofocus
            value={textToDisplay}
            onChange={(event) => setTextToDisplay(event.currentTarget.value)}
            label="Text to display"
            autosize
          />
          <Button
            onClick={handleConfirm}
            fullWidth
            mt="md"
          >
            Confirm
          </Button>
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

export default DisplayText