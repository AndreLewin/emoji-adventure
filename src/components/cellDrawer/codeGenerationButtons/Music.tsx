import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const Music: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// play music (automatically loops)
_playMusic("https://cdn.pixabay.com/audio/2023/04/03/audio_6700efb297.mp3")

// warning: if you put _playMusic in On Init or in the On View of the first grid, it might not work. This is because web browsers prevent audio to be played on websites where the user still has not interacted (clicked)

// On View is a good place to put _playMusic
// if the provided URL string is the same as the already active music, the music will just continue
// you can see the active music that way:
_l(_activeMusic)

// play an other music after some time (only one music can be played at the same time)
await _sleep(3000)
_playMusic("https://cdn.pixabay.com/audio/2023/03/17/audio_555bd9964f.mp3")

// pause the music
_pauseMusic()

// resume the music where it was paused
_resumeMusic()

// stop the music
_playMusic("")

// restart the music from the start
_playMusic("")
_playMusic("https://cdn.pixabay.com/audio/2023/03/17/audio_555bd9964f.mp3")

// you can find free to use music in https://pixabay.com/music/search/
// open the Network tab of your web browser to find the URL of the mp3 files    
`
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
        <Button onClick={handleClick}>Music</Button>
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

export default Music