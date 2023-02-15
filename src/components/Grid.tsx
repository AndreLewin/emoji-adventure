import { useCallback, useMemo } from "react"
import store, { Grid } from "../store"
import Cell from "./Cell"

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
        <div className="image" style={{ backgroundImage: `url(${grid.backgroundImage ?? ""})` }}>
          {grid.cells.map((c, index) => {
            return <Cell cell={c} key={index} cellIndex={index} gridId={grid.id} />
          })}
        </div>
      </div>
      <style jsx>
        {`
          .container {
            outline: 0.5px solid;
            outline-color: rgba(50, 115, 220, 0.1);
            width: fit-content;
            /* disable selecting text when click held */
            user-select: none;

            /* tiled background */
            /* https://www.magicpattern.design/tools/css-backgrounds */
            background-image:  repeating-linear-gradient(45deg, #e1e1e1 25%, transparent 25%, transparent 75%, #e1e1e1 75%, #e1e1e1), repeating-linear-gradient(45deg, #e1e1e1 25%, #f6f6f6 25%, #f6f6f6 75%, #e1e1e1 75%, #e1e1e1);
            background-position: 0 0, 8px 8px;
            background-size: 16px 16px;
          }

          .image {
            display: grid;
            grid-template-columns: repeat(10, 40px);
            grid-auto-rows: 40px;

            background-size: contain;
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