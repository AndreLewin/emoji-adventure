import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const DisplayOnCondition: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// put the following line in On Init\n@$.showFox = v => v && (^:e = "🦊", ^:cs = "#(Yip yap!)")\n\n// try the following line in an other cell of the same grid\n@.showFox = true\n`
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
        <Button onClick={handleClick}>Display on condition</Button>
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

export default DisplayOnCondition