import { Button } from "@mantine/core"
import { Dispatch, SetStateAction, useCallback } from "react"

const AskForName: React.FC<{ setScript: Dispatch<SetStateAction<string>> }> = ({ setScript }) => {

  const handleClick = useCallback<any>(() => {
    const script = `const name = window.prompt("What is your name?")\nalert(\`Hello \$\{name\}!\`)`
    setScript(s => `${s}${s === "" ? "" : "\n"}${script}`)
  }, [])

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