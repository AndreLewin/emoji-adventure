import { useCallback, useMemo } from "react"
import store from "../../../store"
import { Tool } from "../ToolSelector"

const ToolSquare: React.FC<{ tool: Tool }> = ({ tool }) => {

  const selectedTool = store(state => state.selectedTool)
  const isToolSelected = useMemo<boolean>(() => {
    return tool.toolName === selectedTool
  }, [selectedTool])

  const set = store(state => state.set)

  const handleClick = useCallback<any>(() => {
    const { toolName } = tool
    // unselect
    if (selectedTool === toolName) {
      set({ selectedTool: "" })
      return
    }

    // some tools can't be selected
    if (toolName === "undo") {
      return
    }

    set({ selectedTool: toolName })
  }, [tool, selectedTool])

  return (
    <>
      <div
        className={`toolSquare ${isToolSelected ? "selected" : ""}`}
        onClick={() => handleClick()}
      >
        {tool.svgIcon}
      </div>
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