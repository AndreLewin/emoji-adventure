import ToolSquare from "./toolSelector/ToolSquare"

export type Tool = {
  toolName: string,
  svgIcon: JSX.Element
}

const tools: Tool[] = [{
  toolName: "pencil",
  svgIcon: <svg width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M16.84 2.73c-.39 0-.77.15-1.07.44l-2.12 2.12l5.3 5.31l2.12-2.1c.6-.61.6-1.56 0-2.14L17.9 3.17c-.3-.29-.68-.44-1.06-.44M12.94 6l-8.1 8.11l2.56.28l.18 2.29l2.28.17l.29 2.56l8.1-8.11m-14 3.74L2.5 21.73l6.7-1.79l-.24-2.16l-2.31-.17l-.18-2.32"></path></svg>
}, {
  toolName: "square",
  svgIcon: <svg width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.413-.587Q3 19.825 3 19V5q0-.825.587-1.413Q4.175 3 5 3h14q.825 0 1.413.587Q21 4.175 21 5v14q0 .825-.587 1.413Q19.825 21 19 21Z"></path></svg>
}, {
  toolName: "eraser",
  svgIcon: <svg width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="M216 207.8h-85.7l34.8-34.7l56.6-56.6a24.1 24.1 0 0 0 0-33.9l-45.3-45.3a24 24 0 0 0-33.9 0L85.9 93.9l-56.6 56.6a24 24 0 0 0 0 33.9l37.1 37.1a8.1 8.1 0 0 0 5.7 2.3H216a8 8 0 0 0 0-16ZM153.8 48.6a8.1 8.1 0 0 1 11.3 0l45.2 45.3a7.9 7.9 0 0 1 0 11.3l-50.9 50.9l-56.5-56.6Z"></path></svg>
}, {
  toolName: "undo",
  svgIcon: <svg width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M8 19q-.425 0-.713-.288Q7 18.425 7 18t.287-.712Q7.575 17 8 17h6.1q1.575 0 2.737-1Q18 15 18 13.5T16.837 11q-1.162-1-2.737-1H7.8l1.9 1.9q.275.275.275.7q0 .425-.275.7q-.275.275-.7.275q-.425 0-.7-.275L4.7 9.7q-.15-.15-.213-.325Q4.425 9.2 4.425 9t.062-.375Q4.55 8.45 4.7 8.3l3.6-3.6q.275-.275.7-.275q.425 0 .7.275q.275.275.275.7q0 .425-.275.7L7.8 8h6.3q2.425 0 4.163 1.575Q20 11.15 20 13.5q0 2.35-1.737 3.925Q16.525 19 14.1 19Z" /></svg>
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