import Alert from "./codeGenerationButtons/Alert";
import Confirm from "./codeGenerationButtons/Confirm";
import Prompt from "./codeGenerationButtons/Prompt";
import Text from "./codeGenerationButtons/Text";
import MoveToGrid from "./codeGenerationButtons/MoveToGrid";
import AskForName from "./codeGenerationButtons/AskForName";
import GlobalVariable from "./codeGenerationButtons/GlobalVariable";
import Subscribers from "./codeGenerationButtons/Subscribers";
import Configs from "./codeGenerationButtons/Configs";
import UpdateElement from "./codeGenerationButtons/UpdateElement";
import DeleteElement from "./codeGenerationButtons/DeleteElement";
import UpdateOtherCell from "./codeGenerationButtons/UpdateOtherCell";
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
        <Subscribers gridId={gridId} cellIndex={cellIndex} />
        <Configs gridId={gridId} cellIndex={cellIndex} />
        <div />
        <UpdateElement gridId={gridId} cellIndex={cellIndex} />
        <DeleteElement gridId={gridId} cellIndex={cellIndex} />
        <UpdateOtherCell gridId={gridId} cellIndex={cellIndex} />
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