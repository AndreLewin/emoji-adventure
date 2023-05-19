import { useCallback, useMemo } from "react"
import store, { HoveringText } from "../store"
import { useMouse } from "@mantine/hooks"
import HoveringTextInput from "./HoveringTextInput"

const HoveringTextInputs: React.FC<{}> = ({ }) => {
  const grids = store(state => state.grids)
  const activeGridId = store(state => state.activeGridId)
  const createHoveringText = store(state => state.createHoveringText)
  const hoveringTexts = useMemo<HoveringText[]>(() => {
    return grids.find(g => g.id === activeGridId)!.hoveringTexts ?? []
  }, [grids, activeGridId])

  const { ref, x, y } = useMouse()

  const handleOnClick = useCallback<any>(() => {
    if (x > 380 || y > 380) return

    createHoveringText({
      gridId: activeGridId,
      hoveringText: {
        x,
        y,
        text: ""
      }
    })
  }, [hoveringTexts, x, y])

  return (
    <>
      <div
        className="container"
        onClick={handleOnClick}
        ref={ref}
      >
        {hoveringTexts.map((hoveringText, index) => {
          return <HoveringTextInput key={`ht-${index}`} gridId={activeGridId} hoveringTextIndex={index} hoveringText={hoveringText} />
        })}
      </div>
      <style jsx>
        {`
          .container {
            width: 400px;
            height: 400px;
            background-color: #ffffff7d;

            position: relative;
            cursor: cell
          }
        `}
      </style>
    </>
  )
}

export default HoveringTextInputs