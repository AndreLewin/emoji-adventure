import { Button, Modal, Table } from "@mantine/core"
import { useState } from "react"

const ShorthandsInfo: React.FC<{}> = ({ }) => {

  const [isModalOpened, setIsModalOpened] = useState<boolean>(false)

  return (
    <>
      <span className='container'>
        <Button onClick={() => setIsModalOpened(true)} color="gray">Shorthands info</Button>
        <Modal
          opened={isModalOpened}
          onClose={() => { setIsModalOpened(false) }}
          size="xl"
          styles={{ header: { position: "absolute", top: 0, right: 0, margin: "5px" } }}
        >
          <div style={{ marginBottom: "10px" }}>
            A shorthand is a faster way to write a command. A shorthand begins with $. It's converted to the full command when the cell is clicked.
          </div>

          <Table withColumnBorders>
            <thead>
              <tr>
                <th>Shorthand</th>
                <th>Use</th>
                <th>Full command</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>$t(s)</td>
                <td>Display the message s</td>
                <td>window.alert(s)</td>
              </tr>
              <tr>
                <td>$m(n)</td>
                <td>Move to the grid n</td>
                <td>{`window._s.setState({ activeGrid: n })`}</td>
              </tr>
              <tr>
                <td>$d(n1, n2)</td>
                <td>Delete script on grid n1 on cell n2</td>
                <td>TODO</td>
              </tr>
              <tr>
                <td>_d</td>
                <td>Delete this script</td>
                <td>TODO</td>
              </tr>
              <tr>
                <td>$$variable</td>
                <td>Access global variable (for all cells)</td>
                <td>window.$adventure1.global_variable</td>
              </tr>
              <tr>
                <td>__variable</td>
                <td>Access local variable (only for this cell). <br /> Use this if you want a value to be remembered between the executions of a same cell.</td>
                <td>window.$adventure1.grid2_cell3_variable</td>
              </tr>
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