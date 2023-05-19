import Alert from "./codeGenerationButtons/Alert";
import Confirm from "./codeGenerationButtons/Confirm";
import Prompt from "./codeGenerationButtons/Prompt";
import Text from "./codeGenerationButtons/Text";
import MoveToGrid from "./codeGenerationButtons/MoveToGrid";
import AskForName from "./codeGenerationButtons/AskForName";
import GlobalVariable from "./codeGenerationButtons/GlobalVariable";
import Subscribers from "./codeGenerationButtons/Subscribers";
import VisibleVariables from "./codeGenerationButtons/VisibleVariables";
import LocalCell from "./codeGenerationButtons/LocalCell";
import LocalGrid from "./codeGenerationButtons/LocalGrid";
import LocalAdventure from "./codeGenerationButtons/LocalAdventure";
import PlaySound from "./codeGenerationButtons/PlaySound";
import Music from "./codeGenerationButtons/Music";
import HoveringTexts from "./codeGenerationButtons/HoveringTexts";
import FetchData from "./codeGenerationButtons/FetchData";
import MoveCell from "./codeGenerationButtons/MoveCell";
import Movement from "./codeGenerationButtons/Movement";
import Intervals from "./codeGenerationButtons/Intervals";
import Chronometer from "./codeGenerationButtons/Chronometer";
import Animations from "./codeGenerationButtons/Animations";
import GlobalFunctions from "./codeGenerationButtons/GlobalFunctions";
import CellSubscribers from "./codeGenerationButtons/CellSubscribers";

const CodeGenerationButtons: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {

  return (
    <>
      <div className='container'>
        <Alert gridId={gridId} cellIndex={cellIndex} />
        <Confirm gridId={gridId} cellIndex={cellIndex} />
        <Prompt gridId={gridId} cellIndex={cellIndex} />
        <Text gridId={gridId} cellIndex={cellIndex} />
        <MoveToGrid gridId={gridId} cellIndex={cellIndex} />
        <div />
        {/* <AskForName gridId={gridId} cellIndex={cellIndex} /> */}
        <div />
        <GlobalVariable gridId={gridId} cellIndex={cellIndex} />
        <VisibleVariables gridId={gridId} cellIndex={cellIndex} />
        <Subscribers gridId={gridId} cellIndex={cellIndex} />
        <div />
        <LocalCell gridId={gridId} cellIndex={cellIndex} />
        <LocalGrid gridId={gridId} cellIndex={cellIndex} />
        <LocalAdventure gridId={gridId} cellIndex={cellIndex} />
        <div />
        <PlaySound gridId={gridId} cellIndex={cellIndex} />
        <Music gridId={gridId} cellIndex={cellIndex} />
        <HoveringTexts gridId={gridId} cellIndex={cellIndex} />
        <FetchData gridId={gridId} cellIndex={cellIndex} />
        <div />
        <MoveCell gridId={gridId} cellIndex={cellIndex} />
        <Movement gridId={gridId} cellIndex={cellIndex} />
        <Intervals gridId={gridId} cellIndex={cellIndex} />
        <Chronometer gridId={gridId} cellIndex={cellIndex} />
        <div />
        <Animations gridId={gridId} cellIndex={cellIndex} />
        <GlobalFunctions gridId={gridId} cellIndex={cellIndex} />
        <CellSubscribers gridId={gridId} cellIndex={cellIndex} />
      </div>
      <style jsx>
        {`
          .container {
            
          }
        `}
      </style>
    </>
  )
}

export default CodeGenerationButtons