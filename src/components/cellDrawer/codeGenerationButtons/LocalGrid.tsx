import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const LocalGrid: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// Get local grid data
console.log(@:)
// Get cells
console.log(@:cells)
// Get text/title of the grid
console.log(@:text)
// Update the text/title of the grid
@:text = "The forest"
// Update view script of the grid
@:vs = "#a('Welcome in our forest')"
// Get local gridId
console.log(@gi)

// Get cell at cellIndex 3
console.log(@:3)
// Update emoji at cellIndex 3
@:3e = "🦊"
// Update color at cellIndex 65
@:65c = "brown"
// Copy the content of the cell 65 to cell 66
@:66 = @:65
// Get all cells from cellIndex 0 to cellIndex 99
console.log(@:0t99)
// Update the color of all cells from cellIndex 0 to cellIndex 99
@:0t99c = "green"
// Update the emoji of cells 9, 21, 33, 81
@:9a21a33a81e = "🦊"
// Update the color of the rectangle from cellIndex 51 to cellIndex 63
@:51x63c = "blue"
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
        <Button onClick={handleClick}>Local Grid</Button>
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

export default LocalGrid