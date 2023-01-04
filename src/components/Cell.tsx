import { useCallback } from "react"
import store, { Cell } from "../store"

const CellComponent: React.FC<{ cell: Cell, index: number }> = ({ cell, index }) => {
  const selectedTool = store(state => state.selectedTool)
  const selectedColor = store(state => state.selectedColor)
  const set = store(state => state.set)
  const mouseDownCellIndex = store(state => state.mouseDownCellIndex)

  const changeCell = store(state => state.changeCell)
  const changeCellsLikeSquare = store(state => state.changeCellsLikeSquare)

  const handleMouseOver = useCallback<any>((event: MouseEvent) => {
    if (selectedTool === "pencil") {
      const { buttons } = event
      // 1 === the left button was held
      if (buttons === 1) {
        if (cell.color !== selectedColor) {
          changeCell(index, { color: selectedColor })
        }
      }
    } else if (selectedTool === "eraser") {
      const { buttons } = event
      if (buttons === 1) {
        changeCell(index, { color: "" })
      }
    }
  }, [cell, selectedTool, selectedColor])

  const handleMouseDown = useCallback<any>((event: MouseEvent) => {
    if (selectedTool === "pencil") {
      if (cell.color !== selectedColor) {
        changeCell(index, { color: selectedColor })
      }
    } else if (selectedTool === "square") {
      set({ mouseDownCellIndex: index })
    } else if (selectedTool === "eraser") {
      changeCell(index, { color: "" })
    }
  }, [cell, selectedTool, selectedColor])

  const handleMouseUp = useCallback<any>((event: MouseEvent) => {
    if (selectedTool === "square") {
      const startCellIndex = mouseDownCellIndex
      const endCellIndex = index
      if (startCellIndex !== null && endCellIndex !== null) {
        changeCellsLikeSquare({ index1: startCellIndex, index2: endCellIndex }, { color: selectedColor })
      }
      set({ mouseDownCellIndex: null })
    }
  }, [cell, selectedTool, selectedColor, mouseDownCellIndex])

  return (
    <>
      <div
        className="container"
        style={{ "backgroundColor": cell.color }}
        onMouseOver={(e) => handleMouseOver(e)}
        onMouseDown={(e) => handleMouseDown(e)}
        onMouseUp={(e) => handleMouseUp(e)}
      >
        WIP
      </div>
      <style jsx>
        {`
          .container {
            border: dashed 0.5px rgba(0,0,0,0.5)
          }
        `}
      </style>
    </>
  )
}

export default CellComponent