import { Button, TextInput } from "@mantine/core";
import { ChangeEvent, useCallback, useMemo } from "react";
import store from "../store";

const GridInfo: React.FC<{}> = ({ }) => {
  const grids = store(state => state.grids)
  const activeGrid = store(state => state.activeGrid)
  const changeGridText = store(state => state.changeGridText)
  const deleteGrid = store(state => state.deleteGrid)

  const gridText = useMemo<string>(() => {
    return grids[activeGrid]?.text ?? ""
  }, [grids, activeGrid])

  const handleTextChange = useCallback<any>((event: ChangeEvent<HTMLInputElement>) => {
    changeGridText(event.target.value)
  }, [])

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
          onClick={() => deleteGrid(activeGrid)}
        >
          Delete Grid
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

export default GridInfo
