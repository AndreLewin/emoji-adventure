import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const LocalAdventure: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// Get adventure (and editor) data
console.log(#:)
// Get active grid
console.log(#:activeGridId)
// Change active grid (it will not work if the grid does not exist)
#:activeGridId = 2
// Get grid with gridId 0
console.log(#:0)
// Update the title of the first grid
#:0text = "New title"
// Get all grids from grid 0 to 1
console.log(#:0t1)
// Get all grids 0 to the last one
console.log(#:0tt0)
// Get the cells of all grids
console.log(#:0tt0cells)
// In the first grid, get the first cell
console.log(#:0_0)
// In the grids 1 and 3, show the color of cell 0 to 9 (create those grids first)
console.log(#:1a3_0t9c)
// In all grids, update the color of the last row to black
#:0tt0_90t99c = "black"
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
        <Button onClick={handleClick}>Local Adventure</Button>
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

export default LocalAdventure