import { Button } from "@mantine/core"
import { Dispatch, SetStateAction, useCallback } from "react"
import store from "../../../store"

const MapVariable: React.FC<{ setScript: Dispatch<SetStateAction<string>>, cellIndex: number }> = ({ setScript, cellIndex }) => {
  const gridId = store(state => state.activeGridId)

  const handleClick = useCallback<any>(() => {
    const script = `window._ss().mapSet("visibleVariable", 10)\nwindow._ss().mapSet("_invisibleVariable", 10)\nconst visibleVariable = window._ss().mapGet("visibleVariable")`
    setScript(s => `${s}${s === "" ? "" : "\n"}${script}`)
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