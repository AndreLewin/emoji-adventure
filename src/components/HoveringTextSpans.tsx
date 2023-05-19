import { useMemo } from "react"
import store, { HoveringText } from "../store"
import HoveringTextSpan from "./HoveringTextSpan"

const HoveringTextSpans: React.FC<{}> = ({ }) => {
  const grids = store(state => state.grids)
  const activeGridId = store(state => state.activeGridId)
  const hoveringTexts = useMemo<HoveringText[]>(() => {
    return grids.find(g => g.id === activeGridId)!.hoveringTexts ?? []
  }, [grids, activeGridId])

  return (
    <>
      <div
        className="text-spans-container"
      >
        {hoveringTexts.map((hoveringText, index) => {
          return <HoveringTextSpan key={`ht-${index}`} gridId={activeGridId} hoveringTextIndex={index} hoveringText={hoveringText} />
        })}
      </div>
      <style jsx>
        {`
          .text-spans-container {
            width: 400px;
            height: 400px;
            position: relative;
            pointer-events: none;
          }
        `}
      </style>
    </>
  )
}

export default HoveringTextSpans