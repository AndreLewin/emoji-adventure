import { Button } from "@mantine/core"
import { Dispatch, SetStateAction, useCallback } from "react"
import store from "../../../store"

const DeleteElement: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// Delete emoji\n^e = ""\n// Delete color\n^c = ""\n// Delete click script\n^cs = ""\n// Delete click script, view script and emoji\n^d\n// Delete click script, view script, emoji and color\n^dd\n`
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
        <Button onClick={handleClick}>Delete element</Button>
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

export default DeleteElement