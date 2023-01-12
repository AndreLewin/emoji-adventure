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
        <div className="grid-text">
          {grid.text}
        </div>
      </div>

      <style jsx>
        {`
          .container {
            
          }
        `}
      </style>
    </>
  )
}

export default GridInfoViewer
