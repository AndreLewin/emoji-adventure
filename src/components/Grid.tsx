import { useMemo } from "react"
import { trpc } from "../utils/trpc"

const Grid: React.FC<{}> = ({ }) => {
  const utils = trpc.useContext()

  const allGridsQuery = trpc.grid.findMany.useQuery()
  console.log("allGridsQuery.data | Grid.tsx l6", allGridsQuery.data)

  const allGrids = allGridsQuery.data ?? []

  const cells = (new Array(100)).fill("")

  const updateGridM = trpc.grid.update.useMutation({
    // onMutate is for optimistic updated
    // for nonoptimistic updated: onSuccess (data = response from the back-end)
    async onMutate({ id, data }) {
      // if grid data is already fetched, update data locally
      // TODO: update code for only one (grid.find)
      await utils.grid.findMany.cancel();
      const allGrids = utils.grid.findMany.getData();
      if (!allGrids) return
      utils.grid.findMany.setData(
        undefined,
        allGrids.map((c) => c.id === id ? { ...c, ...data } : c)
      );
    }
  });

  // todo: compute list of cells with local typing
  type Cell = {
    color: string
    emoji: string
  }

  const cellColors = useMemo<string[]>(() => {
    const grid = allGrids?.[0] ?? null
    const colorString = grid?.colors ?? null
    const colors = colorString === null ? (new Array(100)).fill("") : JSON.parse(colorString)
    return colors
  }, [allGrids])


  // todo: useMemo with trpc data???

  return (
    <div>
      <div onClick={() => { updateGridM.mutate({ id: 1, data: { colors: JSON.stringify([...cellColors, "yellow"]) } }) }}>Edit grid</div>
      <div className="container">
        {
          cells.map((c, index) => {
            return (
              <div
                key={`${index}`}
                style={{ "backgroundColor": cellColors[index] }}
              >
                {index}
              </div>
            )
          })
        }
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

export default Grid