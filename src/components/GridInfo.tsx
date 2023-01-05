import { TextInput } from "@mantine/core";
import { ChangeEvent, useCallback, useMemo } from "react";
import store from "../store";

const GridInfo: React.FC<{}> = ({ }) => {
  const grids = store(state => state.grids)
  const activeGrid = store(state => state.activeGrid)
  const changeGridText = store(state => state.changeGridText)

  const gridText = useMemo<string>(() => {
    return grids[activeGrid]?.text ?? ""
  }, [grids, activeGrid])

  const handleChange = useCallback<any>((event: ChangeEvent<HTMLInputElement>) => {
    changeGridText(event.target.value)
  }, [])

  return (
    <>
      <div className='container'>
        <TextInput
          value={gridText}
          onChange={(e) => handleChange(e)}
          placeholder="Grid text"
        />
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
