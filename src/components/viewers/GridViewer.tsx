import { useEffect, useMemo } from "react"
import store, { Grid } from "../../store"
import { evalScript } from "../../utils/evalScript"
import CellViewer from "./CellViewer"

const GridViewer: React.FC<{}> = ({ }) => {
  const grids = store(state => state.grids)
  const activeGridId = store(state => state.activeGridId)
  const grid = useMemo<Grid>(() => {
    return grids.find(g => g.id === activeGridId)!
  }, [grids, activeGridId])
  const isInitFinished = store(state => state.isInitFinished)

  useEffect(() => {
    if (!isInitFinished) return

    // execute view scripts
    // grid
    evalScript(grid.onViewGScript, { gridId: grid.id })
    // cells
    grid.cells.forEach((c, index) => evalScript(c.onViewCScript, { gridId: grid.id, cellIndex: index }))
  }, [grid, isInitFinished])

  return (
    <div>
      <div className="container"
        style={{ backgroundImage: `url(${grid.backgroundImage ?? ""})` }}
        onContextMenu={(e) => { e.preventDefault() }}
      >
        {grid.cells.map((c, index) => {
          return <CellViewer cell={c} key={index} gridId={activeGridId} cellIndex={index} />
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
            /* disable selecting text when click held */
            user-select: none;

            background-size: contain;
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