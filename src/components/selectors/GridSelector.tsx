import { Button, SegmentedControl, SegmentedControlItem } from "@mantine/core"
import { useCallback, useMemo } from "react"
import store from "../../store"

const GridSelector: React.FC<{}> = ({ }) => {
  const activeGridId = store(state => state.activeGridId)
  const grids = store(state => state.grids)
  const set = store(state => state.set)
  const createGrid = store(state => state.createGrid)

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
    set({ activeGridId: selectedGridIndex })
  }, [])

  return (
    <>
      <div className='container'>
        <SegmentedControl
          value={`${activeGridId}`}
          onChange={handleChange}
          data={choices}
        />
        <Button onClick={createGrid}>
          Create Grid
        </Button>
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

export default GridSelector