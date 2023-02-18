import { Button, Checkbox, Divider, Modal, Select, Textarea, TextInput } from "@mantine/core"
import { useCallback, useMemo, useState } from "react"
import store, { Cell } from "../../store"
import { getCellPositionFromCellIndex, getSameColumnSymmetricalCellIndex, getSameLineSymmetricalCellIndex } from "../../utils/math"

const MoveShortcutModal: React.FC<{
  closeModal: () => any
  cell: Cell
  cellIndex: number
  gridId: number
}> = ({
  closeModal,
  cell,
  cellIndex,
  gridId
}) => {
    const [shouldCreateSameColumnSymmetricEvent, setShouldCreateSameColumnSymmetricEvent] = useState<boolean>(
      getCellPositionFromCellIndex(cellIndex).line === 1 || getCellPositionFromCellIndex(cellIndex).line === 10
    )
    const [shouldCreateSameLineSymmetricEvent, setShouldCreateSameLineSymmetricEvent] = useState<boolean>(
      getCellPositionFromCellIndex(cellIndex).column === 1 || getCellPositionFromCellIndex(cellIndex).column === 10
    )
    const [shouldCopyCurrentGrid, setShouldCopyCurrentGrid] = useState<boolean>(false)
    const [newGridName, setNewGridName] = useState<string>("")

    const getCell = store(state => state.getCell)
    const updateCellWithAppend = store(state => state.updateCellWithAppend)
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
      targetGridId,
      isGoingToNewGrid
    }: {
      targetGridId?: string,
      isGoingToNewGrid?: boolean
    }) => {
      let targetGrid = targetGridId
      let newGrid = null
      if (isGoingToNewGrid) {
        newGrid = createGrid({
          ...(shouldCopyCurrentGrid ? { idOfGridToCopy: activeGridId } : {}),
          ...(newGridName !== "" ? { name: newGridName } : {})
        })
        targetGrid = `${newGrid.id}`
      }

      // update script on selected cell
      const selectedCell = getCell({ gridId, cellIndex })
      if (selectedCell === null) return
      updateCellWithAppend({
        gridId,
        cellIndex,
        cellUpdate: {
          onClickCScript: `@m(${targetGrid}) `
        }
      })

      // update script on symmetric cell
      if (shouldCreateSameColumnSymmetricEvent || shouldCreateSameLineSymmetricEvent) {
        if (targetGrid === undefined) return
        let symmetricalCellIndex = cellIndex
        if (shouldCreateSameColumnSymmetricEvent) symmetricalCellIndex = getSameColumnSymmetricalCellIndex(symmetricalCellIndex, 10)
        if (shouldCreateSameLineSymmetricEvent) symmetricalCellIndex = getSameLineSymmetricalCellIndex(symmetricalCellIndex, 10)

        const selectedCell = getCell({ gridId: parseInt(targetGrid, 10), cellIndex: symmetricalCellIndex })
        if (selectedCell === null) return
        updateCellWithAppend({
          gridId: parseInt(targetGrid, 10),
          cellIndex: symmetricalCellIndex,
          cellUpdate: {
            onClickCScript: `@m(${activeGridId}) `
          }
        })
      }
      // // update script on symmetric cell
      // if (shouldCreateSameColumnSymmetricEvent || shouldCreateSameLineSymmetricEvent) {
      //   const grid = isGoingToNewGrid ? newGrid : grids.find(g => `${g.id}` === targetGrid)
      //   if (!grid) return
      //   let symmetricalCellIndex = cellIndex
      //   if (shouldCreateSameColumnSymmetricEvent) symmetricalCellIndex = getSameColumnSymmetricalCellIndex(symmetricalCellIndex, 10)
      //   if (shouldCreateSameLineSymmetricEvent) symmetricalCellIndex = getSameLineSymmetricalCellIndex(symmetricalCellIndex, 10)
      //   let newScript = grid.cells[symmetricalCellIndex]?.script ?? ""
      //   newScript = `${newScript}${newScript === "" ? "" : "\n"}window._s.setState({ activeGridId: ${activeGridId} }) `
      //   updateCell({
      //     gridId: grid.id,
      //     cellIndex: symmetricalCellIndex,
      //     cellUpdate: { script: newScript }
      //   })
      // }

      closeModal()
      setTimeout(() => {
        const codeEditor = window.document.querySelector(".npm__react-simple-code-editor__textarea") as HTMLElement
        codeEditor?.focus()
      }, 50);
    }, [grids, shouldCreateSameColumnSymmetricEvent, shouldCreateSameLineSymmetricEvent, activeGridId, shouldCopyCurrentGrid, newGridName, cellIndex])

    return (
      <Modal
        opened={true}
        onClose={() => closeModal()}
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
          onChange={(event) => handleSelectedGrid({ targetGridId: event })}
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
        <style jsx>
          {`
            .container {
              
            }
          `}
        </style>
      </Modal>
    )
  }

export default MoveShortcutModal