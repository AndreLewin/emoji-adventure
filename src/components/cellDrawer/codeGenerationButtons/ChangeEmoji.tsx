import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const ChangeEmoji: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `_ss().updateCell({\n  gridId: ${gridId},\n  cellIndex: ${cellIndex},\n  cellUpdate: { emoji: "🦊" }\n})`
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
        <Button onClick={handleClick}>Change Emoji</Button>
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

export default ChangeEmoji