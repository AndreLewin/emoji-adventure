import { Grid } from ".prisma/client"
import { useCallback, useMemo, useState } from "react"
import { trpc } from "../utils/trpc"
import Cell from "./Cell"

export type Cell = {
  color: string
  emoji: string
}

export type LocalGrid = Omit<Grid, "createdAt" | "updatedAt" | "id">

const defaultLocalGridFactory = (): LocalGrid => {
  return {
    name: "name",
    message: "message",
    backgroundImage: "",
    colors: JSON.stringify((new Array(100)).fill("")),
    emojis: JSON.stringify((new Array(100)).fill(""))
  }
}

const extractCells = (grid: LocalGrid): Cell[] => {
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

  const [localGrid, setLocalGrid] = useState<LocalGrid>(defaultLocalGridFactory())
  const [isAlreadySynced, setIsAlreadySynced] = useState<boolean>(false)

  const gridQuery = trpc.grid.findUnique.useQuery({ id: 1 }, {
    onSuccess: (fetchedGrid) => {
      if (!isAlreadySynced) {
        setLocalGrid(fetchedGrid ?? defaultLocalGridFactory())
        setIsAlreadySynced(true)
      }
    }
  })

  const { status } = gridQuery

  const cells = useMemo<Cell[]>(() => {
    return extractCells(localGrid)
  }, [localGrid])

  const updateLocalGrid = useCallback<any>((cellId: number) => {
    const newLocalGrid = JSON.parse(JSON.stringify(localGrid))
    const colors = JSON.parse(newLocalGrid.colors ?? JSON.stringify((new Array(100)).fill("")))
    colors[cellId] = colors[cellId] === "blue" ? "green" : "blue"
    newLocalGrid.colors = JSON.stringify(colors)
    setLocalGrid(newLocalGrid)
  }, [localGrid])

  const updateGridM = trpc.grid.update.useMutation({
    // onMutate is for optimistic updated
    // for nonoptimistic updated: onSuccess (data = response from the back-end)
    async onMutate({ id, data }) {
      // if grid data is already fetched, update data locally
      // TODO: update code for only one (grid.find)
      await utils.grid.findUnique.cancel();
      // const allGrids = utils.grid.findMany.getData();
      if (!remoteGrid) return
      utils.grid.findUnique.setData(
        { id: 1 },
        { ...remoteGrid, ...data }
      );
    }
  });

  if (status !== "success") return <div>Loading...</div>

  return (
    <div>
      localGrid
      {JSON.stringify(localGrid)}
      ---
      {/* replace following line to use grid variable instead */}
      <div onClick={() => { updateLocalGrid(1) }}>Edit grid</div>
      {/* <div onClick={() => { updateGridM.mutate({ id: 1, data: { colors: JSON.stringify([...cellColors, "yellow"]) } }) }}>Edit grid</div> */}
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