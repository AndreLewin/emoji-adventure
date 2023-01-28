import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const MapVariable: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `window._ss().mapSet("visibleVariable", 10)\nwindow._ss().mapSet("_invisibleVariable", 10)\nconst visibleVariable = window._ss().mapGet("visibleVariable")`
    updateCellWithAppend({
      gridId,
      cellIndex,
      cellUpdate: { script }
    })
  }, [gridId, cellIndex])

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