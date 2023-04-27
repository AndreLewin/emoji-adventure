import { TextInput } from "@mantine/core";
import { useMemo } from "react";
import store, { Grid } from "../../store";

const GridInfoViewer: React.FC<{}> = ({ }) => {
  const grids = store(state => state.grids)
  const activeGridId = store(state => state.activeGridId)

  const grid = useMemo<Grid>(() => {
    return grids.find(g => g.id === activeGridId)!
  }, [grids, activeGridId])

  return (
    <>
      <div className='container'>
        {!grid.areTitlesHidden &&
          <div className="grid-text">
            {grid?.text ?? ""}
          </div>
        }
      </div>

      <style jsx>
        {`
          .container {
            width: 400px;
          }

          .grid-text {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
          }
        `}
      </style>
    </>
  )
}

export default GridInfoViewer
