import { Button, Modal, Textarea } from "@mantine/core"
import { getHotkeyHandler } from "@mantine/hooks"
import { useCallback, useState } from "react"
import store, { Cell } from "../../store"

const TextShortcutModal: React.FC<{
  closeModal: () => any
  cell: Cell
  cellIndex: number
  gridId: number
}> = ({
  closeModal,
  cell,
  cellIndex,
  gridId
}) => {
    const [shortcutText, setShortcutText] = useState<string>("")

    const updateCell = store(state => state.updateCell)

    const handleTextShortcutConfirm = useCallback<any>(() => {
      const s = cell.script
      updateCell({
        gridId,
        cellIndex,
        cellUpdate: {
          script: `${s}${s === "" ? "" : "\n"}window.alert(\`${shortcutText}\`)`
        }
      })
      setShortcutText("")
      closeModal()
    }, [shortcutText, gridId, cellIndex, cell])

    return (
      <>
        <Modal
          opened={true}
          onClose={() => {
            setShortcutText(""),
              closeModal()
          }}
          styles={{ header: { position: "absolute", top: 0, right: 0, margin: "5px" } }}
        >
          <Textarea
            data-autofocus
            value={shortcutText}
            label="Text to display (CTRL+Enter to confirm)"
            autosize
            onChange={(event) => setShortcutText(event.currentTarget.value)}
            onKeyDown={getHotkeyHandler([
              ['ctrl+Enter', handleTextShortcutConfirm]
            ])}
          />
          <Button
            onClick={handleTextShortcutConfirm}
            fullWidth
            mt="md"
          >
            Confirm
          </Button>
        </Modal>
        <style jsx>
          {`
            .container {
              
            }
          `}
        </style>
      </>
    )
  }

export default TextShortcutModal