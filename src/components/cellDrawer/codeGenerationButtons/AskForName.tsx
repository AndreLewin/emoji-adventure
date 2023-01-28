import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const AskForName: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `const name = window.prompt("What is your name?")\nalert(\`Hello \$\{name\}!\`)`
    updateCellWithAppend({
      gridId,
      cellIndex,
      cellUpdate: { script }
    })
  }, [gridId, cellIndex])

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