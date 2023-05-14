import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const DisplayOnCondition: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// put the following line in On Init
@$.showFox.push((v) => {
  if (v) {
    ^:e = "🦊"
    ^:cs = "_a('Yip yap!')"
  }
})

// try the following line in an other cell of the same grid
@.showFox = true`
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