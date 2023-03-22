import { Button, Modal, SegmentedControl, SegmentedControlItem } from "@mantine/core"
import { useCallback, useMemo, useState } from "react"
import store, { Grid } from "../../store"

const GridSelector: React.FC<{}> = ({ }) => {
  const activeGridId = store(state => state.activeGridId)
  const grids = store(state => state.grids)
  const createGrid = store(state => state.createGrid)
  const deleteGrid = store(state => state.deleteGrid)

  const grid = useMemo<Grid>(() => {
    return grids.find(g => g.id === activeGridId)!
  }, [grids, activeGridId])

  const choices = useMemo<SegmentedControlItem[]>(() => {
    return grids.map(g => {
      return {
        label: `${g.id}: ${g.text.length <= 10 ? g.text : (g.text.substring(0, 10) + '...')}`,
        value: `${g.id}`
      }
    })
  }, [grids])

  const handleChange = useCallback<any>((selectedGridIndexString: string) => {
    const selectedGridIndex: number = parseInt(selectedGridIndexString, 10)
    store.setState({ activeGridId: selectedGridIndex })
  }, [])

  const [isDeleteConfirmModalOpened, setIsDeleteConfirmModalOpened] = useState<boolean>(false)

  return (
    <>
      <div className='container'>
        <Button color="teal" onClick={() => createGrid({})}>
          Create Grid
        </Button>
        <Button color="teal" onClick={() => createGrid({ idOfGridToCopy: activeGridId })}>
          Duplicate Grid
        </Button>
        <Button
          color="red"
          disabled={grids.length <= 1}
          onClick={() => setIsDeleteConfirmModalOpened(true)}
        >
          Delete Grid
        </Button>
        <div>
          <SegmentedControl
            value={`${activeGridId}`}
            onChange={handleChange}
            data={choices}
          />
        </div>
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

export default GridSelector