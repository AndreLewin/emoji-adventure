import { Button, Modal, TextInput } from "@mantine/core";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import store, { Grid } from "../store";

const GridInfo: React.FC<{}> = ({ }) => {
  const grids = store(state => state.grids)
  const activeGridId = store(state => state.activeGridId)
  const updateGrid = store(state => state.updateGrid)
  const deleteGrid = store(state => state.deleteGrid)

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

  const [isDeleteConfirmModalOpened, setIsDeleteConfirmModalOpened] = useState<boolean>(false)

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
        <Button
          color="red"
          disabled={grids.length <= 1}
          onClick={() => setIsDeleteConfirmModalOpened(true)}
        >
          Delete Grid
        </Button>
      </div>

      <Modal
        opened={isDeleteConfirmModalOpened}
        onClose={() => setIsDeleteConfirmModalOpened(false)}
        title={`Are you sure to delete the grid ${activeGridId}: ${grid.text}?`}
      >
        <Button
          color="red"
          disabled={grids.length <= 1}
          onClick={() => { deleteGrid(activeGridId), setIsDeleteConfirmModalOpened(false) }}
        >
          Delete Grid
        </Button>
      </Modal>

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
