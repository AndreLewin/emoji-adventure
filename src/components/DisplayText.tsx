import { useMemo } from "react";
import store from "../store";

const DisplayText: React.FC<{}> = ({ }) => {
  const text1 = store(state => state.text1)
  const text2 = store(state => state.text2)
  const text3 = store(state => state.text3)

  const variables = store(state => state.variables)
  const configs = store(state => state.configs)

  const activeGridId = store(state => state.activeGridId)

  const inventoryText = useMemo<string>(() => {
    const visibleVariables: {
      variable: string,
      displayName?: string
    }[] = []
    for (const [variable, value] of Object.entries(configs)) {
      if (value?.isVisible === true) {
        visibleVariables.push({
          variable,
          displayName: value.displayName
        })
      }
    }

    let inventoryText = ""
    visibleVariables.forEach(v => {
      const { variable, displayName } = v
      const variableGridId = variable.match(/gridId(\d*)/)?.[1] ?? null
      // const variableCellIndex = variable.match(/cellIndex(\d*)/)?.[1] ?? null

      let stripedVariableName = variable
      stripedVariableName = stripedVariableName.replace(/^gridId(\d*)/, "")
      // stripedVariableName = stripedVariableName.replace(/^cellIndex(\d*)/, "")

      // Don't display grid and cell variables outside of their grid
      if (variableGridId !== null && variableGridId !== `${activeGridId}`) {
        return
      }

      const variableValue = variables[v.variable] ?? 0

      const nameToDisplay = displayName ?? stripedVariableName
      inventoryText += `${nameToDisplay}: ${variableValue}\n`
    })
    return inventoryText
  }, [variables, configs, activeGridId])

  return (
    <>
      <div className="container">
        <div className="text1">
          {text1}
        </div>
        <div className="text2">
          {text2}
        </div>
        <div className="text3">
          {text3}
        </div>
        <div className="inventory">
          {inventoryText}
        </div>
      </div>
      <style jsx>
        {`
          .container {
            
          }
        `}
      </style>
    </>
  )
}

export default DisplayText
