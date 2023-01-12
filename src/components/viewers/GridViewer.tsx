import { useMemo } from "react"
import store, { Grid } from "../../store"
import CellViewer from "./CellViewer"

const GridViewer: React.FC<{}> = ({ }) => {
  const grids = store(state => state.grids)
  const activeGridId = store(state => state.activeGridId)
  const grid = useMemo<Grid>(() => {
    return grids.find(g => g.id === activeGridId)!
  }, [grids, activeGridId])

  return (
    <div>
      <div className="container"
        onContextMenu={(e) => { e.preventDefault() }}
      >
        {grid.cells.map((c, index) => {
          return <CellViewer cell={c} key={index} />
        })}
      </div>

      <style jsx>
        {`
          .container {
            display: grid;
            grid-template-columns: repeat(10, 40px);
            grid-auto-rows: 40px;
            outline-color: rgba(50, 115, 220, 0.1);
            width: fit-content;
            user-select: none; {/* disable selecting text when click held */}
          }

          .container > * {
            outline-color: rgba(50, 115, 220, 0.1);
          }
        `}
      </style>
    </div>
  )
}

export default GridViewer