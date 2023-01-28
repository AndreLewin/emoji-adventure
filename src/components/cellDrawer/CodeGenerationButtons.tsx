import DisplayText from "./codeGenerationButtons/DisplayText";
import MoveToGrid from "./codeGenerationButtons/MoveToGrid";
import AskForName from "./codeGenerationButtons/AskForName";
import GlobalVariable from "./codeGenerationButtons/GlobalVariable";
import RemoveScript from "./codeGenerationButtons/RemoveScript";
import ChangeEmoji from "./codeGenerationButtons/ChangeEmoji";
import MapVariable from "./codeGenerationButtons/MapVariable";

const CodeGenerationButtons: React.FC<{ gridId: number, cellIndex: number }> = ({ gridId, cellIndex }) => {

  return (
    <>
      <div className='container'>
        <DisplayText gridId={gridId} cellIndex={cellIndex} />
        <MoveToGrid gridId={gridId} cellIndex={cellIndex} />
        <div />
        <AskForName gridId={gridId} cellIndex={cellIndex} />
        <GlobalVariable gridId={gridId} cellIndex={cellIndex} />
        <div />
        <RemoveScript gridId={gridId} cellIndex={cellIndex} />
        <ChangeEmoji gridId={gridId} cellIndex={cellIndex} />
        <div />
        <MapVariable gridId={gridId} cellIndex={cellIndex} />
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