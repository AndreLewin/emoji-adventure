import { useCallback, useMemo, useState } from "react"
import store, { defaultGridFactory, Grid } from "../store"
import Cell from "./Cell"

const GridComponent: React.FC<{}> = ({ }) => {
  const set = store(state => state.set)
  const grids = store(state => state.grids)
  const grid = useMemo<Grid>(() => {
    return grids?.[0] ?? defaultGridFactory()
  }, [grids])

  const updateGrid = useCallback<any>((cellId: number) => {
    const newGrid = JSON.parse(JSON.stringify(grid))
    newGrid.cells[cellId].color = newGrid.cells[cellId].color === "blue" ? "green" : "blue"
    const [firstElement, ...rest] = grids

    set({ grids: [newGrid, ...rest] })
    setIsChangedLocally(true)
  }, [grid])

  // TODO: activate button to save to remote
  const [isChangedLocally, setIsChangedLocally] = useState<boolean>(false)

  return (
    <div>
      grid
      {JSON.stringify(grid)}
      ---
      <div onClick={() => { updateGrid(1) }}>Edit grid</div>
      <div className="container">
        {grid.cells.map((c, index) => { return <Cell cell={c} key={index} /> })}
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