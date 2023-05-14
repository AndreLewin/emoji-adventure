import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const MoveCell: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// it will move everything except the color of the cell

// move first cell content of the first grid to the right
_move({ gridId: 0, cellIndex: 0, direction: "right" })

// possible directions: "up", "right", "down", "left"

// move cell content three rows down
_move({ gridId: 0, cellIndex: 1, direction: "down", distance: 3 })

// if the cell is moved "outside" the grid, it will disappear
// if you want the cell to appear on the opposite side, use the isRound property
_move({ gridId: 0, cellIndex: 31, direction: "up", distance: 8, isRound: true })

// if you want the color of the cell to move too, add the moveColor property
// _move({ gridId: 0, cellIndex: 1, direction: "down", moveColor: true })

// the function _move returns the destination cell with updated data
// const destinationCell = _move({ gridId: 0, cellIndex: 0, direction: "left" })
// console.log(destinationCell)

// move the current cell to the right
// _move({ gridId: @gi, cellIndex: ^ci, direction: "right" })

// you can use shorthands to automatically target the current cell or grid
// ^move({ direction: "right" })
// @move({ cellIndex: ^ci, direction: "right" })
`
    updateCellWithAppend({
      gridId,
      cellIndex,
      cellUpdate: {
        [activeCScriptTab]: script
      }
    })
  }, [activeCScriptTab, updateCellWithAppend, gridId, cellIndex])

  return (
    <>
      <span className='container'>
        <Button onClick={handleClick}>Move Cell</Button>
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

export default MoveCell