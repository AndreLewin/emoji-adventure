import DisplayText from "./codeGenerationButtons/DisplayText";
import MoveToGrid from "./codeGenerationButtons/MoveToGrid";
import AskForName from "./codeGenerationButtons/AskForName";
import GlobalVariable from "./codeGenerationButtons/GlobalVariable";
import Subscribers from "./codeGenerationButtons/Subscribers";
import Configs from "./codeGenerationButtons/Configs";
import UpdateElement from "./codeGenerationButtons/UpdateElement";
import DeleteElement from "./codeGenerationButtons/DeleteElement";

const CodeGenerationButtons: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {

  return (
    <>
      <div className='container'>
        <DisplayText gridId={gridId} cellIndex={cellIndex} />
        <MoveToGrid gridId={gridId} cellIndex={cellIndex} />
        <AskForName gridId={gridId} cellIndex={cellIndex} />
        <div />
        <GlobalVariable gridId={gridId} cellIndex={cellIndex} />
        <Subscribers gridId={gridId} cellIndex={cellIndex} />
        <Configs gridId={gridId} cellIndex={cellIndex} />
        <div />
        <UpdateElement gridId={gridId} cellIndex={cellIndex} />
        <DeleteElement gridId={gridId} cellIndex={cellIndex} />
        <div />
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