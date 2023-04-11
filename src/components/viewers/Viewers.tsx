import DisplayText from "../DisplayText"
import GridInfoViewer from "./GridInfoViewer"
import GridViewer from "./GridViewer"

const Viewers: React.FC<{}> = ({ }) => {

  return (
    <div>
      <GridViewer />
      <GridInfoViewer />
      <DisplayText />
    </div>
  )
}

export default Viewers
