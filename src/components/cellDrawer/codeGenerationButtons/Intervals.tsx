import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const Intervals: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// you can use intervals for code that needs to be executed every x milliseconds
// for example, this code will alternate the emoji of the current cell every second

const alternateEmoji = () => ^:e = (^:e === "🦊" ? "🧡" : "🦊")
// setInterval(alternateEmoji, 1000)

// however, if you run the code like this (with setInterval(alternateEmoji, 1000) uncommented),
// the interval will never stop, which is problematic if you have a lot of them
// a solution is to do it like this:

// _gridIntervals.push(setInterval(alternateEmoji, 1000))

// window._gridIntervals is a global array for intervals
// when _g (the command for going to an other grid) is used, all "gridIntervals" will be cleared (deleted)

// a shortcut for "_gridIntervals.push(setInterval(alternateEmoji, 1000))" is the following:
_i(alternateEmoji)
// the default duration is 1000 ms, you can change it by providing a second parameter

// you can then do oneliners like this one
// _i(() => ^:e = (^:e === "🦊" ? "🧡" : "🦊"))

// by the way, if you want the emoji to start alternating again when the player goes back to this grid, make sure to place this script in the On View tab!`
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
        <Button onClick={handleClick}>Intervals</Button>
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

export default Intervals