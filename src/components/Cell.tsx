import { useCallback } from "react"
import store, { Cell } from "../store"

const CellComponent: React.FC<{ cell: Cell, index: number }> = ({ cell, index }) => {
  const selectedTool = store(state => state.selectedTool)
  const selectedColor = store(state => state.selectedColor)
  const changeCell = store(state => state.changeCell)

  const handleMouseOver = useCallback<any>((event: MouseEvent) => {
    if (selectedTool === "pencil") {
      const { buttons } = event
      // 1 === the left button was held
      if (buttons === 1) {
        if (cell.color !== selectedColor) {
          changeCell(index, { color: selectedColor })
        }
      }
    }
  }, [cell, selectedTool, selectedColor])

  const handleMouseDown = useCallback<any>((event: MouseEvent) => {
    if (selectedTool === "pencil") {
      if (cell.color !== selectedColor) {
        changeCell(index, { color: selectedColor })
      }
    }
  }, [cell, selectedTool, selectedColor])

  return (
    <>
      <div
        className="container"
        style={{ "backgroundColor": cell.color }}
        onMouseOver={(e) => handleMouseOver(e)}
        onMouseDown={(e) => handleMouseDown(e)}
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