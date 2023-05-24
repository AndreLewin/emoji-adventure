import { Button, Modal, TextInput, Textarea } from "@mantine/core"
import { useCallback, useMemo, useState } from "react"
import { getHotkeyHandler } from '@mantine/hooks'
import store from "../../../store"

const MultipleChoice: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {

  const [isModalOpened, setIsModalOpened] = useState<boolean>(false)
  const [textToDisplay, setTextToDisplay] = useState<string>("")
  const updateCellWithAppend = store(state => state.updateCellWithAppend)
  const activeCScriptTab = store(state => state.activeCScriptTab)

  const [choicesString, setChoicesString] = useState("")
  const choicesArray = useMemo<string[]>(() => {
    let choices = choicesString.split(";")
    choices = choices.map(c => c.trim())
    return choices
  }, [choicesString])

  const handleMultipleChoice = useCallback<any>(() => {
    let choicesArrayToString = "["
    choicesArray.forEach((c, index) => {
      if (index !== 0) choicesArrayToString += ","
      choicesArrayToString += "`"
      choicesArrayToString += c
      choicesArrayToString += "`"
    })
    choicesArrayToString += "]"
    let script = `const answer = _m(\`${textToDisplay}\`, ${choicesArrayToString})`
    for (let i = 0; i < choicesArray.length; i++) {
      script += `\nif (answer === \`${choicesArray[i]}\`) {
  
}`
    }

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
  }, [activeCScriptTab, updateCellWithAppend, textToDisplay, gridId, cellIndex, choicesArray])

  return (
    <>
      <span className='container'>
        <Button onClick={() => setIsModalOpened(true)}>Multiple choice</Button>
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
              ['ctrl+Enter', handleMultipleChoice]
            ])}
          />
          <TextInput
            label="Choices (separate them with ; )"
            value={choicesString}
            onChange={(e) => setChoicesString(e.currentTarget.value ?? "")}
            onKeyDown={getHotkeyHandler([
              ['ctrl+Enter', handleMultipleChoice]
            ])}
          />
          <Button
            onClick={handleMultipleChoice}
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

export default MultipleChoice