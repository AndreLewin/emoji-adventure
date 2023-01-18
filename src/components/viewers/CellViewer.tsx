import { useCallback, useMemo } from "react"
import { Cell } from "../../store"

const CellViewer: React.FC<{ cell: Cell }> = ({ cell }) => {
  const handleMouseDown = useCallback<any>((event: MouseEvent) => {
    const { buttons } = event
    if (buttons === 1) {
      if (cell.script !== "") {
        eval(cell.script)
      }
    }
  }, [cell])

  const hasAScript = useMemo<boolean>(() => {
    return cell.script !== ""
  }, [cell.script])

  return (
    <>
      <div
        className={`container ${hasAScript ? "gradient-border" : ""}`}
        style={{
          "backgroundColor": cell.color,
          "cursor": cell.script !== "" ? "pointer" : "default"
        }}
        onMouseDown={(e) => handleMouseDown(e)}
      >
        {cell.emoji}
      </div>
      <style jsx>
        {`
          .container {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5em;
          }

          .gradient-border {
            border: 3px solid;
            border-image-slice: 1;
            border-width: 3px;
            border-image-source: linear-gradient(to right, #d53a9d, #3593f7);
          }
        `}
      </style>
    </>
  )
}

export default CellViewer