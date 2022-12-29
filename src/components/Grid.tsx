import { Grid } from ".prisma/client"
import { Button } from "@mantine/core"
import { useCallback, useMemo, useState } from "react"
import { trpc } from "../utils/trpc"
import Cell from "./Cell"

export type Cell = {
  color: string
  emoji: string
}

export type LocalGrid = Omit<Grid, "createdAt" | "updatedAt" | "id" | "colors" | "emojis"> & {
  colors: string[] // array of 100 strings
  emojis: string[]
}

const defaultLocalGridFactory = (): LocalGrid => {
  return {
    name: "name",
    message: "message",
    backgroundImage: "",
    colors: (new Array(100)).fill(""),
    emojis: (new Array(100)).fill("")
  }
}

const extractCells = (grid: LocalGrid): Cell[] => {
  const { colors, emojis } = grid
  const colorsParsed = colors === null ? (new Array(100)).fill("") : colors as string[]
  const emojisParsed = emojis === null ? (new Array(100)).fill("") : emojis as string[]

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
        if (fetchedGrid === null) {
          setLocalGrid(defaultLocalGridFactory())
        } else {
          setLocalGrid({
            ...fetchedGrid,
            colors: JSON.parse(fetchedGrid!.colors as string) as string[],
            emojis: JSON.parse(fetchedGrid!.emojis as string) as string[],
          })
        }
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
    newLocalGrid.colors[cellId] = newLocalGrid.colors[cellId] === "blue" ? "green" : "blue"
    setLocalGrid(newLocalGrid)
    setIsChangedLocally(true)
  }, [localGrid])

  const upsertGridM = trpc.grid.upsert.useMutation({});

  const [isChangedLocally, setIsChangedLocally] = useState<boolean>(false)

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
      </div>

      <Button onClick={() => upsertGridM.mutate({ id: 1, data: localGrid })} disabled={!isChangedLocally}>
        Save
      </Button>

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