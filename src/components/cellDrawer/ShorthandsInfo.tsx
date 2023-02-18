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
            {`Variables starting with @ are called Shorthands. They are shortcuts to real javascript variables and calls. Shortcuts are converted to javascript just before execution.`}
            <div> </div>
            {`Shorthands with two @ use information from the context where the script is executed. For example, a grid script will have access to "gridId", and a cell script will have access to "gridId" and "cellId".`}
            {` Do not use shorthands with two @ in a callback of a map variable (the second parameter of window._ss().mapSubscribe). This is because the original context is lost.`}
            <div> </div>
          </div>

          <Table withColumnBorders>
            <tbody>
              <div>
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
              </div>
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