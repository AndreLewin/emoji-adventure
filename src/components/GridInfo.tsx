import { Button, Modal, TextInput } from "@mantine/core";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import store from "../store";

const GridInfo: React.FC<{}> = ({ }) => {
  const grids = store(state => state.grids)
  const activeGridId = store(state => state.activeGridId)
  const changeGridText = store(state => state.changeGridText)
  const deleteGrid = store(state => state.deleteGrid)

  const gridText = useMemo<string>(() => {
    return grids.find(g => g.id === activeGridId)?.text ?? ""
  }, [grids, activeGridId])

  const handleTextChange = useCallback<any>((event: ChangeEvent<HTMLInputElement>) => {
    changeGridText(event.target.value)
  }, [])

  const [isDeleteConfirmModalOpened, setIsDeleteConfirmModalOpened] = useState<boolean>(false)

  return (
    <>
      <div className='container'>
        <TextInput
          value={gridText}
          onChange={handleTextChange}
          placeholder="Grid text"
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
        title={`Are you sure to delete the grid ${activeGridId}: ${gridText}?`}
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
