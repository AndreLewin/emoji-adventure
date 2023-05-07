import { Button, Modal, Table } from "@mantine/core"
import { useState } from "react"
import { getRegexes } from "../../utils/evalScript"

const regexes = getRegexes("%GRIDID%", "%CELLID%")

const ShorthandsInfo: React.FC<{}> = ({ }) => {

  const [isModalOpened, setIsModalOpened] = useState<boolean>(false)

  return (
    <>
      <span className='container'>
        <Button onClick={() => setIsModalOpened(true)} color="gray">Shorthands info</Button>
        <Modal
          opened={isModalOpened}
          onClose={() => { setIsModalOpened(false) }}
          fullScreen
          styles={{ header: { position: "absolute", top: 0, right: 0, margin: "5px" } }}
        >
          <div style={{ marginBottom: "10px" }}>
            {`Variables starting with #, @ or ^ are called Shorthands. They are shortcuts to real javascript variables and calls. Shortcuts are converted to javascript when the script is evaluated (for example when the button Try Script is clicked or a cell is clicked).`}
            <div> </div>
            {`# are adventure shorthands, they have the same effect wherever they are used. @ are grid shorthands, their value or effect is local to the grid or cell where there are used. ^ are cell shorthands, their value is only for a specific cell in one grid.`}
            <div> </div>
            {`In the Cell context (the scripts on the right panel), you can use all shorthands. In the Grid context, you can use only adventure and grid shorthands. In the Adventure context, you can use only adventure shorthands.`}
            <div> </div>
            {`Shorthands that are placed in the wrong context won't be replaced. This might result in invalid JS code. (But you might want that if your goal is to programmatically place scripts in cells via a Grid or Adventure script.`}
            <div> </div>
            {`WIP: examples showing how to use store state function directly (_getCell instead of _store.getState().getCell), updateCell, getGrid, floodFill, createGrid. Global functions: getRelativeCellIndex, getCellIndexFromCellPosition, getCellPositionFromCellIndex...`}
            <div> </div>
          </div>

          <Table withColumnBorders>
            <tbody>
              <tr>
                <th>Shorthand</th>
                <th>Full command</th>
                <th>Function</th>
              </tr>
              {
                regexes.map((regex, id) => {
                  return (
                    <tr key={`regex-${id}`}>
                      <td>{regex[3] ?? regex[0] as string}</td>
                      <td>{regex[1]}</td>
                      <td>{regex[2]}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
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

export default ShorthandsInfo