import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const MapVariable: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// Map variables are variables visible under the grid.\n// You can hide a map variable by starting its name with _\n\n!ms("visibleVariable", 10)\n!ms("_invisibleVariable", 10)\nconst visibleVariable = !mg("visibleVariable")\n\n// You can subscribe to a map variable with a callback that will be executed when the value of the variable changes. See "Example Script" on the adventure. If you don't need reactivity, prefer global variables.\n`
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
        <Button onClick={handleClick}>Map variable</Button>
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

export default MapVariable