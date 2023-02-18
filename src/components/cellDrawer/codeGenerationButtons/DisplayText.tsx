import { Button, Modal, Textarea } from "@mantine/core"
import { useCallback, useState } from "react"
import { getHotkeyHandler } from '@mantine/hooks'
import store from "../../../store"

const DisplayText: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {

  const [isModalOpened, setIsModalOpened] = useState<boolean>(false)
  const [textToDisplay, setTextToDisplay] = useState<string>("")
  const updateCellWithAppend = store(state => state.updateCellWithAppend)
  const activeCScriptTab = store(state => state.activeCScriptTab)

  const handleConfirm = useCallback<any>(() => {
    const script = `@a(\`${textToDisplay}\`)`
    updateCellWithAppend({
      gridId,
      cellIndex,
      cellUpdate: {
        [activeCScriptTab]: script
      }
    })
    setIsModalOpened(false)
    setTextToDisplay("")
    setTimeout(() => {
      const codeEditor = window.document.querySelector(".npm__react-simple-code-editor__textarea") as HTMLElement
      codeEditor?.focus()
    }, 50);
  }, [activeCScriptTab, updateCellWithAppend, textToDisplay, gridId, cellIndex])

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
            label="Text to display"
            autosize
            onChange={(event) => setTextToDisplay(event.currentTarget.value)}
            onKeyDown={getHotkeyHandler([
              ['ctrl+Enter', handleConfirm]
            ])}
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