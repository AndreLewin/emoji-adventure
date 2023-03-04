import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const Configs: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// Each variable can have a config object.\n// If you want to change the config object, put % before the variable name.\n// Example: Show the value of a variable to the player with a custom name\n\n%@.cats = { isVisible: true, displayName: "Cats found in this grid" }`
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
        <Button onClick={handleClick}>Configs</Button>
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

export default Configs