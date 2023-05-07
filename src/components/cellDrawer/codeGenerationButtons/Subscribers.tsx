import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const Subscribers: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// A subscriber is a function that is executed when the value of a variable is changed.\n// You just have to put $ before the adventure, grid or cell variable and to assign the subscriber function.\n// The first argument of the function is the new value.\n// Example: add a subscriber to the variable #.score, display "you won" if the value is >= 3.\n\n#$.score = v => v >= 3 && #a("you won")\n\n// Try it by running #.score++ several times in an other script.`
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
        <Button onClick={handleClick}>Variable subscribers</Button>
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

export default Subscribers