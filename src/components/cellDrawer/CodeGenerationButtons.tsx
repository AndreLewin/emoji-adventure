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
import DisplayOnCondition from "./codeGenerationButtons/DisplayOnCondition";
import PlaySound from "./codeGenerationButtons/PlaySound";

const CodeGenerationButtons: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {

  return (
    <>
      <div className='container'>
        <Alert gridId={gridId} cellIndex={cellIndex} />
        <Confirm gridId={gridId} cellIndex={cellIndex} />
        <Prompt gridId={gridId} cellIndex={cellIndex} />
        <Text gridId={gridId} cellIndex={cellIndex} />
        <div />
        <MoveToGrid gridId={gridId} cellIndex={cellIndex} />
        <AskForName gridId={gridId} cellIndex={cellIndex} />
        <div />
        <GlobalVariable gridId={gridId} cellIndex={cellIndex} />
        <VisibleVariables gridId={gridId} cellIndex={cellIndex} />
        <Subscribers gridId={gridId} cellIndex={cellIndex} />
        <div />
        <LocalCell gridId={gridId} cellIndex={cellIndex} />
        <LocalGrid gridId={gridId} cellIndex={cellIndex} />
        <LocalAdventure gridId={gridId} cellIndex={cellIndex} />
        <div />
        <DisplayOnCondition gridId={gridId} cellIndex={cellIndex} />
        <PlaySound gridId={gridId} cellIndex={cellIndex} />
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