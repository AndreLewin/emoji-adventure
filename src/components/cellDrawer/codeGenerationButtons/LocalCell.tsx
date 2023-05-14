import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const LocalCell: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// Update emoji\n^:e = "🦊"\n// Update color\n^:c = "brown"\n// Update click script\n^:cs = "_a('yip')"\n// Delete emoji\n^:e = ""\n// Delete color\n^:c = ""\n// Delete click script\n^:cs = ""\n// Delete click script, view script and emoji\n^d\n// Delete click script, view script, emoji and color\n^dd\n// Return cellIndex (between 0 and 99)\n^ci\n`
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
        <Button onClick={handleClick}>Local Cell</Button>
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

export default LocalCell