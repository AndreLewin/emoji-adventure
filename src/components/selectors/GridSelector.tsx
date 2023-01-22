import { Button, SegmentedControl, SegmentedControlItem } from "@mantine/core"
import { useCallback, useMemo } from "react"
import store from "../../store"

const GridSelector: React.FC<{}> = ({ }) => {
  const activeGridId = store(state => state.activeGridId)
  const grids = store(state => state.grids)
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
    store.setState({ activeGridId: selectedGridIndex })
  }, [])

  return (
    <>
      <div className='container'>
        <SegmentedControl
          value={`${activeGridId}`}
          onChange={handleChange}
          data={choices}
        />
        <Button color="teal" onClick={() => createGrid({})}>
          Create Grid
        </Button>
        <Button color="teal" onClick={() => createGrid({ idOfGridToCopy: activeGridId })}>
          Duplicate Grid
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