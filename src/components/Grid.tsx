import { useCallback, useMemo, useState } from "react"
import store, { defaultGridFactory, Grid } from "../store"
import Cell from "./Cell"

const GridComponent: React.FC<{}> = ({ }) => {
  const grids = store(state => state.grids)
  const grid = useMemo<Grid>(() => {
    return grids?.[0] ?? defaultGridFactory()
  }, [grids])

  const selectedTool = store(state => state.selectedTool)

  // TODO: activate button to save to remote
  const [isChangedLocally, setIsChangedLocally] = useState<boolean>(false)

  const set = store(state => state.set)
  // avoid painting with the square tool from an outdated click
  const handleMouseLeave = useCallback<any>(() => {
    set({ mouseDownCellIndex: null })
  }, [])

  return (
    <div>
      <div
        className="container"
        style={{ "cursor": selectedTool !== '' ? "pointer" : "default" }}
        onMouseLeave={() => handleMouseLeave()}
      >
        {grid.cells.map((c, index) => { return <Cell cell={c} key={index} index={index} /> })}
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