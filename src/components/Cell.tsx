import { useCallback, useMemo, useState } from "react"
import store, { Cell } from "../store"
import CellDrawer from "./CellDrawer"

const CellComponent: React.FC<{ cell: Cell, index: number, gridId: number }> = ({ cell, index, gridId }) => {
  const selectedTool = store(state => state.selectedTool)
  const selectedColor = store(state => state.selectedColor)
  const selectedEmoji = store(state => state.selectedEmoji)
  const set = store(state => state.set)
  const mouseDownCellIndex = store(state => state.mouseDownCellIndex)

  const changeCell = store(state => state.changeCell)
  const changeCellsLikeSquare = store(state => state.changeCellsLikeSquare)

  const handleMouseOver = useCallback<any>((event: MouseEvent) => {
    const { buttons } = event
    // left click
    if (buttons === 1) {
      if (selectedTool === "pencil") {
        if (selectedColor !== null && cell.color !== selectedColor) {
          changeCell(index, { color: selectedColor })
        } else if (selectedEmoji !== null && cell.emoji !== selectedEmoji) {
          changeCell(index, { emoji: selectedEmoji })
        }
      } else if (selectedTool === "eraser") {
        changeCell(index, { color: "", emoji: "" })
      }
    }
  }, [cell, selectedTool, selectedColor, selectedEmoji])

  const handleMouseDown = useCallback<any>((event: MouseEvent) => {
    const { buttons } = event
    if (buttons === 1) {
      if (selectedTool === "pencil") {
        if (selectedColor !== null && cell.color !== selectedColor) {
          changeCell(index, { color: selectedColor })
        } else if (selectedEmoji !== null && cell.emoji !== selectedEmoji) {
          changeCell(index, { emoji: selectedEmoji })
        }
      } else if (selectedTool === "square") {
        set({ mouseDownCellIndex: index })
      } else if (selectedTool === "colorPicker") {
        set({ selectedColor: cell.color, selectedTool: "pencil", selectedEmoji: null })
      } else if (selectedTool === "emojiPicker") {
        set({ selectedEmoji: cell.emoji, selectedTool: "pencil", selectedColor: null })
      } else if (selectedTool === "eraser") {
        changeCell(index, { color: "", emoji: "" })
      }
    } else if (buttons === 2 || buttons === 3) {
      setIsDrawerOpened(true)
    }
  }, [cell, selectedTool, selectedColor, selectedEmoji])

  const handleMouseUp = useCallback<any>((event: MouseEvent) => {
    if (selectedTool === "square") {
      const startCellIndex = mouseDownCellIndex
      const endCellIndex = index
      if (startCellIndex !== null && endCellIndex !== null) {
        if (selectedColor !== null && cell.color !== selectedColor) {
          changeCellsLikeSquare({ index1: startCellIndex, index2: endCellIndex }, { color: selectedColor })
        } else if (selectedEmoji !== null && cell.emoji !== selectedEmoji) {
          changeCellsLikeSquare({ index1: startCellIndex, index2: endCellIndex }, { emoji: selectedEmoji })
        }
      }
      set({ mouseDownCellIndex: null })
    }
  }, [cell, selectedTool, selectedColor, mouseDownCellIndex, selectedEmoji])

  const [isDrawerOpened, setIsDrawerOpened] = useState<boolean>(false)

  const hasAScript = useMemo<boolean>(() => {
    console.log("script has been changed!")

    return cell.script !== ""
  }, [cell.script])

  return (
    <>
      <div
        className={`container ${hasAScript ? "dashed-outline" : ""} ${isDrawerOpened ? "highlight-outline" : ""}`}
        style={{ "backgroundColor": cell.color }}
        onMouseOver={(e) => handleMouseOver(e)}
        onMouseDown={(e) => handleMouseDown(e)}
        onMouseUp={(e) => handleMouseUp(e)}
        onContextMenu={(e) => setIsDrawerOpened(true)}
      >
        {cell.emoji}
      </div>

      <CellDrawer
        isDrawerOpened={isDrawerOpened}
        setIsDrawerOpened={setIsDrawerOpened}
        cell={cell}
        gridId={gridId}
        cellIndex={index}
        key={`grid${gridId}-cell${index}`}
      />

      <style jsx>
        {`
          .container {
            border: dashed 0.5px rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5em;
          }

          .dashed-outline {
            border: 2px dashed var(--highlighter-blue);
          }

          .highlight-outline {
            border: 3px solid var(--highlighter-blue);
          }
        `}
      </style>
    </>
  )
}

export default CellComponent