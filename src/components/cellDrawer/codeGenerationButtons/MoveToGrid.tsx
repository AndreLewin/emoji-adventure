import { Button, Checkbox, Modal, Select, Textarea } from "@mantine/core"
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react"
import store from "../../../store"
import { getSameLineSymmetricalCellIndex, getSameColumnSymmetricalCellIndex } from "../../../utils/math"

const MoveToGrid: React.FC<{ setScript: Dispatch<SetStateAction<string>>, cellIndex: number }> = ({ setScript, cellIndex }) => {

  const [isModalOpened, setIsModalOpened] = useState<boolean>(false)
  const [shouldCreateSameColumnSymmetricEvent, setShouldCreateSameColumnSymmetricEvent] = useState<boolean>(false)
  const [shouldCreateSameLineSymmetricEvent, setShouldCreateSameLineSymmetricEvent] = useState<boolean>(false)

  const updateCell = store(state => state.updateCell)
  const activeGridId = store(state => state.activeGridId)

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

  const handleSelectedGrid = useCallback<any>((gridId: string | null) => {
    setScript(s => `${s}${s === "" ? "" : "\n"}window._s.setState({ activeGridId: ${gridId} }) `)
    if (shouldCreateSameColumnSymmetricEvent || shouldCreateSameLineSymmetricEvent) {
      const grid = grids.find(g => `${g.id}` === gridId)
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
  }, [grids, shouldCreateSameColumnSymmetricEvent, shouldCreateSameLineSymmetricEvent, activeGridId])

  return (
    <>
      <span className='container'>
        <Button onClick={() => setIsModalOpened(true)}>{`Move to Grid`}</Button>
        <Modal
          opened={isModalOpened}
          onClose={() => { setIsModalOpened(false) }}
          styles={{ header: { position: "absolute", top: 0, right: 0, margin: "5px" } }}
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
          <Select
            label="Grid to move to"
            value={null}
            onChange={handleSelectedGrid}
            data={selectData}
          />
          {/* <Button
            onClick={handleConfirm}
            fullWidth
            mt="md"
          >
            Confirm
          </Button> */}
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