import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const GlobalVariable: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// Global variables (adventure variables) (#.variable) share their value in the whole project\n// Grid variables (@.variable) share their value in the grid and the cells within it\n// Cell variables (^.variable) is only for a specific cell in a specific grid\n// All variable values default at 0\n\n#.adventureCounter++\n@.gridCounter++\n^.cellCounter++\n__a(\`Number of times you clicked a cell: \${#.adventureCounter}\`)\n__a(\`Number of times you clicked a cell in this grid: \${@.gridCounter}\`)\n__a(\`Number of times you clicked on this specific cell: \${^.cellCounter}\`)\n\n// Duplicate this script in an other cell to see that the global variable is reused, but the local variable not.\n`
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
        <Button onClick={handleClick}>Variables</Button>
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

export default GlobalVariable