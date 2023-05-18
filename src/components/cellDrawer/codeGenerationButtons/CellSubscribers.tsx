import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const CellSubscribers: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// A cell subscriber is a function that is executed when the value of a cell is changed.
// This can happen when a move or a movement happens to the cell, or if you changed it dynamically using Local Cell, Grid or Adventure shorthands.
// In the editor, you can trigger the subscribers by using the Click to draw tool (it might not work with the other tools)

const cellSubscriber = (newValue, oldValue) => {
  console.log("The cell subscriber has been triggered")
  console.log("newValue", newValue)
  console.log("oldValue", oldValue)
}

// add the subscriber to the current cell
^$$.push(cellSubscriber)

// add the subscriber to the cellIndex 1 (second cell) in current grid
@$$1.push(cellSubscriber)

// add the subscriber to the cellIndex 2 of gridId 0
// #$$0_2 is equivalent to _cellSubscriberProxy._0_2
#$$0_2.push(cellSubscriber)

// see the list of cell subscribers
console.log(^$$)

// remove the last subscriber added
^$$.pop()

// cell subscribers can also be async functions (so you can use "await" inside them)
// each subscriber is await-ed before the next one in the array list is executed
^$$.push(async () => {
  await _sleep(2000)
  console.log("this log will appear 2 seconds after the cell is changed")
})
^$$.push(async () => {
  await _sleep(3000)
  console.log("this log will appear 5 seconds (2 + 3 seconds) after the cell is changed")
})
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
        <Button onClick={handleClick}>Cell subscribers</Button>
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

export default CellSubscribers