import { useEffect, useMemo, useRef } from "react";
import store from "../store";
import { Tool, tools } from "./selectors/ToolSelector";

// https://codepen.io/GabEsu/pen/rKOWBw
const Cursor: React.FC<{}> = ({ }) => {
  const cursorRef = useRef<HTMLDivElement>(null)
  const isToolCursorVisible = store(state => state.isToolCursorVisible)
  const selectedTool = store(state => state.selectedTool)

  const matchedTool = useMemo<Tool | null>(() => {
    return tools.find(t => t.toolName === selectedTool) ?? null
  }, [selectedTool])

  useEffect(() => {
    const setCursorToMouse = (event: MouseEvent) => {
      if (cursorRef === null) return
      if (cursorRef.current === null) return
      const xPosition = event.pageX - cursorRef.current.clientWidth / 2 + "px";
      const yPosition = event.pageY - cursorRef.current.clientHeight / 2 + "px";
      cursorRef.current.style.transform =
        `translate(${xPosition},${yPosition})`;
    }

    document.addEventListener("mousemove", (event) => setCursorToMouse(event))
    return document.removeEventListener("mousemove", (event) => setCursorToMouse(event))
  }, [cursorRef])

  return (
    <>
      <div
        id='cursor'
        ref={cursorRef}
        style={{ display: isToolCursorVisible ? "inherit" : "none" }}
      >
        {matchedTool?.svgIcon ?? <></>}
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

export default Cursor