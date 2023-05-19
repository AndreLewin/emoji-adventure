import DisplayText from "../DisplayText"
import HoveringTextSpans from "../HoveringTextSpans"
import GridInfoViewer from "./GridInfoViewer"
import GridViewer from "./GridViewer"

const Viewers: React.FC<{}> = ({ }) => {

  return (
    <div>
      <GridViewer />
      <GridInfoViewer />
      <DisplayText />
      <div style={{ "position": "absolute", "top": "0px", "left": "0px", "pointerEvents": "none" }}>
        <HoveringTextSpans />
      </div>
    </div>
  )
}

export default Viewers
