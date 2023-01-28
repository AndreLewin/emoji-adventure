import { Button } from "@mantine/core"
import { Dispatch, SetStateAction, useCallback } from "react"
import store from "../../../store"

const RemoveScript: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `_ss().updateCell({\n  gridId: ${gridId},\n  cellIndex: ${cellIndex},\n  cellUpdate: { script: "" }\n})`
    updateCellWithAppend({
      gridId,
      cellIndex,
      cellUpdate: { script }
    })
  }, [gridId, cellIndex])

  return (
    <>
      <span className='container'>
        <Button onClick={handleClick}>Remove Script</Button>
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

export default RemoveScript