import { Button } from "@mantine/core"
import { Dispatch, SetStateAction, useCallback } from "react"

const GlobalVariable: React.FC<{ setScript: Dispatch<SetStateAction<string>> }> = ({ setScript }) => {

  const handleClick = useCallback<any>(() => {
    const script = `if (window._g.counter === undefined) window._g.counter = 0\nwindow._g.counter += 1\nalert(\`Number of times you clicked: \${window._g.counter}!\`)`
    setScript(s => `${s}${s === "" ? "" : "\n"}${script}`)
  }, [])

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