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
            {`Variables starting with #, @ or ^ are called Shorthands. They are shortcuts to real javascript variables and calls. Shortcuts are converted to javascript just before execution.`}
            <div> </div>
            {`# are adventure shorthands, they have the same effect wherever they are used. @ are grid shorthands, their value or effect is local to the grid or cell where there are used. ^ are cell shorthands, their value is only for a specific cell in one grid.`}
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