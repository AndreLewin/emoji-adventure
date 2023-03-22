import { Button, Modal, TextInput } from "@mantine/core";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import store, { Grid } from "../store";

const GridInfo: React.FC<{}> = ({ }) => {
  const grids = store(state => state.grids)
  const activeGridId = store(state => state.activeGridId)
  const updateGrid = store(state => state.updateGrid)

  const grid = useMemo<Grid>(() => {
    return grids.find(g => g.id === activeGridId)!
  }, [grids, activeGridId])

  const handleTextChange = useCallback<any>((event: ChangeEvent<HTMLInputElement>) => {
    updateGrid({
      gridId: grid.id,
      gridUpdate: {
        text: event.target.value
      }
    })
  }, [grid])

  const handleBackgroundChange = useCallback<any>((event: ChangeEvent<HTMLInputElement>) => {
    updateGrid({
      gridId: grid.id,
      gridUpdate: {
        backgroundImage: event.target.value
      }
    })
  }, [grid])

  return (
    <>
      <div className='container'>
        <TextInput
          value={grid.text}
          onChange={handleTextChange}
          placeholder="Grid title / text"
        />
        <TextInput
          value={grid.backgroundImage ?? ""}
          onChange={handleBackgroundChange}
          placeholder="Background image url"
        />
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

export default GridInfo
