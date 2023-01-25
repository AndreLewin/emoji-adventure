import { Button } from "@mantine/core"
import { Dispatch, SetStateAction, useCallback } from "react"
import store from "../../../store"

const ChangeEmoji: React.FC<{ setScript: Dispatch<SetStateAction<string>>, cellIndex: number }> = ({ setScript, cellIndex }) => {
  const gridId = store(state => state.activeGridId)

  const handleClick = useCallback<any>(() => {
    const script = `_ss().updateCell({\n  gridId: ${gridId},\n  cellIndex: ${cellIndex},\n  cellUpdate: { emoji: "🦊" }\n})`
    setScript(s => `${s}${s === "" ? "" : "\n"}${script}`)
  }, [gridId, cellIndex])

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