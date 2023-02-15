import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const GlobalVariable: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// Global variables (!.variableName) are common to the whole project\n// Local variables (!!.variable) are only available for a cell. The value is persisted between executions.\n\n!.globalCounter = (!.globalCounter ?? 0) + 1\n!!.localCounter = (!!.localCounter ?? 0) + 1\n!a(\`Number of times you clicked a cell: \${!.globalCounter}\`)\n!a(\`Number of times you clicked this cell: \${!!.localCounter}\`)\n\n// Duplicate this script in an other cell to see that the global variable is reused, but the local variable not.\n`
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