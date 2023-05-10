import { useCallback, useMemo } from "react"
import { Cell } from "../../store"
import { evalScript } from "../../utils/evalScript"

const CellViewer: React.FC<{
  cell: Cell,
  cellIndex: number,
  gridId: number,
  areClickSquaresHidden: boolean
}> = ({ cell, cellIndex, gridId, areClickSquaresHidden }) => {
  const handleMouseDown = useCallback<any>((event: MouseEvent) => {
    const { buttons } = event
    if (buttons === 1) {
      if ((cell?.onClickCScript ?? "") !== "") {
        evalScript(cell?.onClickCScript ?? "", { gridId, cellIndex })
      }
    }
  }, [cell])

  const hasAScript = useMemo<boolean>(() => {
    return (cell?.onClickCScript ?? "") !== ""
  }, [cell])

  return (
    <>
      <div
        className={`container ${(hasAScript && !areClickSquaresHidden) ? "gradient-border" : ""}`}
        style={{
          "backgroundColor": cell.color,
          "cursor": (cell?.onClickCScript ?? "") !== "" ? "pointer" : "default"
        }}
        onMouseDown={(e) => handleMouseDown(e)}
        id={`c${cellIndex}`}
      >
        <span id={`e${cellIndex}`}>
          {cell?.emoji ?? ""}
        </span>
      </div>
      <style jsx>
        {`
          .container {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5em;
            width: 40px;
            height: 40px;
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