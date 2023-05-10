import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const Movement: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// move the content of the first cell of the grid three cells to the right
// _movement({ gridId: 0, cellIndex: 0, code: "RRR"})

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
// #a("I finished the movement. After one second, I will reverse it.")
// await _sleep(1000)
// _movement({ gridId: @gi, cellIndex: ^ci, code: "DDRRUULL" })
// #t("I'm doing the reversed movement")

// you can change the movement after it has started by changing its options object
// const mvtOptions = { gridId: @gi, cellIndex: ^ci, code: "R*", isRound: true }
// _movement(mvtOptions)
// change the speed (delay between each move is shorter than default 500, so faster)
// mvtOptions.delay = 250
// pause then unpause the animation
// mvtOptions.pause = true
// await _sleep(1000)
// mvtOptions.pause = false
// stop the animation (for good)
// mvtOptions.stop = true
// note: if you want to be able to control the animation from an other script, place the controller in a cell, grid or adventure variable
// @.mvtOptions = mvtOptions

// you can use shorthands to automatically target the current cell or grid
// ^mm({ code: "R" })
// @mm({ cellIndex: ^ci, code: "R" })

// if you use ^mm, you can also directly type the code (but then you can't change the other properties)
// ^mm("R")

/*
// use options.content to change the content in movement
^:e = "🦊"
const options = { gridId: 0, cellIndex: 0, code: "R*"}
_movement(options)
await _sleep(2000)
options.content.emoji = "😺"
*/
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