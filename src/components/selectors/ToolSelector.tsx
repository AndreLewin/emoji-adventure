import { Store } from "../../store"
import ToolSquare from "./toolSelector/ToolSquare"

export type Tool = {
  toolName: Store["selectedTool"],
  svgIcon: JSX.Element
}

const tools: Tool[] = [{
  toolName: "pencil",
  svgIcon:
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-pencil" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />
      <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
    </svg>
}, {
  toolName: "square",
  svgIcon:
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-square" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
}, {
  toolName: "colorPicker",
  svgIcon:
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-color-picker" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M11 7l6 6" />
      <path d="M4 16l11.7 -11.7a1 1 0 0 1 1.4 0l2.6 2.6a1 1 0 0 1 0 1.4l-11.7 11.7h-4v-4z" />
    </svg>
}, {
  toolName: "emojiPicker",
  svgIcon:
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-rubber-stamp" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M21 17.85h-18c0 -4.05 1.421 -4.05 3.79 -4.05c5.21 0 1.21 -4.59 1.21 -6.8a4 4 0 1 1 8 0c0 2.21 -4 6.8 1.21 6.8c2.369 0 3.79 0 3.79 4.05z" />
      <path d="M5 21h14" />
    </svg>
}, {
  toolName: "eraser",
  svgIcon:
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eraser" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9.2 9.3" />
      <path d="M18 13.3l-6.3 -6.3" />
    </svg>
}, {
  toolName: "undo",
  svgIcon:
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-back-up" width="1em" height="1em" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1" />
    </svg>
}]

const ToolSelector: React.FC<{}> = ({ }) => {

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