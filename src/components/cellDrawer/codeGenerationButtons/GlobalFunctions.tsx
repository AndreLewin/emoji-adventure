import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const GlobalFunctions: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// Global functions are the functions starting with _ that can be used directly in the scripts and in the console of your browser

//// await for 200 milliseconds
// await _sleep(200)

// execute a script within a specific context
// _evalScript("console.log('cellContext')", { gridId: 0, cellIndex: 0 })
// _evalScript("console.log('gridContext')", { gridId: 0 })
// _evalScript("console.log('adventureContext')", {})

//// get a random number between 5 and 10 included
// const randomNumber = _random(5, 10)

//// get cell position from cell index
// const position = _getCellPositionFromCellIndex(0) // { line: 1, column: 1 }
// const position = _getCellPositionFromCellIndex(9) // { line: 1, column: 10 }
//// get cell index from cell position
// const index = _getCellIndexFromCellPosition({ line: 1, column: 1}) // 0
// const index = _getCellIndexFromCellPosition({ line: 10, column: 1}) // 90

//// get relative cell index
// const index = _getRelativeCellIndex({ cellIndex: 0, direction: "down", distance: 1}) // 10
// const index = _getRelativeCellIndex({ cellIndex: 0, direction: "right", distance: 8}) // 8
// const index = _getRelativeCellIndex({ cellIndex: 23, direction: "left", distance: 3 }) // null (out of grid)
// const index = _getRelativeCellIndex({ cellIndex: 23, direction: "up", distance: 4, isRound: true}) // 83

//// display text at the first position
// _t("Text position 1")
// _t("Text with an other animation from Animate.css", "shakeY")
//// display text at the second position
// _tt("Text position 2")
//// display text at the third position
// _ttt("Text position 3)
//// get from the zustand store (equivalent to window._store.getState)
// _gs()
//// set to the zustand store (equivalent to window._store.setState)
// _ss({ text1: "kat" })
//// alert (equivalent to window.alert)
// _a("hello world")
//// alert delayed (so it appears after the grid is loaded for example) (equivalent to await _sleep(10); window.alert)
// _ad("saluton mondo")
//// prompt (equivalent to window.prompt)
// _p("Do you like foxes?")
//// confirm (equivalent to window.confirm)
// _c("Are you sure you want to become a fox? This is irreversible!")
//// log (equivalent to window.console.log)
// _l(^:)
//// move to grid
// _g(0)

// All functions from the Zustand store were also added to the window as global functions
// They are functions like _createGrid, _floodFill, _getCell, _updateCell and the mighty _set that can change almost any data in the application
// since there is still no documentation, you should look at the code source on Github to see what kind of property they take and what they do
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
        <Button onClick={handleClick}>Global functions</Button>
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

export default GlobalFunctions