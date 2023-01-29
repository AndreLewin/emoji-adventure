import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const GlobalVariable: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const onClickScript = `if (window._g.counter === undefined) window._g.counter = 0\nwindow._g.counter += 1\nalert(\`Number of times you clicked: \${window._g.counter}!\`)`
    updateCellWithAppend({
      gridId,
      cellIndex,
      cellUpdate: { onClickScript }
    })
  }, [gridId, cellIndex])

  return (
    <>
      <span className='container'>
        <Button onClick={handleClick}>Global variable (deprecated)</Button>
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

export default GlobalVariable