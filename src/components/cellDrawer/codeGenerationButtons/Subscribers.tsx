import { Button } from "@mantine/core"
import { useCallback } from "react"
import store from "../../../store"

const Subscribers: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {
  const activeCScriptTab = store(state => state.activeCScriptTab)
  const updateCellWithAppend = store(state => state.updateCellWithAppend)

  const handleClick = useCallback<any>(() => {
    const script = `// A variable subscriber is a function that is executed when the value of a variable is changed.
// To add a subscriber to a variable, you have to put $ after the context selector (#, @ or ^) and the dot, and then push to the array.
// Example: add a subscriber to the variable #.score, display "you won" if the value is >= 3.

#$.score.push(v => v >= 3 && #a("you won"))

// Try it by running #.score++ several times in an other script.

// You can get the old value by pushing a function with two parameters:
#$.score.push((newValue, oldValue) => {
  console.log("The score was ", oldValue)
  console.log("The score is now ", newValue)
})

// See the list of subscribers
console.log(#$.score)

// Remove the last subscriber added
#$.score.pop()
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
        <Button onClick={handleClick}>Variable subscribers</Button>
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

export default Subscribers