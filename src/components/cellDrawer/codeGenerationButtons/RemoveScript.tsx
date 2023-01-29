import { Button } from "@mantine/core"
import { Dispatch, SetStateAction, useCallback } from "react"
import store from "../../../store"

const RemoveScript: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const onClickCScript = `_ss().updateCell({\n  gridId: ${gridId},\n  cellIndex: ${cellIndex},\n  cellUpdate: { onClickCScript: "" }\n})`
    updateCellWithAppend({
      gridId,
      cellIndex,
      cellUpdate: { onClickCScript }
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