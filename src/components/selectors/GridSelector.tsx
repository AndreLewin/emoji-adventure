import { Button, SegmentedControl, SegmentedControlItem } from "@mantine/core"
import { useCallback, useMemo } from "react"
import store from "../../store"

const GridSelector: React.FC<{}> = ({ }) => {
  const activeGrid = store(state => state.activeGrid)
  const grids = store(state => state.grids)
  const set = store(state => state.set)
  const createGrid = store(state => state.createGrid)

  const choices = useMemo<SegmentedControlItem[]>(() => {
    return grids.map((g, index) => {
      return {
        label: `${index}: ${g.text.length <= 10 ? g.text : (g.text.substring(0, 10) + '...')}`,
        value: `${index}`
      }
    })
  }, [grids])

  const handleChange = useCallback<any>((selectedGridIndexString: string) => {
    const selectedGridIndex: number = parseInt(selectedGridIndexString, 10)
    set({ activeGrid: selectedGridIndex })
  }, [])

  return (
    <>
      <div className='container'>
        <SegmentedControl
          value={`${activeGrid}`}
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