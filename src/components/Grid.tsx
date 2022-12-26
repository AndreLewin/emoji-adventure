import { Grid } from ".prisma/client"
import { useMemo } from "react"
import { trpc } from "../utils/trpc"
import Cell from "./Cell"

export type Cell = {
  color: string
  emoji: string
}

const extractCells = (grid: Grid): Cell[] => {
  const { colors, emojis } = grid
  // TODO: check if colors and emojis respect the format (an array of 100 string stringified)
  const colorsParsed = colors === null ? (new Array(100)).fill("") : JSON.parse(colors) as string[]
  const emojisParsed = emojis === null ? (new Array(100)).fill("") : JSON.parse(emojis) as string[]

  const cells: Cell[] = []
  for (let i = 0; i < 100; i++) {
    const cell = {
      color: colorsParsed[i],
      emoji: emojisParsed[i]
    }
    cells.push(cell)
  }
  return cells
}

const GridComponent: React.FC<{}> = ({ }) => {
  const utils = trpc.useContext()

  const gridQuery = trpc.grid.findUnique.useQuery({ id: 1 })
  const grid = gridQuery.data ?? null

  const cells = grid === null ? (new Array(100)).fill("") : extractCells(grid)

  // TODO: update
  const updateGridM = trpc.grid.update.useMutation({
    // onMutate is for optimistic updated
    // for nonoptimistic updated: onSuccess (data = response from the back-end)
    async onMutate({ id, data }) {
      // if grid data is already fetched, update data locally
      // TODO: update code for only one (grid.find)
      await utils.grid.findUnique.cancel();
      // const allGrids = utils.grid.findMany.getData();
      if (!grid) return
      utils.grid.findUnique.setData(
        { id: 1 },
        { ...grid, ...data }
      );
    }
  });


  // xxx to delete
  const cellColors = useMemo<string[]>(() => {
    const colorString = grid?.colors ?? null
    const colors = colorString === null ? (new Array(100)).fill("") : JSON.parse(colorString)
    return colors
  }, [grid])


  return (
    <div>
      {/* replace following line to use grid variable instead */}
      <div onClick={() => { updateGridM.mutate({ id: 1, data: { colors: JSON.stringify([...cellColors, "yellow"]) } }) }}>Edit grid</div>
      <div className="container">
        {cells.map((c, index) => { return <Cell cell={c} key={index} /> })}
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
    </div>
  )
}

export default GridComponent