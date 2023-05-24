import { useViewportSize } from "@mantine/hooks"
import DisplayText from "../DisplayText"
import HoveringTextSpans from "../HoveringTextSpans"
import GridInfoViewer from "./GridInfoViewer"
import GridViewer from "./GridViewer"
import { useMemo } from "react"

const Viewers: React.FC<{}> = ({ }) => {
  const { height, width } = useViewportSize()

  // make sure the whole grid (and the rest) is visible even if width < 400px
  // https://css-tricks.com/scaled-proportional-blocks-with-css-and-javascript/
  const scale = useMemo<number>(() => {
    if (width >= 400) return 1
    return width / 400
  }, [width])

  return (
    <div className="viewer-container" style={{ transform: `scale(${scale})` }}>
      <GridViewer />
      <GridInfoViewer />
      <DisplayText />
      <div style={{ "position": "absolute", "top": "0px", "left": "0px", "pointerEvents": "none" }}>
        <HoveringTextSpans />
      </div>

      <style jsx>
        {`
          .viewer-container {
            transform-origin: 0px 0px;
          }
        `}
      </style>
    </div>
  )
}

export default Viewers
