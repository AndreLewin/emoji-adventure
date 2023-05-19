import { FormEventHandler, MouseEventHandler, useCallback, useMemo } from "react"
import store, { HoveringText } from "../store"

const HoveringTextSpan: React.FC<{
  gridId: number,
  hoveringTextIndex: number,
  hoveringText: HoveringText
}> = ({ gridId, hoveringTextIndex, hoveringText }) => {
  return (
    <>
      <span
        className="container"
        style={{
          position: "absolute",
          top: `${hoveringText.y}px`,
          left: `${hoveringText.x}px`
        }}
      >
        {hoveringText.text}
      </span>
      <style jsx>
        {`
          .container {
            position: absolute;
          }
        `}
      </style>
    </>
  )
}

export default HoveringTextSpan