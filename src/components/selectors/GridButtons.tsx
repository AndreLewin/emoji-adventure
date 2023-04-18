import { Button, Modal, SegmentedControl, SegmentedControlItem } from "@mantine/core"
import { useCallback, useMemo, useState } from "react"
import store, { Grid } from "../../store"
import GridSettings from "./gridButtons/GridSettings"

const GridButtons: React.FC<{}> = ({ }) => {
  const activeGridId = store(state => state.activeGridId)
  const grids = store(state => state.grids)
  const createGrid = store(state => state.createGrid)
  const deleteGrid = store(state => state.deleteGrid)

  const grid = useMemo<Grid>(() => {
    return grids.find(g => g.id === activeGridId)!
  }, [grids, activeGridId])

  const choices = useMemo<SegmentedControlItem[]>(() => {
    return grids.map(g => {
      const text = g?.text ?? ""
      return {
        label: `${g.id}: ${text.length <= 10 ? text : (text.substring(0, 10) + '...')}`,
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
        <div style={{ display: "flex" }}>
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
          <GridSettings />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {choices.map((c, i) => {
            return (
              <div
                className={`grid-select ${c.value === `${activeGridId}` ? "selected" : ""}`}
                key={`grid-button-${c.value}`}
                onClick={() => handleChange(c.value)}
              >
                {c.label}
              </div>
            )
          })}
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

        .grid-select {
          border-radius: 5px;
          border: 1px solid lightgray;
          min-width: 27px;
          height: 32px;
          padding: 3px;
          text-align: center;
          cursor: pointer;
        }

        .selected {
          background-color: lightgray;
        }
      `}
      </style>
    </>
  )
}

export default GridButtons