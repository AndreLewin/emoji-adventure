import { useCallback, useMemo, useState } from "react"
import store, { Cell } from "../store"
import { evalScript } from "../utils/evalScript"
import MoveShortcutModal from "./cell/MoveShortcutModal"
import TextShortcutModal from "./cell/TextShortcutModal"
import CellDrawer from "./CellDrawer"

const CellComponent: React.FC<{ cell: Cell, cellIndex: number, gridId: number }> = ({ cell, cellIndex, gridId }) => {
  const selectedTool = store(state => state.selectedTool)
  const selectedColor = store(state => state.selectedColor)
  const selectedEmoji = store(state => state.selectedEmoji)
  const set = store(state => state.set)
  const mouseDownCellIndex = store(state => state.mouseDownCellIndex)
  const copiedCell = store(state => state.copiedCell)

  const updateCell = store(state => state.updateCell)
  const updateSquare = store(state => state.updateSquare)
  const floodFill = store(state => state.floodFill)
  const getCell = store(state => state.getCell)

  const handleMouseOver = useCallback<any>((event: MouseEvent) => {
    const { buttons, ctrlKey } = event
    // don't do anything if the user is duplicating a cell
    if (ctrlKey) return

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
      if (altKey) {
        evalScript(cell?.onClickCScript ?? "", { gridId, cellIndex })
        return
      } else if (ctrlKey) {
        set({ mouseDownCellIndex: cellIndex })
        return
      }

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
      } else if (selectedTool === "copyEverything") {
        set({ copiedCell: cell, selectedTool: "pasteEverything" })
      } else if (selectedTool === "pasteEverything") {
        updateCell({
          gridId,
          cellIndex,
          cellUpdate: { ...copiedCell }
        })
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
    const { ctrlKey } = event
    if (ctrlKey) {
      const startCellIndex = mouseDownCellIndex
      const endCellIndex = cellIndex
      if (startCellIndex !== null && endCellIndex !== null) {
        const cellToCopy = getCell({ gridId, cellIndex: startCellIndex })
        if (cellToCopy !== null) {
          updateCell({
            gridId,
            cellIndex: endCellIndex,
            cellUpdate: { ...cellToCopy }
          })
        }
      }
      set({ mouseDownCellIndex: null })
      return
    }

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

  const hasAClickScript = useMemo<boolean>(() => {
    return (cell?.onClickCScript ?? "") !== ""
  }, [cell])
  const hasAViewScript = useMemo<boolean>(() => {
    return (cell?.onViewCScript ?? "") !== ""
  }, [cell])
  const hasAnInitScript = useMemo<boolean>(() => {
    return (cell?.onInitCScript ?? "") !== ""
  }, [cell])

  const [isDrawerOpened, setIsDrawerOpened] = useState<boolean>(false)
  const [isTextShortcutOpen, setIsTextShortcutOpen] = useState<boolean>(false)
  const [isMoveShortcutOpen, setIsMoveShortcutOpen] = useState<boolean>(false)

  return (
    <>
      <div
        className={`container ${hasAnInitScript ? "init-script-style" : ""} ${isDrawerOpened ? "selected-border" : ""}`}
        style={{ "backgroundColor": cell.color }}
        onMouseOver={(e) => handleMouseOver(e)}
        onMouseDown={(e) => handleMouseDown(e)}
        onMouseUp={(e) => handleMouseUp(e)}
        onContextMenu={(e) => setIsDrawerOpened(true)}
      >
        <div className={`full ${hasAViewScript ? "view-script-style" : ""}`}>
          <div className={`full ${hasAClickScript ? "click-script-style" : ""}`}>
            <span className="emoji-wrapper">
              {cell.emoji}
            </span>
          </div>
        </div>
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

          .click-script-style {
            border: 3px dashed;
            border-image-slice: 1;
            border-width: 3px;
            border-image-source: linear-gradient(to right, #d53a9d, #3593f7);
          }
          .view-script-style {
            border: 3px dashed;
            border-image-slice: 1;
            border-width: 3px;
            border-image-source: linear-gradient(to bottom, #428929, #b3a058);
          }
          .init-script-style {
            border: 3px dashed;
            border-image-slice: 1;
            border-width: 3px;
            border-image-source: linear-gradient(to bottom left, #ffffff, #323287);
          }

          .full {
            width: 100%;
            height: 100%;
          }

          .selected-border {
            border: 6px solid var(--highlighter-blue);
          }

          .emoji-wrapper {
            /* so the text/emoji is displayed over the background color of other cells */
            z-index: 2; 
            width: 100%;
            height: 100%;
            white-space: nowrap;

            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
    </>
  )
}

export default CellComponent