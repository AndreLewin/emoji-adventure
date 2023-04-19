import { Button, Modal, Textarea } from "@mantine/core"
import { useCallback, useState } from "react"
import { getHotkeyHandler } from '@mantine/hooks'
import store from "../../../store"

const Prompt: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {

  const [isModalOpened, setIsModalOpened] = useState<boolean>(false)
  const [textToDisplay, setTextToDisplay] = useState<string>("")
  const updateCellWithAppend = store(state => state.updateCellWithAppend)
  const activeCScriptTab = store(state => state.activeCScriptTab)

  const handlePrompt = useCallback<any>(() => {
    const script = `const answer = #p(\`${textToDisplay}\`)\nif (answer === "") {\n  \n}`
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
        <Button onClick={() => setIsModalOpened(true)}>Prompt</Button>
        <Modal
          opened={isModalOpened}
          onClose={() => { setIsModalOpened(false), setTextToDisplay("") }}
          styles={{ header: { position: "absolute", top: 0, right: 0, margin: "5px" } }}
        >
          <Textarea
            data-autofocus
            value={textToDisplay}
            label="Question to display (free answer)"
            autosize
            onChange={(event) => setTextToDisplay(event.currentTarget.value)}
            onKeyDown={getHotkeyHandler([
              ['ctrl+Enter', handlePrompt]
            ])}
          />
          <Button
            onClick={handlePrompt}
            fullWidth
            mt="md"
          >
            Confirm (CTRL + ENTER)
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

export default Prompt