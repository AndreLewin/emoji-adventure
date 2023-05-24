import { Button, Modal, TextInput, Textarea } from "@mantine/core"
import { useCallback, useMemo, useState } from "react"
import { getHotkeyHandler } from '@mantine/hooks'
import store from "../../../store"

const Prompt: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {

  const [isModalOpened, setIsModalOpened] = useState<boolean>(false)
  const [textToDisplay, setTextToDisplay] = useState<string>("")
  const updateCellWithAppend = store(state => state.updateCellWithAppend)
  const activeCScriptTab = store(state => state.activeCScriptTab)

  const [specialAnswersString, setSpecialAnswersString] = useState("")
  const specialAnswersArray = useMemo<string[]>(() => {
    let choices = specialAnswersString.split(";")
    choices = choices.map(c => c.trim())
    return choices
  }, [specialAnswersString])

  const handlePrompt = useCallback<any>(() => {
    let script = `const answer = __p(\`${textToDisplay}\`)\n`
    for (let i = 0; i < specialAnswersArray.length; i++) {
      script += `if (answer === \`${specialAnswersArray[i]}\`) {
  
} else `
    }
    script += `{
  
}`

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
  }, [activeCScriptTab, updateCellWithAppend, textToDisplay, gridId, cellIndex, specialAnswersArray])

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
          <TextInput
            label="Special answers (separate them with ; )"
            value={specialAnswersString}
            onChange={(e) => setSpecialAnswersString(e.currentTarget.value ?? "")}
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