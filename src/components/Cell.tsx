import { Button, Modal, Textarea } from "@mantine/core"
import { getHotkeyHandler } from "@mantine/hooks"
import { useCallback, useMemo, useState } from "react"
import store, { Cell } from "../store"
import MoveShortcutModal from "./cell/MoveShortcutModal"
import TextShortcutModal from "./cell/TextShortcutModal"
import CellDrawer from "./CellDrawer"

const CellComponent: React.FC<{ cell: Cell, cellIndex: number, gridId: number }> = ({ cell, cellIndex, gridId }) => {
  const selectedTool = store(state => state.selectedTool)
  const selectedColor = store(state => state.selectedColor)
  const selectedEmoji = store(state => state.selectedEmoji)
  const set = store(state => state.set)
  const mouseDownCellIndex = store(state => state.mouseDownCellIndex)

  const updateCell = store(state => state.updateCell)
  const updateSquare = store(state => state.updateSquare)
  const floodFill = store(state => state.floodFill)

  const handleMouseOver = useCallback<any>((event: MouseEvent) => {
    const { buttons } = event
    // left click holded
    if (buttons === 1) {
      if (selectedTool === "pencil") {
        if (selectedColor !== null && cell.color !== selectedColor) {
          updateCell({
            gridId,
            cellIndex,
            cellUpdate: { color: selectedColor }
          })
        } else if (selectedEmoji !== null && cell.emoji !== selectedEmoji) {
          updateCell({
            gridId,
            cellIndex,
            cellUpdate: { emoji: selectedEmoji }
          })
        }
      } else if (selectedTool === "eraser") {
        updateCell({
          gridId,
          cellIndex,
          cellUpdate: { color: "", emoji: "" }
        })
      }
    }
  }, [cell, gridId, cellIndex, selectedTool, selectedColor, selectedEmoji])

  const handleMouseDown = useCallback<any>((event: MouseEvent) => {
    const { buttons, ctrlKey, altKey } = event
    if (buttons === 1) {
      if (selectedTool === "pencil") {
        updateCell({
          gridId,
          cellIndex,
          cellUpdate: {
            ...(selectedColor !== null ? { color: selectedColor } : {}),
            ...(selectedEmoji !== null ? { emoji: selectedEmoji } : {})
          }
        })
      } else if (selectedTool === "square") {
        set({ mouseDownCellIndex: cellIndex })
      } else if (selectedTool === "bucket") {
        floodFill({
          gridId,
          cellIndex,
          cellUpdate: {
            ...(selectedColor !== null ? { color: selectedColor } : {}),
            ...(selectedEmoji !== null ? { emoji: selectedEmoji } : {})
          }
        })
      } else if (selectedTool === "colorPicker") {
        set({ selectedColor: cell.color, selectedTool: "pencil", selectedEmoji: null })
      } else if (selectedTool === "emojiPicker") {
        set({ selectedEmoji: cell.emoji, selectedTool: "pencil", selectedColor: null })
      } else if (selectedTool === "eraser") {
        updateCell({
          gridId,
          cellIndex,
          cellUpdate: { color: "", emoji: "" }
        })
      }
    } else if (buttons === 2 || buttons === 3) {
      if (ctrlKey) {
        setIsTextShortcutOpen(true)
      } else if (altKey) {
        setIsMoveShortcutOpen(true)
      } else {
        setIsDrawerOpened(true)
      }
    }
  }, [cell, gridId, cellIndex, selectedTool, selectedColor, selectedEmoji])

  const handleMouseUp = useCallback<any>((event: MouseEvent) => {
    if (selectedTool === "square") {
      const startCellIndex = mouseDownCellIndex
      const endCellIndex = cellIndex
      if (startCellIndex !== null && endCellIndex !== null) {
        updateSquare({
          gridId,
          cellIndex1: startCellIndex,
          cellIndex2: endCellIndex,
          cellUpdate: {
            ...((selectedColor !== null) ? { color: selectedColor } : {}),
            ...((selectedEmoji !== null) ? { emoji: selectedEmoji } : {})
          }

        })
      }
      set({ mouseDownCellIndex: null })
    }
  }, [cell, gridId, cellIndex, selectedTool, selectedColor, mouseDownCellIndex, selectedEmoji])

  const hasAScript = useMemo<boolean>(() => {
    return cell.script !== ""
  }, [cell.script])

  const [isDrawerOpened, setIsDrawerOpened] = useState<boolean>(false)
  const [isTextShortcutOpen, setIsTextShortcutOpen] = useState<boolean>(false)
  const [isMoveShortcutOpen, setIsMoveShortcutOpen] = useState<boolean>(false)

  return (
    <>
      <div
        className={`container ${hasAScript ? "gradient-border" : ""} ${isDrawerOpened ? "selected-border" : ""}`}
        style={{ "backgroundColor": cell.color }}
        onMouseOver={(e) => handleMouseOver(e)}
        onMouseDown={(e) => handleMouseDown(e)}
        onMouseUp={(e) => handleMouseUp(e)}
        onContextMenu={(e) => setIsDrawerOpened(true)}
      >
        {cell.emoji}
      </div>

      {isDrawerOpened &&
        <CellDrawer
          isDrawerOpened={isDrawerOpened}
          setIsDrawerOpened={setIsDrawerOpened}
          cell={cell}
          gridId={gridId}
          cellIndex={cellIndex}
          key={`grid${gridId}-cell${cellIndex}`}
        />
      }

      {isTextShortcutOpen &&
        <TextShortcutModal
          closeModal={() => setIsTextShortcutOpen(false)}
          cell={cell}
          cellIndex={cellIndex}
          gridId={gridId}
        />
      }

      {isMoveShortcutOpen &&
        <MoveShortcutModal
          closeModal={() => setIsMoveShortcutOpen(false)}
          cell={cell}
          cellIndex={cellIndex}
          gridId={gridId}
        />
      }

      <style jsx>
        {`
          .container {
            border: dashed 0.5px rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5em;
          }

          .gradient-border {
            border: 3px dashed;
            border-image-slice: 1;
            border-width: 3px;
            border-image-source: linear-gradient(to right, #d53a9d, #3593f7);
          }

          .selected-border {
            border: 6px solid var(--highlighter-blue);
          }
        `}
      </style>
    </>
  )
}

export default CellComponent