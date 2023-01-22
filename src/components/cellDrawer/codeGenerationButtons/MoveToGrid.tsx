import { Button, Checkbox, Divider, Modal, Select, Textarea, TextInput } from "@mantine/core"
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react"
import store from "../../../store"
import { getSameLineSymmetricalCellIndex, getSameColumnSymmetricalCellIndex, getCellPositionFromCellIndex } from "../../../utils/math"

const MoveToGrid: React.FC<{ setScript: Dispatch<SetStateAction<string>>, cellIndex: number }> = ({ setScript, cellIndex }) => {

  const [isModalOpened, setIsModalOpened] = useState<boolean>(false)
  const [shouldCreateSameColumnSymmetricEvent, setShouldCreateSameColumnSymmetricEvent] = useState<boolean>(
    getCellPositionFromCellIndex(cellIndex).line === 1 || getCellPositionFromCellIndex(cellIndex).line === 10
  )
  const [shouldCreateSameLineSymmetricEvent, setShouldCreateSameLineSymmetricEvent] = useState<boolean>(
    getCellPositionFromCellIndex(cellIndex).column === 1 || getCellPositionFromCellIndex(cellIndex).column === 10
  )
  const [shouldCopyCurrentGrid, setShouldCopyCurrentGrid] = useState<boolean>(false)
  const [newGridName, setNewGridName] = useState<string>("")

  const updateCell = store(state => state.updateCell)
  const activeGridId = store(state => state.activeGridId)
  const createGrid = store(state => state.createGrid)

  const grids = store(state => state.grids)
  const selectData = useMemo(() => {
    const gridsExceptActiveOne = grids.filter(g => g.id !== activeGridId)
    return gridsExceptActiveOne.map(grid => {
      return {
        value: `${grid.id}`,
        label: `${grid.id}: ${grid.text}`
      }
    })
  }, [grids])

  const handleSelectedGrid = useCallback<any>(({
    gridId,
    isGoingToNewGrid
  }: {
    gridId?: string,
    isGoingToNewGrid?: boolean
  }) => {
    let targetGrid = gridId
    let newGrid = null
    if (isGoingToNewGrid) {
      newGrid = createGrid({
        ...(shouldCopyCurrentGrid ? { idOfGridToCopy: activeGridId } : {}),
        ...(newGridName !== "" ? { name: newGridName } : {})
      })
      targetGrid = `${newGrid.id}`
    }

    setScript(s => `${s}${s === "" ? "" : "\n"}window._s.setState({ activeGridId: ${targetGrid} }) `)
    if (shouldCreateSameColumnSymmetricEvent || shouldCreateSameLineSymmetricEvent) {
      const grid = isGoingToNewGrid ? newGrid : grids.find(g => `${g.id}` === targetGrid)
      if (!grid) return
      let symmetricalCellIndex = cellIndex
      if (shouldCreateSameColumnSymmetricEvent) symmetricalCellIndex = getSameColumnSymmetricalCellIndex(symmetricalCellIndex, 10)
      if (shouldCreateSameLineSymmetricEvent) symmetricalCellIndex = getSameLineSymmetricalCellIndex(symmetricalCellIndex, 10)
      let newScript = grid.cells[symmetricalCellIndex]?.script ?? ""
      newScript = `${newScript}${newScript === "" ? "" : "\n"}window._s.setState({ activeGridId: ${activeGridId} }) `
      updateCell({
        gridId: grid.id,
        cellIndex: symmetricalCellIndex,
        cellUpdate: { script: newScript }
      })
    }

    setIsModalOpened(false)
    setTimeout(() => {
      const codeEditor = window.document.querySelector(".npm__react-simple-code-editor__textarea") as HTMLElement
      codeEditor?.focus()
    }, 50);
  }, [grids, shouldCreateSameColumnSymmetricEvent, shouldCreateSameLineSymmetricEvent, activeGridId, shouldCopyCurrentGrid, newGridName])

  return (
    <>
      <span className='container'>
        <Button onClick={() => setIsModalOpened(true)}>{`Move to Grid`}</Button>
        <Modal
          opened={isModalOpened}
          onClose={() => { setIsModalOpened(false) }}
          styles={{ header: { position: "absolute", top: 0, right: 0, margin: "5px" } }}
          size="lg"
        >
          <Checkbox
            checked={shouldCreateSameLineSymmetricEvent}
            onChange={(event) => { setShouldCreateSameLineSymmetricEvent(event.currentTarget.checked), setShouldCreateSameColumnSymmetricEvent(false) }}
            label="Create a mirror event on the same line on the target grid"
          />
          <Checkbox
            checked={shouldCreateSameColumnSymmetricEvent}
            onChange={(event) => { setShouldCreateSameColumnSymmetricEvent(event.currentTarget.checked), setShouldCreateSameLineSymmetricEvent(false) }}
            label="Create a mirror event on the same column on the target grid"
          />
          <Divider size="sm" my="xs" label="Move to existing Grid" labelPosition="center" />
          <Select
            value={null}
            onChange={(event) => handleSelectedGrid({ gridId: event })}
            data={selectData}
          />
          <Divider size="sm" my="xs" label="Move to a new Grid" labelPosition="center" />
          <Checkbox
            checked={shouldCopyCurrentGrid}
            onChange={() => { setShouldCopyCurrentGrid(!shouldCopyCurrentGrid) }}
            label="Copy colors and emojis from current grid"
          />
          <TextInput
            value={newGridName}
            onChange={(event) => setNewGridName(event.target.value)}
            placeholder="New grid name"
          />
          <Button
            onClick={() => handleSelectedGrid({ isGoingToNewGrid: true })}
            fullWidth
            mt="md"
          >
            Create
          </Button>
        </Modal>
      </span>
      <style jsx>
        {`
          .container {
            
          }
        `}
      </style>
    </>
  )
}

export default MoveToGrid