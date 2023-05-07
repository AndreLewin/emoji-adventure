import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const Chronometer: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// adventure chronometer
#%.chronometer = "Time playing the adventure (s)"
setInterval(() => #.chronometer++, 1000)

// grid chronometer
@%.chronometer = "Time in this grid (s)"
_i(() => @.chronometer++)`
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
        <Button color="gray" onClick={handleClick}>Chronometer</Button>
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

export default Chronometer