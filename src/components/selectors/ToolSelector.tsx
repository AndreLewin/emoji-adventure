import store, { Store } from "../../store"
import ToolSquare from "./toolSelector/ToolSquare"
import { useHotkeys } from '@mantine/hooks'
import { useEffect } from "react"

export type Tool = {
  toolName: Store["selectedTool"],
  tooltip: string,
  svgIcon: JSX.Element
}

export const tools: Tool[] = [{
  toolName: "undo",
  tooltip: "Undo",
  svgIcon:
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-back-up" width="1em" height="1em" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1" />
    </svg>
}, {
  toolName: "pencil",
  tooltip: "Click to draw",
  svgIcon:
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-pencil" width="1em" height="1em" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />
      <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
    </svg>
}, {
  toolName: "square",
  tooltip: "Click then release to draw square",
  svgIcon:
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-square" width="1em" height="1em" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
}, {
  toolName: "bucket",
  tooltip: "Click to fill",
  svgIcon:
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-bucket-droplet" width="1em" height="1em" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 16l1.465 1.638a2 2 0 1 1 -3.015 .099l1.55 -1.737z" />
      <path d="M13.737 9.737c2.299 -2.3 3.23 -5.095 2.081 -6.245c-1.15 -1.15 -3.945 -.217 -6.244 2.082c-2.3 2.299 -3.231 5.095 -2.082 6.244c1.15 1.15 3.946 .218 6.245 -2.081z" />
      <path d="M7.492 11.818c.362 .362 .768 .676 1.208 .934l6.895 4.047c1.078 .557 2.255 -.075 3.692 -1.512c1.437 -1.437 2.07 -2.614 1.512 -3.692c-.372 -.718 -1.72 -3.017 -4.047 -6.895a6.015 6.015 0 0 0 -.934 -1.208" />
    </svg>
}, {
  toolName: "colorPicker",
  tooltip: "Pick color",
  svgIcon:
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-color-picker" width="1em" height="1em" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M11 7l6 6" />
      <path d="M4 16l11.7 -11.7a1 1 0 0 1 1.4 0l2.6 2.6a1 1 0 0 1 0 1.4l-11.7 11.7h-4v-4z" />
    </svg>
}, {
  toolName: "emojiPicker",
  tooltip: "Pick emoji",
  svgIcon:
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-rubber-stamp" width="1em" height="1em" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M21 17.85h-18c0 -4.05 1.421 -4.05 3.79 -4.05c5.21 0 1.21 -4.59 1.21 -6.8a4 4 0 1 1 8 0c0 2.21 -4 6.8 1.21 6.8c2.369 0 3.79 0 3.79 4.05z" />
      <path d="M5 21h14" />
    </svg>
}, {
  toolName: "eraser",
  tooltip: "Empty cell",
  svgIcon:
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eraser" width="1em" height="1em" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9.2 9.3" />
      <path d="M18 13.3l-6.3 -6.3" />
    </svg>
}]

const ToolSelector: React.FC<{}> = ({ }) => {
  const undo = store(state => state.undo)

  useEffect(() => {
    const listenKeyCode = (event: KeyboardEvent) => {
      const { altKey, code } = event
      // TODO: listen to key only if drawer and modals are closed
      // an altKey check if the previous condition is too hard
      // if (!altKey) return

      const toolIndex =
        code === "Backquote" ? 0 :
          code === "Digit1" ? 1 :
            code === "Digit2" ? 2 :
              code === "Digit3" ? 3 :
                code === "Digit4" ? 4 :
                  code === "Digit5" ? 5 :
                    code === "Digit6" ? 6 :
                      code === "Digit7" ? 7 :
                        code === "Digit8" ? 8 :
                          code === "Digit9" ? 9 : null

      if (toolIndex === 0) {
        undo()
        return
      }

      if (toolIndex === null) return
      const selectedTool = tools?.[toolIndex] ?? null
      if (selectedTool === null) return
      store.setState({ selectedTool: selectedTool.toolName })
    }

    document.addEventListener("keydown", (event) => listenKeyCode(event))
    return document.removeEventListener("keydown", (event) => listenKeyCode(event))
  }, [])

  return (
    <>
      <div className="container">
        {tools.map((t, i) => { return <ToolSquare tool={t} key={i} /> })}
      </div>
      <style jsx>
        {`
          .container {
            width: 328px;
            height: 32px;
            display: grid;
            gap: 2px 2px;
            grid-template-columns: repeat(10, 1fr)
          }
        `}
      </style>
    </>
  )
}

export default ToolSelector
