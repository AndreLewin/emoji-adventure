import { Dispatch, SetStateAction } from "react"
import { Drawer } from "@mantine/core"
import { Cell } from "../store"

const CellDrawer: React.FC<{ isDrawerOpened: boolean, setIsDrawerOpened: Dispatch<SetStateAction<boolean>>, cell: Cell, index: number }> = (
  { isDrawerOpened, setIsDrawerOpened, cell, index }
) => {
  return (
    <Drawer opened={isDrawerOpened} onClose={() => setIsDrawerOpened(false)} title={`Cell ${index}`} position="right" transitionDuration={0} overlayOpacity={0.2} size="xl">
      CONTENT



      <style jsx>
        {`
          .container {
            
          }
        `}
      </style>
    </Drawer>
  )
}

export default CellDrawer