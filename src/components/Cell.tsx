import { Cell } from "./Grid"

const CellComponent: React.FC<{ cell: Cell }> = ({ cell }) => {

  return (
    <>
      <div
        style={{ "backgroundColor": cell.color }}
      >
        WIP
      </div>
      <style jsx>
        {`
          
        `}
      </style>
    </>
  )
}

export default CellComponent