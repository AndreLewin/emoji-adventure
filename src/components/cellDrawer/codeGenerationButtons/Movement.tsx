import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const Movement: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// move the content of the first cell of the grid three cells to the right
// _movement({ gridId: 0, cellIndex: 0, code: "RRR"})

// move the content of the first cell to the fourth cell (cellIndex 3)
// _movement({ gridId: 0, cellIndex: 0, target: 3})

// move the content of the current cell down, then left, then up
// _movement({ gridId: @gi, cellIndex: ^ci, code: "DLU"})

// use the letter W to wait, X to remove the content
// _movement({ gridId: @gi, cellIndex: ^ci, code: "RRWRRX"})

// by default, each steps takes 500 milliseconds, you can change it like this
// _movement({ gridId: @gi, cellIndex: ^ci, code: "RRRRR", delay: 100 })

// you can loop a movement by using *
// _movement({ gridId: @gi, cellIndex: ^ci, code: "RRDDLLUU*" })

// if a content goes outside the grid, it will disappear, unless you use the isRound property
// _movement({ gridId: @gi, cellIndex: ^ci, code: "R*", isRound: true })

// if you want the color of the cell to move too, add the moveColor property
// _movement({ gridId: @gi, cellIndex: ^ci, code: "RRR", moveColor: true })

// by default, _movement does not block the execution of the rest of the script
// if you want to execute code only when a movement is finished, you have to await it
// await _movement({ gridId: @gi, cellIndex: ^ci, code: "RRDDLLUU" })
// _a("I finished the movement. After one second, I will reverse it.")
// await _sleep(1000)
// _movement({ gridId: @gi, cellIndex: ^ci, code: "DDRRUULL" })
// _t("I'm doing the reversed movement")

// you can use shorthands to automatically target the current cell or grid
// ^m({ code: "R" })
// @m({ cellIndex: ^ci, code: "R" })

// if you use ^m, instead of an object, you can pass a code string or a target cellIndex directly (but then you can't use the other options)
// ^m("R")
// ^m(81)

/*
// you can change a movement after it has started by putting its options object into a variable
const mvtOptions = {code: "R*", isRound: true }
^m(mvtOptions)

// change the speed (delay between each move is shorter than default 500, so faster)
// mvtOptions.delay = 250

// change the content of the movement
mvtOptions.content.emoji = "😺"

// pause then unpause the movement
mvtOptions.pause = true
await _sleep(1000)
mvtOptions.pause = false

// stop the movement (the content will stay where it already is)
// mvtOptions.stop = true

// remove the movement (the content will disappear)
// mvtOptions.remove = true

// pause the movement if the grid where the movement is active is left
// it will automatically be unpaused when the player returns on the grid
// mvtOptions.pauseIfGridLeft = true
// stop (or remove) the movement if the grid where the movement is active is left
// mvtOptions.stopIfGridLeft = true
// mvtOptions.removeIfGridLeft = true

// note: if you want to be able to control the movement from an other script, place the controller in a cell, grid or adventure variable
#.mvtOptions = mvtOptions
*/

// note: all active movements (not finished, stopped or removed) have their options in the window._activeMovements array
// tip: use the browser console to quickly change the values of the options object and see what the effects are
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
        <Button onClick={handleClick}>Movement</Button>
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

export default Movement