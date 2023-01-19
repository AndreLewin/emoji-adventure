import { Tooltip } from "@mantine/core"
import { useCallback, useMemo } from "react"
import store from "../../../store"
import { Tool } from "../ToolSelector"

const ToolSquare: React.FC<{ tool: Tool }> = ({ tool }) => {

  const selectedTool = store(state => state.selectedTool)
  const isToolSelected = useMemo<boolean>(() => {
    return tool.toolName === selectedTool
  }, [selectedTool])

  const undo = store(state => state.undo)

  const handleClick = useCallback<any>(() => {
    const { toolName } = tool
    // unselect
    if (selectedTool === toolName) {
      store.setState({ selectedTool: "" })
      return
    }

    // some tools can't be selected
    if (toolName === "undo") {
      undo()
      return
    }

    store.setState({ selectedTool: toolName })
  }, [tool, selectedTool])

  return (
    <>
      <Tooltip label={tool.tooltip}>
        <div
          className={`toolSquare ${isToolSelected ? "selected" : ""}`}
          onClick={() => handleClick()}
        >
          {tool.svgIcon}
        </div>
      </Tooltip>
      <style jsx>
        {`
          .toolSquare {
              width: 30px;
              height: 30px;
              border: 1px solid rgba(160,160,160,1);
              padding: 2px 2px 2px 2px;
              /* make the effect of background-color begin only at after margin */
              /* https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip */
              background-clip: content-box;
              cursor: pointer;
              border-radius: 50%;

              display: flex;
              justify-content: center;
              align-items: center;
          }
          .toolSquare.selected {
            border: 3px solid var(--highlighter-blue);
            padding: 2px 2px 2px 2px;
          }
        `}
      </style>
    </>
  )
}

export default ToolSquare