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

// by default, _movement does not block the execution of the rest of the script
// if you want to execute code only when a movement is finish, you have to await it
// await _movement({ gridId: @gi, cellIndex: ^ci, code: "RRDDLLUU" })
// #a("I finished the movement. After one second, I will reverse it.")
// await _sleep(1000)
// _movement({ gridId: @gi, cellIndex: ^ci, code: "DDRRUULL" })
// #t("I'm doing the reversed movement")

// you can use shorthands to automatically target the current cell or grid
// WIP`
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