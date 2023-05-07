import { Button, Checkbox, Modal, Textarea } from "@mantine/core"
import { useCallback, useState } from "react"
import { getHotkeyHandler } from '@mantine/hooks'
import store from "../../../store"

const Prompt: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {

  const [isModalOpened, setIsModalOpened] = useState<boolean>(false)
  const [textToDisplay, setTextToDisplay] = useState<string>("")
  const updateCellWithAppend = store(state => state.updateCellWithAppend)
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const [shouldForceValidAnswer, setShouldForceValidAnswer] = useState<boolean>(!!(localStorage.getItem("shouldForceValidAnswer")))

  const handlePrompt = useCallback<any>(() => {
    const scriptNotForced = `const answer = #p(\`${textToDisplay}\`)
if (answer === "1") {
  
}
if (answer === "2") {
  
}
`
    const scriptForced = `while (true) {
  const answer = #p(\`${textToDisplay}\`)
  if (answer === "1") {
    
    break
  }
  if (answer === "2") {
    
    break
  }
}`
    updateCellWithAppend({
      gridId,
      cellIndex,
      cellUpdate: {
        [activeCScriptTab]: shouldForceValidAnswer ? scriptForced : scriptNotForced
      }
    })
    setIsModalOpened(false)
    setTextToDisplay("")
    setTimeout(() => {
      const codeEditor = window.document.querySelector(".npm__react-simple-code-editor__textarea") as HTMLElement
      codeEditor?.focus()
    }, 50);
  }, [activeCScriptTab, updateCellWithAppend, textToDisplay, gridId, cellIndex, shouldForceValidAnswer])

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
          <Checkbox
            checked={shouldForceValidAnswer}
            onChange={() => { localStorage.setItem("shouldForceValidAnswer", "true"), setShouldForceValidAnswer(!shouldForceValidAnswer) }}
            label="Force valid answer"
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