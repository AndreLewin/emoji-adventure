import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const Animations: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// you can animate anything with the _animate global function

// the first parameter is a CSS selector
// you can target the first Cell with "#c0" to the last Cell with "#c99"
// you can target the emoji in first cell with "#e0" to the one in the last one with "#e99"

// the second parameter is the name of the animation
// you can see the list of CSS animations there: https://animate.style/

// the optional third parameter is an array of strings representing extra CSS classes from animate.style (you don't need to copy 'animate__' because it's automatically added for you)

// make a hand swing in the second cell
@:1e = "👋"
_animate("#e1", "wobble")

// make a fox appear with "bounceIn" in the current Cell 
^:e = "🦊"
_animate("#e^ci", "bounceIn")

// make the hand animation faster
@:2e = "👋"
_animate("#e2", "wobble", ["fast"])

// make the hand animation repeat
@:3e = "👋"
_animate("#e3", "wobble", ["repeat-2"])

// you can use _a instead of _animate. Faster to type :)`
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
        <Button onClick={handleClick}>Animations</Button>
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

export default Animations