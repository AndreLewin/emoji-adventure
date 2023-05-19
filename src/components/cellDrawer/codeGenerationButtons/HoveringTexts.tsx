import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const HoveringTexts: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// create a new hovering text (in gridId 0)
// this function returns the hoveringTextIndex of the newly created hovering text
_createHoveringText({
  gridId: 0,
  hoveringText: {
    x: 100,
    y: 50,
    text: "this text hovers the grid"
  }
})

// get the list of hovering texts (in gridId 0)
_l(#:0hoveringTexts)
// this is equivalent to console.log(_gs().grids[0].hoveringTexts)
// you can use it to find the hoveringTextIndex of a specific hovering text
// (the first element of the array is hoveringTextIndex 0) 

// edit an existing hovering text
_updateHoveringText({
  gridId: 0,
  hoveringTextIndex: 0,
  hoveringTextUpdate: {
    x: 110,
    y: 60,
    text: "this text is actually better"
  }
})

// delete an existing hovering text
_deleteHoveringText({
  gridId: 0,
  hoveringTextIndex: 0
})`
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
        <Button onClick={handleClick}>Hovering texts</Button>
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

export default HoveringTexts