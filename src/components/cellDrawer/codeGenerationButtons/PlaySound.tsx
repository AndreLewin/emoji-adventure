import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const PlaySound: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// import the audio and create the "audio" object (ideally in a On Init script, or an On View executed only one time)
const splash = new Audio('https://cdn.pixabay.com/audio/2021/08/04/audio_65623c4693.mp3')

// play it
splash.play()

// make it available everywhere
#.splash = splash

// now you can play it from all scripts
#.splash.play()`
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
        <Button onClick={handleClick}>Audio</Button>
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

export default PlaySound