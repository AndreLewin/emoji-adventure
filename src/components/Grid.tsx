import { useCallback, useMemo, useState } from "react"
import store, { Grid } from "../store"
import Cell from "./Cell"
import Cursor from "./Cursor"

const GridComponent: React.FC<{}> = ({ }) => {
  const grids = store(state => state.grids)
  const activeGridId = store(state => state.activeGridId)
  const grid = useMemo<Grid>(() => {
    return grids.find(g => g.id === activeGridId)!
  }, [grids, activeGridId])

  const selectedTool = store(state => state.selectedTool)

  const handleMouseLeave = useCallback<any>(() => {
    // avoid painting with the square tool from an outdated click
    store.setState({ mouseDownCellIndex: null })
    // hide cursor of the selected tool
    store.setState({ isToolCursorVisible: false })
  }, [])

  const handleMouseEnter = useCallback<any>(() => {
    // show cursor of the selected tool
    store.setState({ isToolCursorVisible: true })
  }, [])

  return (
    <div>
      <div
        className="container"
        style={{ "cursor": selectedTool !== '' ? "pointer" : "default" }}
        onMouseLeave={() => handleMouseLeave()}
        onMouseEnter={() => handleMouseEnter()}
        onContextMenu={(e) => { e.preventDefault() }}
      >
        {grid.cells.map((c, index) => {
          return <Cell cell={c} key={index} cellIndex={index} gridId={grid.id} />
        })}
      </div>
      <style jsx>
        {`
          .container {
            display: grid;
            grid-template-columns: repeat(10, 40px);
            grid-auto-rows: 40px;
            outline: 0.5px solid;
            outline-color: rgba(50, 115, 220, 0.1);
            width: fit-content;
            user-select: none; {/* disable selecting text when click held */}
          }

          .container > * {
            outline: 0.5px solid;
            outline-color: rgba(50, 115, 220, 0.1);
          }
        `}
      </style>
    </div>
  )
}

export default GridComponent