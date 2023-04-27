import { ChangeEvent, useCallback, useMemo, useState } from "react"
import { IconSettings } from '@tabler/icons'
import store, { Grid } from "../../../store"
import { Button, Modal, Checkbox } from "@mantine/core"

const GridSettings: React.FC<{}> = ({ }) => {
  const activeGridId = store(state => state.activeGridId)
  const grids = store(state => state.grids)
  const updateGrid = store(state => state.updateGrid)


  const grid = useMemo<Grid>(() => {
    return grids.find(g => g.id === activeGridId)!
  }, [grids, activeGridId])

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const handleChange = useCallback<any>((gridUpdate: Partial<Grid>) => {
    updateGrid({
      gridId: grid.id,
      gridUpdate
    })
  }, [grid])

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        leftIcon={<IconSettings />}
      >
        Grid Settings
        {isModalOpen && (
          <Modal
            opened={isModalOpen}
            styles={{ header: { position: "absolute", top: 0, right: 0, margin: "5px" } }}
            onClose={() => setIsModalOpen(false)}
          >
            <Checkbox
              label="Hide grid titles"
              checked={grid.areTitlesHidden ?? false}
              onChange={() => handleChange({ areTitlesHidden: !grid.areTitlesHidden })}
            />
            <Checkbox
              label="Hide borders around cells with click script"
              checked={grid.areClickSquaresHidden ?? false}
              onChange={() => handleChange({ areClickSquaresHidden: !grid.areClickSquaresHidden })}
            />
          </Modal>
        )}
      </Button>
      <style jsx>
        {`
          .container {
            
          }

          .link {
            color: darkblue
          }
        `}
      </style>
    </>
  )
}

export default GridSettings