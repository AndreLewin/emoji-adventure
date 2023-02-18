import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const AskForName: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `const name = @p("What is your name?")\n@a(\`Hello \$\{name\}!\`)`
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
        <Button onClick={handleClick}>Ask for name</Button>
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

export default AskForName